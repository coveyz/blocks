<template>
  <div class="folder-explorer"
       :class="{error}">
    <!-- 操作栏 ✏️ -->
    <div class="toolbar">
      <VueButton class="icon-button go-up"
                 icon-left="keyboard_arrow_up"
                 v-tooltip="getTip('上一层')"
                 @click="openParentFolder" />
      <div class="path-edit"
           v-if="editingPath">
        todo input
      </div>

      <ApolloQuery v-else
                   :query="require('@/graphql/cwd/cwd.gql')"
                   class="current_path"
                   @dblclick="openpathEdit()">
        <ApolloSubscribeToMore :document="require('@/graphql/cwd/cwdChanged.gql')"
                               :updateQuery="cwdChangedUpdate" />
        <template slot-scope="{result: {data}}">
          <div class="path_value"
               v-if="data">
            <div class="path_part"
                 v-for="(slice,index) in slicePath(data.cwd,data)"
                 :key="index">
              <VueButton class="path_folder flat"
                         :class="{
                            'icon-button': !slice.name
                          }"
                         :icon-left="!slice.name ? 'folder' : null"
                         @click="openFolder(slice.path)">
                {{slice.name}}
              </VueButton>
            </div>
          </div>
        </template>
      </ApolloQuery>
      <VueButton class="icon-button"
                 icon-left="refresh" />
      <VueDropdown placement="bottom-end">
        <VueButton slot="trigger"
                   icon-left="more_vert"
                   class="icon-button" />
        <VueSwitch icon="visibility"
                   v-model="showHidden"
                   class="extend-left">
          现实隐藏文件
        </VueSwitch>
      </VueDropdown>
    </div>
    <!-- 文件展示 📃 -->
    <div class="folders"
         ref="folders">
      <transition name="vue-ui-fade">
        <VueLoadingBar v-if="loading"
                       class="ghost primary"
                       unknown />
      </transition>
      <template v-if="folderCurrent && folderCurrent.children">
        <template v-for="folder in folderCurrent.children">
          <FoldExploreItem v-if="showHidden || !folder.hidden"
                           :key="folder.name"
                           :folder="folder"
                           @select="openFolder(folder.path)" />
        </template>
      </template>
    </div>
  </div>
</template>

<script>
// import { isValidName } from '@/utils/folders'
import FOLDER_OPEN from '@/graphql/folder/folderOpen.gql'
import FOLDER_CURRENT from '@/graphql/folder/folderCurrent.gql'
import FOLDER_OPEN_PARENT from '@/graphql/folder/folderOpenParent.gql'

const SHOW_HIDDEN = 'vue-ui.show-hidden-folders'

export default {
  data() {
    return {
      loading: 0,
      error: false,
      editingPath: false,
      showHidden: localStorage.getItem(SHOW_HIDDEN) === 'true',
      folderCurrent: {}
    }
  },
  apollo: {
    folderCurrent: {
      query: FOLDER_CURRENT,
      fetchPolicy: 'network-only',
      loadingKey: "loading",
      async result(res) {
        console.log('apollo-FOLDER_CURRENT', res)
        await this.$nextTick()
        this.$refs.folders.scrollTop = 0
      }
    }
  },
  methods: {
    getTip(tip) {
      return tip
    },
    openParentFolder() {
      this.editingPath = false;
      this.error = null;
      this.loading++
      try {
        this.$apollo.mutate({
          mutation: FOLDER_OPEN_PARENT,
          update: (store, { data: { folderOpenParent } }) => {
            console.log('openParentFolder-FOLDER_OPEN_PARENT-update=>', folderOpenParent, '-store=>', store)
            store.writeQuery({ query: FOLDER_CURRENT, data: { folderCurrent: folderOpenParent } })
          }
        })
      } catch (error) {
        this.error = error;
        console.log('openParentFolder-error=>', error)
      }
      this.loading--
    },
    openpathEdit() {

    },
    // 订阅 cwd
    cwdChangedUpdate(previousResult, { subscriptionData }) {
      console.log('cwdChangedUpdate->subscriptionData', subscriptionData)
      return {
        cwd: subscriptionData.data.cwd
      }
    },
    // 整合路径 模块
    slicePath(path) {
      const parts = [];
      let startIndex = 0, index;

      const findSeparator = () => {
        index = path.indexOf('/', startIndex);
        if (index === -1) index = path.indexOf('\\', startIndex)
        return index !== -1
      }

      const addPart = (index) => {
        const folder = path.substring(startIndex, index)
        const slice = path.substring(0, index + 1)
        // console.log('folder=>', folder);
        // console.log('path=>', slice)
        parts.push({
          name: folder,
          path: slice
        })

      }

      while (findSeparator()) {
        addPart(index);
        startIndex = index + 1;
      }

      if (startIndex < path.length) addPart(path.length)
      // console.log('parts=>', parts)
      return parts
    },
    // 打开文件
    async openFolder(path) {
      // console.log('openFolder-path=>', path)
      this.editingPath = false
      this.error = null
      this.loading++
      try {
        await this.$apollo.mutate({
          mutation: FOLDER_OPEN,
          variables: {
            path
          },
          update: (store, { data: { folderOpen } }) => {
            console.log('openFolder-FOLDER_OPEN-update=>', folderOpen, '-store=>', store)
            store.writeQuery({ query: FOLDER_CURRENT, data: { folderCurrent: folderOpen } })
          }
        })
      } catch (error) {
        this.error = error
        console.log('openFolder-error=>', error)
      }
      this.loading--
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
    margin-right: $padding-item;
  }
  ::v-deep > *:nth-last-child(1) {
    margin-right: 0;
  }
}
.editingPath {
  flex: 100% 1 1;
  > .vue-ui-input {
    width: 100%;
  }
}
.current_path {
  flex: 100% 1 1;
  @include h-box;
  align-items: stretch;
  border-radius: 3px;
  background: #e4f5ef;
  .path_value {
    flex: auto 1 1;
    @include h-box;
    align-items: stretch;
  }
  .path_folder {
    padding: 0 9px;
  }
  .edit_path_button {
    margin-left: 4px;
  }
  .path_part {
    &:not(:first-child) {
      border-left: 2px solid #fff;
    }
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