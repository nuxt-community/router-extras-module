const { readFileSync } = require('fs')
const { dirname, normalize } = require('path')
const matter = require('gray-matter')

const VALID_EXTRAS = [
  'path',
  'alias',
  'meta',
  'props',
  'name',
  'redirect',
  'beforeEnter',
  'namedViews',
  // 2.6.0+
  'caseSensitive',
  'pathToRegexpOptions'
]

const NUXT_VALID_EXTRAS = [
  'path',
  'meta',
  'props',
  'name',
  'redirect',
  'beforeEnter',
  // 2.6.0+
  'caseSensitive',
  'pathToRegexpOptions'
]

const NAMED_VIEWS_VALID_KEYS = [
  'currentView',
  'views',
  'chunkNames'
]

class NamedViewsValidationError extends Error {
  constructor (componentPath) {
    super(`
Error in router block in file ${componentPath}:
  property "namedViews" must be an object with following keys:
    - "currentView": string, optional, default: 'default'
    - "views": object with string keys and component path values
    - "chunkNames": object with _exactly_ the same keys as "view" and string values, must be present with "views"
            `.trim())
  }
}

/**
 * cache extracted extras
 */
const parsedRoutes = {}

let localRoutes = []

/**
 * Resolve absolute path for the component since nuxt resolution function
 * doesn't seem to do that
 *
 * @param {string} target component path (may be relative)
 * @param {string} current calling component path (route.component)
 * @param {string} srcDir src dir, aliased as `~/` or `@/`
 * @param {string} rootDir root dir, aliased as `~~/` or `@@/`
 * @param {(...args: string[]) => string} resolver nuxt resolution function, to join path parts
 * @returns {string} an absolute path without aliases
 */
function resolveChild (target, current, srcDir, rootDir, resolver) {
  if (target.startsWith('@/') || target.startsWith('~/')) {
    return resolver(srcDir, target.substring(2))
  } else if (target.startsWith('@@/') || target.startsWith('~~/')) {
    return resolver(rootDir, target.substring(3))
  } else {
    return resolver(dirname(current), target)
  }
}

function extendRoutes (routes, options, resolve, { srcDir, rootDir }) {
  localRoutes = localRoutes.concat(routes)

  let additionalRoutes = []

  for (const route of routes) {
    const extras = extractExtrasFromRoute(route)

    Object.assign(route, pick(extras, NUXT_VALID_EXTRAS))

    // handle named views
    const { namedViews = undefined } = extras

    if (namedViews) {
      const preparedComponents = {}

      for (const [key, component] of Object.entries(namedViews.views)) {
        preparedComponents[key] = resolveChild(component, route.component, srcDir, rootDir, resolve)
      }

      // We need to set default even if current view name is specified
      // because nuxt expects the default component to be present
      // and throws runtime webpack error otherwise
      preparedComponents[namedViews.currentView] = route.component
      preparedComponents.default = route.component

      const chunkNames = namedViews.chunkNames

      if (namedViews.currentView !== 'default') {
        chunkNames.default = route.chunkName
        chunkNames[namedViews.currentView] = route.chunkName
      }

      Object.assign(route, {
        components: preparedComponents,
        chunkNames: namedViews.chunkNames
      })

      delete route.component
      delete route.chunkName
    }

    const { alias = [] } = extras
    const simpleAlias = alias.filter(alias => typeof alias === 'string')
    const objectAlias = alias.filter(alias => typeof alias === 'object')

    // It's important to handle object aliases first
    // Before adding alias to root route
    if (objectAlias.length > 0) {
      additionalRoutes = [].concat(additionalRoutes, mapObjectAliases(route, objectAlias))
    }

    if (simpleAlias.length > 0) {
      if (options.routerNativeAlias) {
        Object.assign(route, { alias: simpleAlias })
      } else {
        additionalRoutes = [].concat(additionalRoutes, mapSimpleAliases(route, simpleAlias))
      }
    }

    // process child routes
    if (Array.isArray(route.children)) {
      extendRoutes(route.children, options, resolve, { srcDir, rootDir })
    }
  }

  additionalRoutes.forEach((route) => {
    const index = findDynamicParentIndex(route, routes)
    routes.splice(index < 0 ? routes.length : index, 0, route)
  })
}

function mapSimpleAliases (route, aliases) {
  return aliases.map(alias => Object.assign({}, route, {
    path: alias,
    name: `${route.name}${alias}`
  }))
}

function mapObjectAliases (route, aliases) {
  return aliases.map(alias => Object.assign({}, route, {
    name: `${route.name}${alias.path}`,
    ...pick(alias, NUXT_VALID_EXTRAS)
  }))
}

function invalidateRoute (file) {
  const routes = localRoutes.filter(route => normalize(route.component) === normalize(file))

  /* istanbul ignore next */
  if (!routes.length) {
    return false
  }

  const extras = extractExtrasFromRoute(routes[0], false)

  return extras._needUpdate
}

function extractExtrasFromRoute (route, useCache = true) {
  const previousExtras = parsedRoutes[route.component]
  if (previousExtras && useCache) {
    return previousExtras
  }

  let extras = {
    _raw: '',
    _needUpdate: false
  }

  const routerBlock = extractRouterBlockFromFile(route.component)

  if (routerBlock) {
    const parsed = matter([
      '---' + routerBlock.lang,
      routerBlock.content,
      '---'
    ].join('\n'))

    extras = validateExtras(parsed.data, route.component)
    // Keep raw value to detect changes
    extras._raw = routerBlock.content
    // Wheter route need to update or not
    extras._needUpdate = !previousExtras || previousExtras._raw !== routerBlock.content
  }
  // Update cache
  parsedRoutes[route.component] = extras

  return extras
}

function pick (object, fields) {
  return fields.reduce((map, key) => {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      map[key] = object[key]
    }
    return map
  }, {})
}

function extractRouterBlockFromFile (path) {
  // Read component content
  const content = readFileSync(path, 'utf8')

  // Extract script
  const routerContentMatch = content.match(/<router(\s[^>\s]*)*>([\S\s.]*?)<\/router>/)
  if (routerContentMatch) {
    const [, attrs, content] = routerContentMatch
    const lang = extractLanguage(content, attrs)
    return {
      content,
      lang,
      attrs
    }
  }
  return null
}

function validateExtras (extras, componentPath) {
  // Validate path
  if (extras.path && typeof extras.path !== 'string') {
    extras.path = String(extras.path)
  }

  // Validate alias
  if (extras.alias && !Array.isArray(extras.alias)) {
    extras.alias = [String(extras.alias)]
  }

  // Validate named views
  if (extras.namedViews) {
    extras.namedViews = validateNamedViews(extras.namedViews, componentPath)
  }

  return pick(extras, VALID_EXTRAS)
}

function validateNamedViews (namedViews, componentPath) {
  if (typeof namedViews !== 'object') {
    throw new NamedViewsValidationError(componentPath)
  }

  const validObject = pick(namedViews, NAMED_VIEWS_VALID_KEYS)

  if (validObject.currentView && typeof validObject.currentView !== 'string') {
    throw new NamedViewsValidationError(componentPath)
  } else if (!validObject.currentView) {
    validObject.currentView = 'default'
  }

  if (validObject.views && typeof validObject.views !== 'object') {
    throw new NamedViewsValidationError(componentPath)
  }

  if (validObject.views) {
    for (const [key, value] of Object.entries(validObject.views)) {
      if (typeof key !== 'string' || typeof value !== 'string') {
        throw new NamedViewsValidationError(componentPath)
      }
    }
  }

  if (validObject.views && !validObject.chunkNames) {
    throw new NamedViewsValidationError(componentPath)
  }

  if (validObject.chunkNames) {
    const viewsKeys = Object.keys(validObject.views)

    for (const key of viewsKeys) {
      if (!Object.prototype.hasOwnProperty.call(validObject.chunkNames, key)) {
        throw new NamedViewsValidationError(componentPath)
      } else if (typeof validObject.chunkNames[key] !== 'string') {
        validObject.chunkNames[key] = String(validObject.chunkNames[key])
      }
    }
  }

  return validObject
}

function extractLanguage (content, attrs) {
  if (attrs) {
    const attributeLang = attrs.match(/\slang="(.+?)"/)
    if (attributeLang) {
      return attributeLang[1]
    }
  }
  return content.trim()[0] === '{' ? 'js' : 'yaml'
}

function findDynamicParentIndex (route, routes) {
  let index = -1
  const parts = route.path.split('/')
  while (parts.length && index < 0) {
    index = routes.findIndex(route => route.path === parts.join('/') + '/*')
    parts.pop()
  }
  return index
}

module.exports = {
  extendRoutes,
  invalidateRoute
}
