const { Nuxt } = require('nuxt-edge')
const request = require('request-promise-native')

const config = require('./fixture/nuxt.config')

const url = path => `http://localhost:3000${path}`
const get = path => request(url(path))

describe('basic', () => {
  let nuxt

  beforeAll(async () => {
    nuxt = new Nuxt(config)
    await nuxt.listen(3000)
  }, 60000)

  afterAll(async () => {
    await nuxt.close()
  })

  test('render index', async () => {
    const html = await get('/')
    expect(html).toContain('Works!')
  })

  test('render main (alias of index)', async () => {
    const html = await get('/main')
    expect(html).toContain('Works!')
  })

  test('render sample-path (overritten path)', async () => {
    const html = await get('/sample-path')
    expect(html).toContain('Sample Path')
  })

  test('test unexisted url', async () => {
    try {
      await get('/sample')
    } catch (error) {
      expect(error.statusCode).toEqual(404)
    }
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
    test('test object alias', async () => {
      const html = await get('/advanced-main')
      expect(html).toContain('Works!')
    })

    test('test object alias props', async () => {
      const html = await get('/advanced-main')
      expect(html).toContain('Advanced Alias Props')
    })
  })
})
