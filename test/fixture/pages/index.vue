<template>
  <div>
    Works! {{ customProps }}
    <br>
    <router-link to="/sample-path">
      Go to sample path
    </router-link>
  </div>
</template>

<router lang="yaml">
    path: /
    alias:
        -
          path: /advanced-main
          props:
            customProps: Advanced Alias Props
        - /main
    props:
      customProps: Like a charm
</router>

<script>
export default {
  props: {
    customProps: {
      type: String,
      default: ''
    }
  }
}
</script>
