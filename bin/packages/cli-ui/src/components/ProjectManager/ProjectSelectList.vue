<template>
  <div class="project-select-list">
    <ApolloQuery :query="require('@/graphql/project/projects.gql')">
      <template slot-scope="{result: {data,loading}}">
        <template v-if="data">
          <div v-if="data.projects.length">
            todo - gogo
          </div>
          <div v-else
               class="vue-ui-empty">
            <VueIcon icon="attach_file"
                     class="empty-icon" />
            <div class="">没有项目</div>
          </div>
        </template>
        <VueLoadingIndicator v-else-if="loading"
                             class="overlay" />
      </template>
    </ApolloQuery>
  </div>
</template>

<script>
import { generateSearchRegex } from '@/utils/search'
export default {
  data() {
    return {
      search: ''
    }
  },
  apollo: {
    // projectCurrent: 
  },
  created() {
    generateSearchRegex()
  },
  methods: {
  },

}
</script>

<style lang="scss" scoped>
@import "@/style/mixins.scss";
@import "@/style/vars.scss";

.project-select-list {
  height: 100%;
  overflow-y: auto;
  position: relative;
  min-height: 400px;
}

.toolbar {
  @include h-box();
  @include box-center();
  margin-bottom: $padding-item;
}
</style>