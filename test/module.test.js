const { Nuxt, Builder } = require('nuxt-edge')
const request = require('request-promise-native')

const config = require('./fixture/nuxt.config')

const url = path => `http://localhost:3000${path}`
const get = path => request(url(path))

describe('basic', () => {
  let nuxt

  beforeAll(async () => {
    nuxt = new Nuxt(config)
    await new Builder(nuxt).build()
    await nuxt.listen(3000)
  }, 60000)

  afterAll(async () => {
    await nuxt.close()
  })

  test('render index', async () => {
    let html = await get('/')
    expect(html).toContain('Works!')
  })

  test('render main (alias of index)', async () => {
    let html = await get('/main')
    expect(html).toContain('Works!')
  })

  test('render sample-path (overritten path)', async () => {
    let html = await get('/sample-path')
    expect(html).toContain('Sample Path')
  })

  test('test unexisted url', async () => {
    try {
      await get('/sample')
    } catch (error) {
      expect(error.statusCode).toEqual(404)
    }
  })
})
