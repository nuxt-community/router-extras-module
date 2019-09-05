const { readFileSync } = require('fs')
const matter = require('gray-matter')

const VALID_EXTRAS = [
  'path',
  'alias',
  'meta',
  'props',
  'name',
  'redirect',
  'beforeEnter',
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

/**
 * cache extracted extras
 */
const parsedRoutes = {}

let localRoutes = []

function extendRoutes (routes, options) {
  localRoutes = localRoutes.concat(routes)

  let additionalRoutes = []

  for (const route of routes) {
    const extras = extractExtrasFromRoute(route)

    Object.assign(route, pick(extras, NUXT_VALID_EXTRAS))

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
      extendRoutes(route.children, options)
    }
  }

  additionalRoutes.forEach(route => routes.push(route))
}

function mapSimpleAliases (route, aliases) {
  return aliases.map(alias => Object.assign({}, route, {
    path: alias,
    name: `${route.name}${alias}`
  }))
}

function mapObjectAliases (route, aliases) {
  return aliases.map(alias => Object.assign({}, route, {
    ...pick(alias, NUXT_VALID_EXTRAS),
    path: alias.path,
    name: `${route.name}${alias.path}`
  }))
}

function invalidateRoute (file) {
  const routes = localRoutes.filter(route => route.component === file)

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

    extras = validateExtras(parsed.data)
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
    if (object.hasOwnProperty(key)) {
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

function validateExtras (extras) {
  // Validate path
  if (extras.path && typeof extras.path !== 'string') {
    extras.path = String(extras.path)
  }

  // Validate alias
  if (extras.alias && !Array.isArray(extras.alias)) {
    extras.alias = [String(extras.alias)]
  }

  return pick(extras, VALID_EXTRAS)
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

module.exports = {
  extendRoutes,
  invalidateRoute
}
