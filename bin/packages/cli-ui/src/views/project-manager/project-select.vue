<template>
  <div class="project-select page">
    <StepWizard title="Block 项目管理器"
                :tab-id.sync="tab"
                :hide-tabs="hideTabs"
                class="frame">
      <VueTab id="existing"
              label="项目"
              icon="storage"
              class="select">
        <ProjectSelectList />
      </VueTab>

      <VueTab id="create"
              label="创建"
              icon="add_box"
              class="create">
        <div class="content">
          <FolderExplorer />
        </div>
        <div class="actions-bar center">
          <VueButton icon-left="add"
                     label="再次创建项目"
                     class="big primary create-project"
                     @click="createProject()" />
        </div>
      </VueTab>
    </StepWizard>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tab: undefined,
      hideTabs: !!this.$route.query.hideTabs,
      showNoModulesModal: false,
      busy: false
    }
  },
  methods: {
    createProject() {
      console.log('createProject')
    }
  },
}
</script>

<style lang="scss" scoped>
.project-select {
  height: 100%;
}

.page {
}
</style>