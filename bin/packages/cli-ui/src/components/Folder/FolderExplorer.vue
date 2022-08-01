<template>
  <div class="folder-explorer"
       :class="{error}">
    <div class="toolbar">
      <VueButton class="icon-button go-up"
                 icon-left="keyboard_arrow_up"
                 v-tooltip="getTip('上一层')"
                 @click="openParentFolder" />
      <div class="path-edit"
           v-if="editingPath">
        todo input
      </div>
    </div>
  </div>
</template>

<script>
import { isValidName } from '@/utils/folders'

const SHOW_HIDDEN = 'vue-ui.show-hidden-folders'

export default {
  data() {
    return {
      error: false,
      editingPath: false
    }
  },
  methods: {
    getTip(tip) {
      return tip
    },
    openParentFolder() {

    }
  },
}
</script>

<style lang="scss" scoped>
@import "@/style/import.scss";
.toolbar {
  padding: $padding-item;
  @include h-box;
  align-items: center;
  ::v-deep > * {
  }
}
.editingPath {
  flex: 100% 1 1;
  > .vue-ui-input {
    width: 100%;
  }
}
.folder-explorer {
  @include v-box;
  align-items: stretch;
  .floders {
    flex: 100% 1 1;
    overflow-x: hidden;
    overflow-y: auto;
    position: relative;
  }
}
</style>