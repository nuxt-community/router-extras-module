import fs from 'fs-extra'
import Yaml from 'js-yaml'

const VALID_EXTRAS = [
  'path',
  'alias',
  'meta',
  'props'
]

export const NUXT_VALID_EXTRAS = [
  'path',
  'meta',
  'props'
]

export function pick(object, fields) {
  return fields.reduce((map, key) => {
    if (object.hasOwnProperty(key)) {
      map[key] = object[key]
    }
    return map
  }, {})
}

export async function extractRouterBlockFromFile(path) {
  // Read component content
  const content = await fs.readFile(path, 'utf8')

  // Extract script
  const routerContentMatch = content.match(/<router([^>]*)>([\S\s.]*?)<\/router>/)
  if (routerContentMatch) {
    const [, attrs, content] = routerContentMatch
    return {
      content,
      attrs
    }
  }
  return null
}

export function parseYAML(content) {
  try {
    return Yaml.load(content) || {}
  } catch (e) {
    return {}
  }
}

export function validateExtras(extras) {
  // Validate path
  if (extras.path && typeof extras.path !== 'string') {
    extras.path = String(extras.path)
  }

  // Validate alias
  if (extras.alias && !Array.isArray(extras.alias)) {
    extras.alias = [String(extras.alias)]
  }

  return pick(extras, VALID_EXTRAS)
}
