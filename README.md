# nuxt-router-extras
[![npm (scoped with tag)](https://img.shields.io/npm/v/nuxt-router-extras/latest.svg?style=flat-square)](https://npmjs.com/package/nuxt-router-extras)
[![npm](https://img.shields.io/npm/dt/nuxt-router-extras.svg?style=flat-square)](https://npmjs.com/package/nuxt-router-extras)
[![CircleCI](https://img.shields.io/circleci/project/github/.svg?style=flat-square)](https://circleci.com/gh/)
[![Codecov](https://img.shields.io/codecov/c/github/.svg?style=flat-square)](https://codecov.io/gh/)
[![Dependencies](https://david-dm.org//status.svg?style=flat-square)](https://david-dm.org/)
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

    Simply add an annotation to page component (It doesn't matter which type of comment you use `/* */` or `//`)
    ```
    <script>
    /**
    *  @path /posts
    **/
    export default { }
    </script>
    ```
- specify multiple paths to single page

    Add multiple annotations
    ```
    <script>
    // @path /
    // @path /index
    // @path /main
    export default { }
    </script>
    ```
- define multiple params regardless of pages directory structure

    ```
    <script>
    // @path /post/:id/:title?
    export default { }
    </script>
    ```

## Development

- Clone this repository
- Install dependencies using `yarn install` or `npm install`
- Start development server using `npm run dev`

## License

[MIT License](./LICENSE)

Copyright (c) 
