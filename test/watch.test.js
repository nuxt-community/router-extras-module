const { join } = require('path')
const { readFileSync, writeFileSync } = require('fs')
const { setup, loadConfig } = require('@nuxtjs/module-test-utils')
const { waitFor } = require('@nuxt/utils-edge')

describe('watch', () => {
  let nuxt, builder, spyBuilder, filePath, fileContent

  beforeAll(async () => {
    ({ nuxt, builder } = (await setup(loadConfig(__dirname, 'watch', { dev: true }), { waitFor: 2000 })))

    filePath = join(nuxt.options.srcDir, nuxt.options.dir.pages, 'index.vue')
    fileContent = readFileSync(filePath, 'utf8')
  }, 60000)

  beforeEach(() => {
    spyBuilder = jest.spyOn(builder, 'generateRoutesAndFiles')
  })

  afterEach(() => {
    writeFileSync(filePath, fileContent, 'utf8')
    spyBuilder.mockRestore()
  })

  afterAll(async () => {
    await nuxt.close()
  })

  test('change file without generate routes and files', async () => {
    writeFileSync(filePath, '<template><div>change file without generate</div></template>', 'utf8')

    await waitFor(2000)

    expect(spyBuilder).not.toHaveBeenCalled()
  })

  test('change file and generate routes and files', async () => {
    writeFileSync(filePath, "<template><div>changed</div></template><router>{path: 'changed'}</router>", 'utf8')

    await waitFor(2000)

    expect(spyBuilder).toHaveBeenCalled()
  })
})
