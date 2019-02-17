import { pick, extractRouterBlockFromFile, parseYAML, validateExtras, NUXT_VALID_EXTRAS } from './utils'

const DEFAULTS = {
  routerNativeAlias: false
}

const parsedRoutes = {}

async function extractExtrasFromRoute (route, useCache = true) {
  const previousExtras = parsedRoutes[route.component]
  if (previousExtras && useCache) {
    return previousExtras
  }

  let extras = {
    _raw: '',
    _needUpdate: false
  }
  const routerBlock = await extractRouterBlockFromFile(route.component)

  if (routerBlock) {
    const parsedData = parseYAML(routerBlock.content)
    extras = validateExtras(parsedData)
    // Keep raw value to detect changes
    extras._raw = routerBlock.content
    // Wheter route need to update or not
    extras._needUpdate = !previousExtras || previousExtras._raw !== routerBlock.content
  }
  // Update cache
  parsedRoutes[route.component] = extras

  return extras
}

module.exports = async function module (moduleOptions) {
  const options = Object.assign({}, DEFAULTS, moduleOptions, this.options.routerExtras)
  let localRouetes = []

  this.nuxt.hook('build:done', builder => {
    const filesWatcher = builder.watchers.files
    if (filesWatcher) {
      filesWatcher.on('change', async (file) => {
        let changed = false

        if (file.includes(builder.options.dir.pages)) {
          let routes = localRouetes.filter(route => route.component === file)
          if (routes.length) {
            const extras = await extractExtrasFromRoute(routes[0], false)

            if (extras._needUpdate) {
              changed = true
            }
          }
        }

        if (changed) {
          builder.generateRoutesAndFiles()
        }
      })
    }
  })

  this.nuxt.hook('build:extendRoutes', async (routes) => {
    localRouetes = routes

    const additionalRoutes = []

    for (let route of routes) {
      const extras = await extractExtrasFromRoute(route)

      Object.assign(route, pick(extras, NUXT_VALID_EXTRAS))

      if (options.routerNativeAlias) {
        Object.assign(route, pick(extras, ['alias']))
      } else if (extras.alias) {
        for (let index in extras.alias) {
          const alias = extras.alias[index]
          additionalRoutes.push(Object.assign({}, route, {
            path: alias,
            name: `${route.name}-p${index}`
          }))
        }
      }
    }
    additionalRoutes.forEach(route => routes.push(route))
  })
}

module.exports.meta = require('../package.json')
