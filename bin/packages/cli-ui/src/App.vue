<template>
  <div id="app"
       class="app">
    <router-view />
    <LocalLoader />
  </div>
</template>


<script>
import ROUTE_REQUESTED from '@/graphql/app/routeRequested.gql'
export default {
  apollo: {
    $subscribe: {
      routeRequested: {
        query: ROUTE_REQUESTED,
        result({ data }) {
          console.log('result=>', data)
        }
      }
    }
  }
}
</script>



<style lang="scss" scoped>

.app {
  display: flex;
  flex-direction: column;
}
.content {
  flex: auto 1 1;
  height: 100%;
  overflow: hidden;
}
</style>
