# @nuxtjs/router-extras

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Circle CI][circle-ci-src]][circle-ci-href]
[![Codecov][codecov-src]][codecov-href]
[![License][license-src]][license-href]

> Extra add-ons for Nuxt router

**Demo**: <https://codesandbox.io/s/github/nuxt-community/router-extras-module>

[📖 **Release Notes**](./CHANGELOG.md)

## Features

- Define custom paths for a page
- Define multiple aliases for a single page
- Define multiple params regardless of pages directory structure

## Setup

1. Add `@nuxtjs/router-extras` dependency to your project

```bash
yarn add --dev @nuxtjs/router-extras # or npm install --save-dev @nuxtjs/router-extras
```

2. Add `@nuxtjs/router-extras` to the `buildModules` section of `nuxt.config.js`

:warning: If you are using Nuxt `< 2.9.0`, use `modules` instead.

```js
{
  buildModules: [
    // Simple usage
    '@nuxtjs/router-extras',

    // With options
    ['@nuxtjs/router-extras', { /* module options */ }]
  ]
}
```

### Using top level options

```js
{
  buildModules: [
    '@nuxtjs/router-extras'
  ],
  routerExtras: {
    /* module options */
  }
}
```

## Options

### `routerNativeAlias`

- Default: `true`

Simple aliases will be added as router alias, see [vue-router](https://router.vuejs.org/guide/essentials/redirect-and-alias.html#alias)

## Usage

### Define custom paths for a page

Simply add a block inside Vue file and define a path in JavaScript or [Yaml](https://en.wikipedia.org/wiki/YAML)

<details open>
  <summary>JavaScript</summary>

```xml
<router>
  {
    path: '/posts'
  }
</router>
```

</details>

<details>
  <summary>Yaml</summary>

```xml
<router>
  path: /posts
</router>
```

</details>

### Define multiple aliases for single page

If you want more paths for a single page, define them with aliases

<details open>
  <summary>JavaScript</summary>

```xml
<router>
 {
    path: '/posts',
    alias: [
      '/articles',
      '/blog'
    ]
 }
</router>
```

</details>

<details>
  <summary>Yaml</summary>

```xml
<router>
    path: /posts
    alias:
        - /articles
        - /blog
</router>
```

</details>

Aliases can have their own props

<details open>
  <summary>JavaScript</summary>

```xml
<router>
  {
    path: '/posts',
    alias: [
      '/articles',
      {
        path: '/blog',
        props: {
          section: 'top-posts'
        }
      }
    ]
  }
</router>
```

</details>

<details>
  <summary>Yaml</summary>

```xml
<router>
  path: /posts
  alias:
      - /articles
      - 
        path: /blog
        props:
          section: top-posts
</router>
```

</details>

### Define multiple params regardless of pages directory structure

<details open>
  <summary>JavaScript</summary>

```xml
<router>
  {
    path: '/post/:id/:title?'
  }
</router>
```

</details>

<details>
  <summary>Yaml</summary>

```xml
<router>
  path: /post/:id/:title?
</router>
```

</details>


### Define named views for the page

<details open>
  <summary>JavaScript</summary>

```xml
<router>
{
  namedViews: {
    currentView: 'main',
    views: {
      side: '~/components/side.vue'
    },
    chunkNames: {
      side: 'components/side'
    }
  }
}
</router>
```

</details>

<details>
  <summary>Yaml</summary>

```xml
<router>
  namedViews:
    currentView: "main"
    views:
      side: "~/components/side.vue"
    chunkNames:
      side: "~/components/side.vue"
</router>
```

</details>

## Valid Extras
|     Extras       |  Support  | Description |
|     -----        |  -------  | ----------- |
| `path`           | JS & YAML | Change page URL |
| `alias`          | JS & YAML | Add single or multiple aliases to page, Module supports two types of aliases <br> - **Simple Alias**: These aliases are defined as simple strings. If `routerNativeAlias` is true, simple aliases will be added as router alias, see vue-router [docs](https://router.vuejs.org/guide/essentials/redirect-and-alias.html#alias) <br/> - **Clone Alias**: These aliases are in form of object and they can have their own extras. These aliases will be added as an individual route. They can have their own props and they can have different number of url params |
| `meta`           | JS & YAML | Add Meta information to the page, meta can be used by middlewares |
| `name`           | JS & YAML | Define custom name for route |
| `props`          | JS & YAML | Pass predefined props to page |
| `beforeEnter`    |    JS     | Define `beforeEnter` guard for this route, see: [Global Before Guards](https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards) |
| `caseSensitive`  | JS & YAML | Use case sensitive route match (default: false) |
| `redirect`       | JS & YAML | Redirect current page to new location|
| `namedViews`     | JS & YAML | Add named view to the path, see [Named Views Support](#named-views-support) |

## Named views support

There is support for [named views in nuxt](https://nuxtjs.org/guide/routing#named-views), but it requires the user to write a lot of boilerplate code in the config. The `namedViews` property in the `<router>` block allows for a more streamlined configuration 

Named views key is a bit different from all other settings. It expects an object with following properties:
- `currentView`: actual view name for the current component. Defaults to `"default"`, to be rendered in plain `<nuxt-child />`
- `views`: object, where keys are view names and values are component paths. It supports all expected path resolution (`~/` and others)
- `chunkNames`: object, where keys are view names and values are webpack chunks for them. Object structure is expected to be equal to `views` - all the same keys must be present.

For usage example see `example/pages/namedParent.vue` and `example/pages/namedParent/namedChild.vue`. 

## Syntax Highlighting

### Visual Studio Code

Install [Vetur](https://vuejs.github.io/vetur/) extension and define [custom block](https://vuejs.github.io/vetur/highlighting.html#custom-block)

- Add `<router>` to `vetur.grammar.customBlocks` in VSCode settings

```json
"vetur.grammar.customBlocks": {
    "docs": "md",
    "i18n": "json",
    "router": "js"
}
```

- Execute command `> Vetur: Generate grammar from vetur.grammar.customBlocks` in VSCode
- Restart VSCode and enjoy awesome

### PhpStorm/WebStorm
- Use Yaml syntax
- Place cursor right after <router> tag
- Right click on cursor and choose "Show context actions"
- Select Inject language or reference
- Select Yaml

## Development

- Clone this repository
- Install dependencies using `yarn install` or `npm install`
- Start development server using `npm run dev`

## License

[MIT License](./LICENSE)

Copyright (c) Nuxt Community

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@nuxtjs/router-extras/latest.svg?style=flat-square
[npm-version-href]: https://npmjs.com/package/@nuxtjs/router-extras

[npm-downloads-src]: https://img.shields.io/npm/dt/@nuxtjs/router-extras.svg?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/@nuxtjs/router-extras

[circle-ci-src]: https://img.shields.io/circleci/project/github/nuxt-community/router-extras-module.svg?style=flat-square
[circle-ci-href]: https://circleci.com/gh/nuxt-community/router-extras-module

[codecov-src]: https://img.shields.io/codecov/c/github/nuxt-community/router-extras-module.svg?style=flat-square
[codecov-href]: https://codecov.io/gh/nuxt-community/router-extras-module

[license-src]: https://img.shields.io/npm/l/@nuxtjs/router-extras.svg?style=flat-square
[license-href]: https://npmjs.com/package/@nuxtjs/router-extras
