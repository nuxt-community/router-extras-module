const yaml = require('js-yaml')
const fs = require('fs-extra')

const parsedRoutes = {}

async function extractExtrasFromRoute (route, useCache = true) {
  const previousExtras = parsedRoutes[route.component]
  if (previousExtras && useCache) {
    return previousExtras
  }

  // Read component content
  const content = await fs.readFile(route.component, 'utf8')

  // Extract script
  const routerContentMatch = content.match(/<router([^>]*)>([\S\s.]*?)<\/router>/)

  let extras = {}
  let routerContent

  if (routerContentMatch) {
    routerContent = routerContentMatch[2]
    extras = yaml.load(routerContent) || {}

    // Validate path
    if (extras.path && typeof extras.path !== 'string') {
      extras.path = String(extras.path)
    }

    // Validate alias
    if (extras.alias && !Array.isArray(extras.alias)) {
      extras.alias = [String(extras.alias)]
    }
  }

  // Keep raw value to detect changes
  extras._raw = routerContent

  // Wheter route need to update or not
  extras._needUpdate = !previousExtras || previousExtras._raw !== routerContent

  // Update cache
  parsedRoutes[route.component] = extras

  return extras
}

module.exports = async function module (moduleOptions) {
  let localRouetes = []

  this.nuxt.hook('build:done', builder => {
    const filesWatcher = builder.watchers.files
    if (filesWatcher) {
      filesWatcher.on('change', async (...files) => {
        let changed = false

        for (let file of files) {
          if (file.includes(builder.options.dir.pages)) {
            let routes = localRouetes.filter(route => route.component === file)
            if (routes.length) {
              const extras = await extractExtrasFromRoute(routes[0], false)

              if (extras._needUpdate) {
                changed = true
              }
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

      if (extras.path) {
        route.path = extras.path
      }
      if (extras.alias) {
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
