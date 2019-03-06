<template>
  <div>
    Works!
    <router-link to="/">
      some-path-name
    </router-link>
  </div>
</template>

<router lang="yaml">
    path: /
    alias:
        - /main
        - /index
</router>

<script>
export default {

}
</script>
