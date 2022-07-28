<template>
  <div id="app">
    <router-view />
  </div>
</template>


<script>
// import ROUTE_REQUESTED from '@/graphql/app/routeRequested.gql'
export default {
  apollo: {
    // $subscribe: {
    //   routeRequested: {
    //     query: ROUTE_REQUESTED,
    //     result({ data }) {
    //       console.log('result=>', data)
    //     }
    //   }
    // }
  }
}
</script>



<style lang="scss">
</style>
