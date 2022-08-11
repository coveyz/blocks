<template>
  <div class="project_create page">
    <div class="content">
      <StepWizard title="创建新项目"
                  class="frame">
        <template slot-scope="{next,previous}">
          <!-- <template slot-scope="{ next }"> -->
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
                                   @click.native="selectPreset(preset)" />

              </template>

              <div class="actions_bar">
                <VueButton icon-left="arrow_back"
                           label="上一步"
                           class="big previous"
                           @click="previous()" />

                <VueButton v-if="manual"
                           icon-right="arrow_forward"
                           label="下一步"
                           class="big primary next"
                           :disabled="!presetValid"
                           @click="next()" />
                <VueButton v-else
                           icon-left="done"
                           label="创建项目"
                           class="big primary next"
                           :disabled="!formData.selectedPreset"
                           @click="createWithoutSaving()" />
              </div>
            </div>
          </VueTab>

          <!-- 🔧 功能  ✅-->
          <VueTab id="features"
                  class="features"
                  icon="device_hub"
                  :disabled="!detailsValid || !presetValid || !manual"
                  lazy
                  label="功能">
            <div class="content vue-ui-disable-scroll">
              <div class="vue-ui-text info banner">
                <VueIcon icon="info"
                         class="big" />
                <span>
                  在项目创建之后，你仍然可以通过安装插件来增加功能。
                </span>

              </div>
              <div class="cta-text">
                选择功能
              </div>

              <template v-if="projectCreation">
                <ProjectFeatureItem v-for="feature of projectCreation['features']"
                                    :key="feature['id']"
                                    :feature="feature"
                                    @click.native="toggleFeature(feature)" />
              </template>

            </div>
            <div class="actions_bar">
              <VueButton icon-left="arrow_back"
                         label="上一步"
                         class="big previous"
                         @click="previous()" />
              <VueButton icon-left="done"
                         label="创建项目"
                         class="big primary next"
                         @click="showSavePreset =true" />
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

    <!-- 📷  设置预设 -->
    <VueModal v-if="showSavePreset"
              title="保存为新预设"
              class="medium save-preset-modal"
              @close="showSavePreset=false">
      <div class="default-body">
        {{formData}}
        <VueFormField title="预设名"
                      subtitle="将功能和配置保存为一套新的预设">
          <VueInput icon-left="local_offer"
                    v-model="formData.save" />
        </VueFormField>
        <div slot="footer"
             class="actions_bar end">
          <VueButton label="取消"
                     class="flat close"
                     @click="showSavePreset = false" />
          <VueButton label="创建项目不保存预设"
                     class="continue middleItem"
                     @click="createWithoutSaving()" />
          <VueButton label="保存预设 并且创建项目"
                     icon-left="save"
                     class="primary save"
                     :disabled="!formData.save"
                     @click="createProject()" />
        </div>
      </div>
    </VueModal>
    <!-- 设置预设 🍌 -->

  </div>
</template>

<script>
import validateNpmPackageName from 'validate-npm-package-name'
// import Prompts from '@/mixins/Prompts'

import PROJECT_CREATION from '@/graphql/project/projectCreation.gql'
import CWD from '@/graphql/cwd/cwd.gql'
import FEATURE_SET_ENABLED from '@/graphql/feature/featureSetEnabled.gql'
import PRESET_APPLY from '@/graphql/preset/presetApply.gql'
import PROJECT_CREATE from '@/graphql/project/projectCreate.gql';

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
    save: '',
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
      projectCreation: null,
      showSavePreset: false
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
    },
    presetValid() {
      return !!this.formData.selectedPreset
    },
    manual() {
      return this.formData.selectedPreset === '__manual__'
    }
  },
  methods: {
    next() {
      console.log('next=>')
    },
    async selectPreset(preset) {
      console.log('preset=>', preset)
      console.log('formdata=>', this.formData, '<==id=>', preset.id)
      this.formData.selectedPreset = preset.id
      if (preset.id === '__remoto__') return;

      await this.$apollo.mutate({
        mutation: PRESET_APPLY,
        variables: {
          id: preset.id
        },
        update: (store, { data: { presetApply } }) => {
          console.log('PRESET_APPLY => update=>presetApplu', presetApply)
          console.log('PRESET_APPLY => store=>', store)
          store.writeQuery({ query: PROJECT_CREATION, data: { projectCreation: presetApply } })
        }
      })

    },
    async toggleFeature(feature) {
      console.log('toggleFeature=>', feature);

      await this.$apollo.mutate({
        mutation: FEATURE_SET_ENABLED,
        variables: {
          id: feature.id,
          enabled: !feature.enabled
        }
      })
      // console.log('projectCreation=', this.projectCreation)
      this.$apollo.queries.projectCreation.refetch();
    },
    createWithoutSaving() {
      this.formData.save = ''
      this.createProject()
    },
    async createProject() {
      this.showSavePreset = false;

      try {
        //todo 
        await this.$apollo.mutate({
          mutation: PROJECT_CREATE,
          variables: {
            input: {
              folder: this.formData.folder,
              force: this.formData.force,
              bare: this.formData.bare,
              enableGit: this.formData.enableGit,
              gitCommitMessage: this.formData.gitCommitMessage,
              packageManager: this.formData.packageManager,
              preset: this.formData.selectedPreset,
              remote: this.formData.remotePreset.url,
              clone: this.formData.remotePreset.clone,
              save: this.formData.save
            }
          }
        })
      } catch (error) {
        console.log('error=>', error)
      }


    },
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