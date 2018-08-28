# nuxt-router-extras
[![npm (scoped with tag)](https://img.shields.io/npm/v/nuxt-router-extras/latest.svg?style=flat-square)](https://npmjs.com/package/nuxt-router-extras)
[![npm](https://img.shields.io/npm/dt/nuxt-router-extras.svg?style=flat-square)](https://npmjs.com/package/nuxt-router-extras)
[![CircleCI](https://img.shields.io/circleci/project/github/alibaba-aero/nuxt-router-extras.svg?style=flat-square)](https://circleci.com/gh/)
[![Codecov](https://img.shields.io/codecov/c/github/alibaba-aero/nuxt-router-extras.svg?style=flat-square)](https://codecov.io/gh/)
[![Dependencies](https://david-dm.org/nuxt-router-extras/status.svg?style=flat-square)](https://david-dm.org/)
[![js-standard-style](https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com)

> 

[📖 **Release Notes**](./CHANGELOG.md)

## Features

`nuxt-router-extras` can: 
- define custom paths for page
- specify multiple paths to single page
- define multiple params regardless of pages directory structure

## Setup
- Add `nuxt-router-extras` dependency using yarn or npm to your project
- Add `nuxt-router-extras` to `modules` section of `nuxt.config.js`

```js
{
  modules: [
    // Simple usage
    'nuxt-router-extras',

    // With options
    ['nuxt-router-extras', { /* module options */ }],
 ]
}
```

## Usage

- define custom paths for page

    Simply add a block inside vue file and define path in yaml
    ```
    <router>
        path: /posts
    </router>
    ```
- specify multiple paths to single page

    If you want more paths for a single page, define them with aliases
    ```
    <router>
        path: /posts
        alias:
          - /articles
          - /blog
    </router>
    ```
- define multiple params regardless of pages directory structure

    ```
    <router>
        path: /post/:id/:title?
    </router>
    ```

## Development

- Clone this repository
- Install dependencies using `yarn install` or `npm install`
- Start development server using `npm run dev`

## License

[MIT License](./LICENSE)

Copyright (c) 
