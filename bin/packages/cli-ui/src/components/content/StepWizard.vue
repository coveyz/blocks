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

      <VueTabs ref="tabs"
               class="main-tabs"
               group-class="accent"
               v-bind="$attrs"
               v-on="$listeners">
        <slot :next="next"
              :previous="previous" />
      </VueTabs>
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
      tabs.activateChild(tabs.activeChildIndex + 1)
    },
    previous() {
      const tabs = this.$refs.tabs;
      console.log('previous-tabs', tabs)
      tabs.activateChild(tabs.activeChildIndex - 1)

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
    background-color: $content-bg-primary-light;
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
  .main-tabs {
    height: 0;
    flex: auto 1 1;
  }
  .headr,
  ::v-deep .tabs {
    background-color: $content-bg-primary-light;
    .vue-ui-dark-mode {
      & {
        background-color: red;
      }
    }
  }
  ::v-deep .vue-ui-tab {
    margin: 0 auto;
    padding: $padding-item $padding-item 0;
    box-sizing: border-box;
  }
  &,
  ::v-deep .vue-ui-tab {
    height: 100%;
  }

  ::v-deep .tabs-content {
    height: 0;
    flex: auto 1 1;
  }

  &,
  ::v-deep .vue-ui-tab,
  ::v-deep .vue-ui-tab-content {
    height: 100%;
  }

  ::v-deep .vue-ui-tab-content {
    overflow-y: hidden;
    @include v-box;
    margin: 0 auto;
    > .content {
      flex: 100% 1 1;
      height: 0;
      overflow-y: auto;
    }
    > .actions_bar {
      justify-content: center;
      .vue-ui-button:not(.icon-button) {
        min-width: 190px;
      }
    }
  }
}
</style>