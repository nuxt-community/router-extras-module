const { setup, loadConfig, get } = require('@nuxtjs/module-test-utils')

describe('prod', () => {
  let nuxt

  beforeAll(async () => {
    ({ nuxt } = (await setup(loadConfig(__dirname, '../../example', { dev: false }))))
  }, 60000)

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

  test('render number page', async () => {
    const html = await get('/number-page')
    expect(html).toContain('number page')
  })

  describe('child routes', () => {
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

  describe('advanced aliases', () => {
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

  describe('named views', () => {
    test('render child with named component', async () => {
      const html = await get('/namedParent/namedChild')
      expect(html).toContain('Named parent')
      expect(html).toContain('Named child')
      expect(html).toContain('Side component')
      expect(html).toContain('Other side component')
    })
  })
})
