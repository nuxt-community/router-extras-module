<template>
  <div>
    JavaScript Router Block {{ routerProp }}
  </div>
</template>

<router lang="js">
{
  name: 'js-example',
  path: '/lang/js',
  caseSensitive: true,
  alias: [
    {
      path: '/lang/javascript',
      redirect: '/lang/js',
    }
  ],
  props: function(route) {
    return {
      routerProp: 9
    }
  },
  beforeEnter: function(to, from, next) {
    console.log(`from: ${from.path} -> to: ${to.path}`)
    next();
  }
}
</router>

<script>
export default {
  props: {
    routerProp: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style>

</style>
