const { join } = require('path')
const chokidar = require('chokidar')

const { extendRoutes, invalidateRoute } = require('./extras')

module.exports = function (moduleOptions) {
  const options = {
    routerNativeAlias: true,
    ...moduleOptions,
    ...this.options.routerExtras,
    ...this.options['router-extras']
  }

  let filesWatcher

  const srcDir = this.nuxt.options.srcDir
  const rootDir = this.nuxt.options.rootDir

  this.extendBuild((config) => {
    config.module.rules.push({
      resourceQuery: /blockType=router/,
      loader: require.resolve('./loader')
    })
  })

  this.nuxt.hook('build:extendRoutes', (routes, resolve) =>
    extendRoutes(routes, options, resolve, { srcDir, rootDir })
  )

  this.nuxt.hook('build:done', (builder) => {
    if (this.options.dev) {
      const path = join(this.options.srcDir, this.options.dir.pages)
      filesWatcher = chokidar.watch(path, {
        ignoreInitial: true
      })

      filesWatcher.on('change', (file) => {
        if (invalidateRoute(file)) {
          builder.generateRoutesAndFiles()
        }
      })
    }
  })

  this.nuxt.hook('close', () => {
    if (filesWatcher) {
      filesWatcher.close()
      filesWatcher = null
    }
  })
}

module.exports.meta = require('../package.json')
