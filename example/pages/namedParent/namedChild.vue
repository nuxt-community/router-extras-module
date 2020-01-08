<template>
  <div>Named child</div>
</template>

<script>
export default {

}
</script>
<router lang="js">
{
  namedViews: {
    currentView: 'main',
    views: {
      side: '~/components/side.vue',
      otherside: '../../components/otherside.vue'
    },
    chunkNames: {
      side: 'components/side',
      otherside: 'components/otherside'
    }
  }
}
</router>
