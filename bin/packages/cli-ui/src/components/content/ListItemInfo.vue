<template>
  <div class="list-item-info"
       :class="{selected}">
    <div class="name">
      <slot name="name">
        <span v-html="ansiColors(name)" />
      </slot>
    </div>
    <div v-if="description || link || showDescription"
         class="description">
      <slot name="description">
        <span v-html="ansiColors(description)" />
      </slot>
      <a v-if="link"
         :href="link"
         target="_blank"
         class="more-info"
         @click.stop="() => {}">
        <VueIcon icon="open_in_new"
                 class="medium top" />
        查看详情
      </a>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    description: {
      type: String,
      default: ''
    },

    link: {
      type: String,
      default: null
    },

    name: {
      type: String,
      default: null
    },

    selected: {
      type: Boolean,
      default: false
    },

    showDescription: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/style/import.scss";
.list-item-info {
  align-items: stretch;
  justify-content: center;
  .description {
    color: #6a8bad;
    ::v-deep :first-child {
      margin-right: 4px;
    }
    ::v-deep .vue-ui-icon {
      svg {
        fill: #6a8bad;
      }
    }
  }
  &.selected {
    .name {
      color: #42b983;
    }
  }
}
</style>