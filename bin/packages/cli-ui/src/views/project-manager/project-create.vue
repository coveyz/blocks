<template>
  <div class="project_create page">
    <div class="content">
      <StepWizard title="创建新项目"
                  class="frame">
        <!-- <template slot-scope="{next,previous}"> -->
        <template slot-scope="{ next }">
          <!-- <template> -->
          <VueTab id="detaild"
                  class="details"
                  label="详情"
                  icon="subject">
            <!-- 操作流程 -->
            <div class="content vue-ui-disable-scroll">
              <div class="project-details vue-ui-grid col-1">
                <VueFormField title="项目文件夹">
                  <VueInput v-model="formData.folder"
                            icon-left="folder"
                            class="big app-name"
                            placeholder="输入项目名" />
                  <div slot="subtitle">
                    <div class="project_path">
                      <div class="path">
                        <span class="cwd">
                          {{cwd | folder(42 - formData.folder.length )}}
                        </span>
                        <span class="folder">
                          {{formData.folder}}
                        </span>
                      </div>

                    </div>
                  </div>
                </VueFormField>
              </div>
            </div>

            <!-- 按钮 操作栏 -->
            <div class="actions_bar">
              <VueButton icon-left="close"
                         label="取消"
                         class="big close"
                         @click="showCancel=true" />
              <VueButton icon-right="arrow_forward"
                         label="下一步"
                         class="big primary next"
                         :disabled="!detailsValid"
                         @click="next()" />
            </div>
          </VueTab>

          <VueTab id="presets"
                  class="presets"
                  label="预设"
                  icon="check_circle"
                  :disabled="!detailsValid"
                  lazy>
            <div class="content vue-ui-disable-scroll">
              <div class="vue-ui-text info banner">
                <VueIcon icon="info"
                         class="big" />
                <span>
                  预设就是一套定义好的插件和配置。 你也可以将自己的配置保存成预设，方便以后创建项目使用。
                </span>
              </div>
              <div class="cta-text">
                选择一套预设
              </div>
              <template v-if="projectCreation">
                <ProjectPresetItem v-for="preset in projectCreation.presets"
                                   :key="preset.id"
                                   :preset="preset"
                                   :selected="formData.selectedPreset === preset.id"
                                   @click.native="selectPreset(preset.id)" />

              </template>
            </div>
          </VueTab>
        </template>
      </StepWizard>
    </div>

    <VueModal v-if="showCancel"
              title="取消创建项目"
              class="small"
              @close="showCancel=false">
      <div class="default-body">
        确定要取消创建吗？
      </div>
      <div slot="footer"
           class="actions end">
        <VueButton label="不"
                   class="flat"
                   @click="showCancel = false" />

        <VueButton :to="{ name: 'project-select' }"
                   label="取消创建"
                   icon-left="delete_forever"
                   class="danger" />
      </div>
    </VueModal>
  </div>
</template>

<script>
import validateNpmPackageName from 'validate-npm-package-name'
// import Prompts from '@/mixins/Prompts'

import PROJECT_CREATION from '@/graphql/project/projectCreation.gql'
import CWD from '@/graphql/cwd/cwd.gql'

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
  name: 'ProjectCreate',
  // mixins: [Prompts({ field: 'projectCreate', query: PROJECT_CREATION })]
  apollo: {
    cwd: {
      query: CWD,
      fetchPolicy: 'network-only'
    },
    projectCreation: {
      query: PROJECT_CREATION,
      fetchPolicy: 'network-only'
    }
  },
  data() {
    return {
      formData: formData,
      cwd: '',
      showCancel: false,
      projectCreation: null
    }
  },
  computed: {
    folderNameValidationResult() {
      return validateNpmPackageName(this.formData.folder)
    },
    folderNameValid() {
      return this.folderNameValidationResult.validForNewPackages
    },
    detailsValid() {
      return !!this.formData.folder && this.folderNameValid
    }
  },
  methods: {
    next() {
      console.log('next=>')
    },
    selectPreset(id) {
      console.log('formdata=>', this.formData, '<==id=>', id)
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
  .vue-ui-text .banner {
    margin-top: 6px;
  }
}
::v-deep .vue-ui-input:not(.flat) > .content {
  background: #f7fcfa;
}
.project_path {
  @include h-box;
  @include box-center;
  .path {
    flex: 100% 1 1;
    margin-right: 6px;
    @include h-box;
    align-items: baseline;
    .folder {
      font-weight: bold;
    }
  }
}
.actions_bar {
  padding: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;
  > * {
    flex: auto 0 0;
    margin-right: 16px;
  }
}
.default-body {
}
</style>