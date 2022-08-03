<template functional>
  <div class="folder-explorer-item"
       :class="{hidden: props.folder.hidden}"
       @click="listeners.select()">
    <VueIcon class="folder-icon big"
             :icon="props.folder.isPackage ? 'folder' : 'folder_open'" />
    <div class="folder_name">
      {{props.folder.name}}
      <img v-if="props.folder.isVueProject"
           class="vue_ui_project_icon"
           src="~@/assets/logo.png">
    </div>
    <VueIcon v-if="props.folder.favorite"
             icon="star"
             class="favorite-icon" />
  </div>
</template>

<script>
export default {
  props: {
    folder: {
      type: Object,
      required: true
    },
  },
}
</script>

<style lang="scss" scoped>
@import "@/style/import.scss";
.folder-explorer-item {
  padding: $padding-item;
  @include h-box;
  align-items: center;
  user-select: none;
  cursor: pointer;
  position: relative;
  &:hover {
    background-color: rgba(66, 185, 131, 0.1);
  }
  &.hidden {
    opacity: 0.5;
  }
}
.vue_ui_project_icon {
  width: 14px;
  height: 14px;
  vertical-align: top;
  position: relative;
  top: 5px;
}
.folder_name {
  @include ellipsis;
  flex: 100% 1 1;
  margin-left: $padding-item;
}
.folder-icon {
  margin: 0 4px;
  ::v-deep svg {
    fill: rgba(66, 185, 131);
  }
}
.favorite-icon {
  ::v-deep svg {
    fill: rgba(66, 185, 131);
  }
}
</style>