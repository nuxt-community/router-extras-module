const acorn = require('acorn')
const fs = require('fs-extra')

const parsedRoutes = {}

const extractAnnotationValueFromComment = (comment) => {
  const pathAnnotationRegex = /@path ([^\s]+)/g
  let match 

  let paths = []

  while(match = pathAnnotationRegex.exec(comment)) {
    paths.push(('/' + match[1]).replace(/\/\/+/g, '/'))
  }

  return paths
}

async function extractCustomPathFromRouteComponent (route, useCache = true) {
    if (parsedRoutes[route.component] && useCache) {
      return parsedRoutes[route.component]
    }    

    // Read component content      
    const content = await fs.readFile(route.component, 'utf8')

    // Extract script
    const script = content.match(/<script>([\S\s.]*?)<\/script>/)[1]

    // Parse script & export @path
    let paths = []
  
    acorn.parse(script, {
      sourceType: 'module',
      onComment: (block, text, start, end) => {
        paths = paths.concat(
          extractAnnotationValueFromComment(
            text
          )
        )
      },
    })

    parsedRoutes[route.component] = paths

    return paths
}

module.exports = async function module (moduleOptions) {

  let localRouetes = [];

  this.nuxt.hook('build:done', builder => {
    const filesWatcher = builder.watchers.files
    if (filesWatcher) {
      filesWatcher.on('change', async (...files) => {
        let changed = false

        for(let file of files) {          
          if (file.includes(builder.options.dir.pages)) {
            let routes = localRouetes.filter(route => route.component == file);
            if (routes.length) {
              const paths = await extractCustomPathFromRouteComponent(routes[0], false);
              
              const hasUnhandledPath = paths.find(path => {
                return !Boolean(routes.find(route => route.path == path))
              })

              if (hasUnhandledPath) {
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
    localRouetes = routes;
    
    const additionalRoutes = []

    for (let route of routes) {
      const paths = await extractCustomPathFromRouteComponent(route)
      
      if (!paths.length) {
        continue
      }

      if (paths.length) {
        route.path = paths[0]
        
        for (let i = 1; i < paths.length; i += 1) {
          additionalRoutes.push(Object.assign({}, route, {
            path: paths[i],
            name: `${route.name}-p${i}`
          }))
        }

      }
    }
    additionalRoutes.forEach(route => routes.push(route))    

  })
}

module.exports.meta = require('../package.json')
