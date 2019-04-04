const path = require('path')
const { Nuxt } = require('nuxt-edge')
const request = require('request-promise-native')

const url = path => `http://localhost:3000${path}`
const get = path => request(url(path))

describe('basic', () => {
  let nuxt

  test('start', async () => {
    nuxt = new Nuxt({
      rootDir: path.resolve(__dirname, '..', 'example')
    })
    await nuxt.listen(3000)
  })

  afterAll(async () => {
    await nuxt.close()
  })

  test('render index', async () => {
    const html = await get('/')
    expect(html).toContain('manipulate Nuxt router')
  })

  test('render main (alias of index)', async () => {
    const html = await get('/doc')
    expect(html).toContain('manipulate Nuxt router')
  })

  describe('Child Routes', () => {
    test('render parent', async () => {
      const html = await get('/parent')
      expect(html).toContain('parent')
    })

    test('render child path', async () => {
      const html = await get('/child-route')
      expect(html).toContain('parent')
      expect(html).toContain('child')
    })

    test('render child alias', async () => {
      const html = await get('/child')
      expect(html).toContain('parent')
      expect(html).toContain('child')
    })
  })

  describe('Advanced Aliases', () => {
    test('render installation section', async () => {
      const html = await get('/doc/installation')
      expect(html).toContain('Router Extras Module')
      expect(html).toContain('yarn add @nuxtjs/router-extras')
    })

    test('render usage section', async () => {
      const html = await get('/doc/usage')
      expect(html).toContain('Router Extras Module')
      expect(html).not.toContain('yarn add @nuxtjs/router-extras')
    })
  })
})
