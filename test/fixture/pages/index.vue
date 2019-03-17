<template>
  <div>
    <div class="logo text-center">
      <img src="~/assets/nuxtjs.svg">
      <div>Nuxtjs</div>
    </div>
    <b-container>
      <b-row>
        <b-col md="4">
          <b-nav vertical>
            <b-nav-item to="/" :active="!section">
              0. Hi
            </b-nav-item>
            <b-nav-item to="/doc/installation" :active="section === 'installation'">
              1. Installation
            </b-nav-item>
            <b-nav-item to="/doc/usage" :active="section === 'usage'">
              2. Usage
            </b-nav-item>
            <b-nav-item to="/doc/path" :active="section === 'path'">
              3. Change Path
            </b-nav-item>
            <b-nav-item to="/doc/props" :active="section === 'props'">
              4.Pass props to page
            </b-nav-item>
            <b-nav-item to="/doc/meta" :active="section === 'meta'">
              5. Add meta to route
            </b-nav-item>
            <b-nav-item to="/doc/alias" :active="section === 'alias'">
              6. Create Multiple Aliases
            </b-nav-item>
          </b-nav>
        </b-col>
        <b-col md="8">
          <div class="docs">
            <div v-if="!section">
              <h3>
                Router Extras Module
              </h3>
              <div>
                Nuxtjs is great framework to create universal apps, It has powerful and easy to use structure to define
                and handle routes.
                <br>
                But sometimes we want more.
                <br>
                Router Extras Module help you to manipulate Nuxt router, you can:
                <ul>
                  <li>Manipulate pages path</li>
                  <li>Add multiple alises for single page</li>
                  <li>Pass props to page</li>
                  <li>Add meta fields for route</li>
                </ul>
                With these simple abilities you can create
                <strong>
                  <nuxt-link to="/modal" class="active">
                    MORE
                  </nuxt-link>
                </strong>
              </div>
            </div>
      <div v-if="section === 'installation'" class="installation">
        <pre>
yarn add @nuxtjs/router-extras

# or via npm

npm i @nuxtjs/router-extras
        </pre>
      </div>
      <div v-if="section === 'usage'" class="usage">
        Add <code>@nuxtjs/router-extras</code> to modules section of nuxt.config.js:
        <pre>
{
  modules: [
    '@nuxtjs/router-extras'
  ]
}
        </pre>
        Add <code>router</code> block inside Vue file and define extras in YAML
        <pre>
&lt;router>
  path: /posts
&lt;/router>
        </pre>
      </div>
      <div v-if="section === 'path'" class="path">
        Change page default path
        <pre>
&lt;router>
  path: /new-path
&lt;/router>
        </pre>
      </div>
      <div v-if="section === 'props'" class="props">
        Pass custom props to page component
        <pre>
&lt;router>
  props:
    pageTitle: Nuxtjs Router Extras
&lt;/router>

&lt;script>
export default {
  props: {
    pageTitle: {
      type: String,
      default: ''
    }
  }
}
&lt;/script>
        </pre>
      </div>
      <div v-if="section === 'meta'" class="meta">
        Add meta field to route
        <pre>
&lt;router>
  meta:
    requiresAuth: true
&lt;/router>
        </pre>
      </div>
      <div v-if="section === 'alias'" class="alias">
        Define Aliases for a page and assign custom extras per alias
        <br>
        This is aliases of current page
        <pre>
&lt;router>
  alias:
    -
      path: /doc/installation
      props:
        section: installation
    -
      path: /doc/usage
      props:
        section: usage
    -
      path: /doc/path
      props:
        section: path
    -
      path: /doc/props
      props:
        section: props
        pageTitle: Eyval!!!
    -
      path: /doc/meta
      props:
        section: meta
    -
      path: /doc/alias
      props:
        section: alias
    -
      path: /modal
      props:
        showModal: true
&lt;/router>
        </pre>
      </div>
    </div>
        </b-col>
      </b-row>
    </b-container>

    <div v-if="showModal" class="my-modal">
      <div class="content">
        <div>
          This modal is visible because you are visiting page <code>/modal</code>
        </div>
        <br>
        <nuxt-link to="/">
          HIDE
        </nuxt-link>
      </div>
      <div class="overlay" />
    </div>
  </div>
</template>

<router lang="yaml">
  path: /
  alias:
    - /doc
    -
      path: /doc/installation
      props:
        section: installation
    -
      path: /doc/usage
      props:
        section: usage
    -
      path: /doc/path
      props:
        section: path
    -
      path: /doc/props
      props:
        section: props
        pageTitle: Eyval!!!
    -
      path: /doc/meta
      props:
        section: meta
    -
      path: /doc/alias
      props:
        section: alias
    -
      path: /modal
      props:
        showModal: true
</router>

<script>
export default {
  props: {
    section: {
      type: String,
      default: ''
    },
    showModal: {
      type: Boolean,
      default: false
    },
    pageTitle: {
      type: String,
      default: 'Router Extras Module for Nuxtjs'
    }
  },
  head() {
    return {
      title: this.pageTitle
    }
  }
}
</script>

<style>
a {
  color: #333;
  text-decoration: none;
}
a.active {
  border-bottom: 1px solid;
}
.logo {
  margin-bottom: 30px;
}
.my-modal .overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.2)
}
.my-modal .content {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 300px;
  height: 150px;
  border-radius: 5px;
  padding: 15px;
  transform: translate(-50%, -50%);
  background: white;
  z-index: 1;
}
</style>
