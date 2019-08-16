# Router Extras Module
Extra add-ons for Nuxt router

**Demo**: https://codesandbox.io/s/github/nuxt-community/router-extras-module

[📖 **Release Notes**](./CHANGELOG.md)

## Features

- Define custom paths for a page
- Define multiple aliases for a single page
- Define multiple params regardless of pages directory structure

## Installation

```bash
yarn add @nuxtjs/router-extras
# or
npm i @nuxtjs/router-extras
```

## Usage

Add `@nuxtjs/router-extras` to modules section of `nuxt.config.js`:

```js
{
  modules: [
    '@nuxtjs/router-extras'
  ]
}
```
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

## Options

Module default options:
```js
{
  routerNativeAlias: true
}
```

You can update them with the `routerExtras` option in `nuxt.config.js`:

```js
export default {
  modules: ['@nuxtjs/router-extras'],
  routerExtras: {
    routerNativeAlias: false
  }
}
```

## Valid Extras
|     Extras       |  Support  | Description |
|     -----        |  -------  | ----------- |
| `path`           | JS & YAML | Change page URL |
| `alias`          | JS & YAML | Add single or multiple aliases to page, Module supports two types of aliases <br> - **Simple Alias**: These aliases are defined as simple strings. If `routerNativeAlias` is true, simple aliases will be added as router alias, see vue-router [docs](https://router.vuejs.org/guide/essentials/redirect-and-alias.html#alias) <br/> - **Clone Alias**: These aliases are in form of object and they can have their own extras. These aliases will be added as an individual route. They can have their own props and they can have different number of url params |
| `meta`           | JS & YAML | Add Meta information to the page, meta can be used by middlewares |
| `name`           | JS & YAML | Define custom name for route |
| `props`          | JS & YAML | Pass predefined props to page |
| `beforeEnter`    | JS & YAML | Define `beforeEnter` guard for this route, see: [Global Before Guards](https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards) |
| `caseSensitive`  |   JS      | Use case sensitive route match (default: false) |
| `redirect`       | JS & YAML | Redirect current page to new location|
    
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

## Development

- Clone this repository
- Install dependencies using `yarn install` or `npm install`
- Start development server using `npm run dev`

## License

[MIT License](./LICENSE)
Copyright (c) Nuxt Community
