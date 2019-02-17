# Router Extras Module
Extra add-ons for Nuxt router

[📖 **Release Notes**](./CHANGELOG.md)

## Features

- Define custom paths for a page
- Define multiple alias for single page
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

Simply add a block inside vue file and define path in [Yaml](https://en.wikipedia.org/wiki/YAML)
```xml
<router>
    path: /posts
</router>
```
### Define multiple alias for single page

If you want more paths for a single page, define them with aliases
```xml
<router>
    path: /posts
    alias:
        - /articles
        - /blog
</router>
```
### Define multiple params regardless of pages directory structure

```xml
<router>
    path: /post/:id/:title?
</router>
```

## Options

Module default options:
```js
{
  routerNativeAlias: false
}
```

You can update them with the `routerExtras` option in `nuxt.config.js`:

```js
export default {
  modules: ['@nuxtjs/router-extras'],
  routerExtras: {
    routerNativeAlias: true
  }
}
```

## Valid extras
- `path`: Change page url
- `alias`: Add single or multiple aliases to page
- `meta`: Add Meta information to page, metas can be used by middlewares
- `props`: Pass predefined props to page
    
## Syntax Highlighting
### Visual Studio Code
Install [Vetur](https://vuejs.github.io/vetur/) extension and define [custom block](https://vuejs.github.io/vetur/highlighting.html#custom-block)
- Add `<router>` to `vetur.grammar.customBlocks` in VSCode settings
    ```json
    "vetur.grammar.customBlocks": {
        "docs": "md",
        "i18n": "json",
        "router": "yaml"
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