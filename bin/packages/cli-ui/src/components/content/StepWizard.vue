<template>
  <div class="step-wizard"
       :class="{'hide-tabs': hideTabs}">
    <div class="shell">
      <div class="header">
        <div class="content">
          <div v-if="title"
               class="title">
            {{ title }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    hideTabs: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: null
    }
  },
  methods: {
    next() {
      const tabs = this.$refs.tabs;
      console.log('next-tabs', tabs)
    },
    previous() {
      const tabs = this.$refs.tabs;
      console.log('previous-tabs', tabs)

    }
  },
}
</script>

<style lang="scss" scoped>
@import "@/style/mixins.scss";
@import "@/style/vars.scss";

.step-wizard {
  box-sizing: border-box;
  .shell {
    @include v-box;
    height: 100%;
  }
  .header {
    .content {
      margin: 0 auto;
    }
  }
  .title {
    padding: $padding-item;
    font-size: 24px;
    text-align: center;
    font-weight: 300;
  }
}
</style>