<template>
  <div class="project-feature-item list-item"
       :class="{
         selected: feature.enabled
         }"
       :data-testid="feature.id">
    <VueSwitch :value="feature.enabled"
               class="extend-left">
      <ListItemInfo :name="feature.name"
                    :description="feature.description"
                    :link="feature.link"
                    :selected="feature.enabled" />
    </VueSwitch>
  </div>
</template>

<script>
import ListItemInfo from '../Content/ListItemInfo.vue';
export default {
  props: {
    feature: {
      type: Object,
      required: true
    }
  },
  components: { ListItemInfo }
}
</script>

<style lang="scss" scoped>
@import "@/style/import.scss";

.project-feature-item {
  .vue-ui-switch {
    padding: $padding-item;
    width: 100%;
    box-sizing: border-box;
  }
}
</style>