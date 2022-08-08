<template>
  <div class="project-preset-item list-item-ifo"
       :class="{
      selected
    }"
       :data-testid="preset.id">
    <div class="content">
      <div class="radio-icon">
        <VueIcon :icon="selected ? 'radio_button_checked' : 'radio_button_unchecked'"
                 class="medium" />
        <ListItemInfo :name="preset.name"
                      :description="description || preset.description"
                      :link="preset.link"
                      :selected="selected" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    preset: {
      type: Object,
      required: true
    },
    selected: {
      type: Boolean,
      required: true
    },
    description: {
      type: String,
      default: null
    }
  },
}
</script>

<style lang="scss" scoped>
@import "@/style/import.scss";

.project-preset-item {
  padding: $padding-item;
  padding-left: 0;
  .content {
    display: grid;
    grid-template-columns: 64px auto;
    grid-template-rows: auto;
    grid-template-areas: "icon info";
  }
  .radio-icon {
    @include h-box;
    @include box-center;
    grid-area: icon;
  }
  .list-item-info {
    grid-area: info;
  }
  &.selected {
    .radio-icon {
      ::v-deep svg {
        fill: #f7fcfa;
      }
    }
  }
  .medium {
    margin-left: 40px;
  }
}
</style>