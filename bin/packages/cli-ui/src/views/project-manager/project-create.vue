<template>
  <div class="project_create page">
    <div class="content">
      <StepWizard title="创建新项目"
                  class="frame">
        <!-- <template slot-scope="{next,previous}"> -->
        <template>
          <VueTab id="detaild"
                  class="details"
                  label="详情"
                  icon="subject">
            <div class="content vue-ui-disable-scroll">
              <div class="project-details vue-ui-grid col-1">
                <VueFormField title="项目文件夹">
                  <VueInput v-model="formData.folder"
                            icon-left="folder"
                            class="big app-name"
                            placeholder="输入项目名" />
                </VueFormField>
              </div>
            </div>
          </VueTab>

        </template>
      </StepWizard>
    </div>
  </div>
</template>

<script>
// import Prompts from '@/mixins/Prompts'

// import PROJECT_CREATION from '@/graphql/projectCreation'
// import CWD from '@/graphql/cwd/cwd.gql'

const formDataFactory = () => {
  return {
    folder: '',
    force: false,
    bare: false,
    enableGit: true,
    gitCommitMessage: '',
    packageManager: undefined,
    selectedPreset: null,
    remotePreset: {
      url: '',
      clone: false
    },
    save: ''
  }
}

let formData = formDataFactory()

export default {
  // mixins: [Prompts({ field: 'projectCreate', query: PROJECT_CREATION })]
  data() {
    return {
      formData: formData
    }
  },
}
</script>

<style lang="scss" scoped>
@import "@/style/import.scss";
.project_create {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  grid-template-areas: "content";
}
.content {
  grid-area: "content";
}
.project-details {
  max-width: 400px;
  width: 100%;
  margin: 42px auto;
  grid-gap: ($padding-item * 3);
}
::v-deep .vue-ui-input:not(.flat) > .content {
  background: #f7fcfa;
}
</style>