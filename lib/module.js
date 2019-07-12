import path from 'path'
import chokidar from 'chokidar'

import { extendRoutes, invalidateRoute } from './extras'
import { DEFAULT_OPTIONS } from './constants'

export default async function module (moduleOptions) {
  const options = { ...DEFAULT_OPTIONS, ...moduleOptions, ...this.options.routerExtras }

  await init.call(this, options)

  await setupHooks.call(this, options)
}

function watchFiles (options, builder) {
  const filesWatcher = options._filesWatcher = chokidar.watch(options.input, {
    ignoreInitial: true
  })

  if (filesWatcher) {
    filesWatcher.on('change', async (file) => {
      const isInvalid = await invalidateRoute(file)
      if (isInvalid) {
        builder.generateRoutesAndFiles()
      }
    })
  }
}

function init (options) {
  options.input = path.join(this.nuxt.options.srcDir, 'pages')

  this.nuxt.hook('build:extendRoutes', routes => extendRoutes(routes, options))
}

function setupHooks (options) {
  this.nuxt.hook('build:done', (builder) => {
    if (this.nuxt.options.dev) {
      watchFiles.call(this, options, builder)
    }
  })

  this.nuxt.hook('close', () => {
    if (options._filesWatcher) {
      options._filesWatcher.close()
      delete options._filesWatcher
    }
  })
}
