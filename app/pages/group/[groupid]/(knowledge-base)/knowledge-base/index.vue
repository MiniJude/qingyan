<script setup lang="ts">
import FolderIcon from '@/assets/svg/folder.svg?component'
import ShareDialog from '@/components/share-dialog/index.vue'
import TemplateLibraryDialog from '@/components/TemplateLibraryDialog.vue'
import { useFileFilter } from '@/composables/useFileFilter'
import { DeleteFilled as Delete, EditPen, FolderAdd, Share } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getCurrentInstance } from 'vue'
import { useI18n } from 'vue-i18n'

// 模板接口定义
interface Template {
  id: string
  type: string
  file_type: string
  title: string
  content: string
  image: string
  preview_url: string
}

const { isMobileDevice } = useDeviceDetection()
const { t } = useI18n()

const folderList = ref([
  {
    name: '文件夹1',
  },
  {
    name: '文件夹2',
  },
  {
    name: '文件夹3',
  },
  {
    name: '文件夹4',
  },
  {
    name: '待归档',
  },
])

// 模板库对话框
const templateLibraryDialog = ref(false)
const templateLibraryType = ref('all')
const selectedTemplate = ref<Template | null>(null)
const selectFolderDialogVisible = ref(false)

// 打开模板库对话框
function openTemplateLibrary() {
  templateLibraryDialog.value = true
  templateLibraryType.value = 'all'
}

// 打开上传文档对话框
function openUploadDialog() {
  templateLibraryDialog.value = true
  templateLibraryType.value = 'upload'
}

// 使用文件过滤hook
const { currentFileFilterType, viewingText, switchColumns } = useFileFilter()

// 重命名对话框
const renameDialogVisible = ref(false)
const newFolderName = ref('')
const folderToRename = ref<{ name: string, index: number } | null>(null)

// 新建文件夹对话框
const createFolderDialogVisible = ref(false)
const createFolderName = ref('')
const selectedParentFolder = ref<string>('root') // 默认选择根目录

// 获取应用上下文（用于ElMessage）
const { appContext } = getCurrentInstance()!

// 处理重命名
function openRenameDialog(item: { name: string }, index: number) {
  folderToRename.value = { ...item, index }
  newFolderName.value = item.name
  renameDialogVisible.value = true
}

// 处理删除
function handleDelete(item: { name: string }) {
  ElMessageBox.confirm(
    t('knowledge_base.folder.delete_confirm_message', { name: item.name }),
    t('knowledge_base.folder.delete_confirm_title'),
    {
      confirmButtonText: t('common.actions.confirm'),
      cancelButtonText: t('common.actions.cancel'),
      type: 'warning',
    },
  )
    .then(() => {
      // 这里添加删除文件夹的API调用
      // 假设API调用成功，从列表中移除该文件夹
      const index = folderList.value.findIndex(folder => folder.name === item.name)
      if (index !== -1) {
        folderList.value.splice(index, 1)
      }

      ElMessage.success({
        message: t('knowledge_base.folder.delete_success', { name: item.name }),
        duration: 2000,
      }, appContext)
    })
    .catch(() => {
      // 取消删除操作
    })
}

// 提交重命名
function handleRename() {
  if (!newFolderName.value.trim()) {
    ElMessage.warning({
      message: t('knowledge_base.folder.name_empty_error'),
      duration: 2000,
    }, appContext)
    return
  }

  // 确保folderToRename不为null和索引有效
  if (folderToRename.value === null) {
    return
  }

  // 使用可选链和默认值防护
  const folderName = folderToRename.value?.name || ''
  const folderIndex = folderToRename.value?.index || -1

  // 这里调用重命名文件夹的API
  // 模拟API调用，传入文件夹名称和新名称
  callRenameFolderApi(folderName, newFolderName.value)
    .then(() => {
      // API成功，直接更新本地数据
      if (folderIndex >= 0 && folderIndex < folderList.value.length) {
        if (folderList.value[folderIndex]) {
          folderList.value[folderIndex].name = newFolderName.value
        }
      }

      ElMessage.success({
        message: t('knowledge_base.folder.rename_success', { name: newFolderName.value }),
        duration: 2000,
      }, appContext)

      renameDialogVisible.value = false
    })
    .catch((error) => {
      // API失败，显示错误提示
      ElMessage.error({
        message: t('knowledge_base.folder.rename_failed', { error: error.message || t('common.messages.unknown_error') }),
        duration: 2000,
      }, appContext)
    })
}

// 重命名文件夹API封装（示例）
function callRenameFolderApi(_oldName: string, _newName: string) {
  // 这里替换为实际的API调用
  return new Promise<void>((resolve, _reject) => {
    // 模拟API调用成功
    // 如果要模拟失败，使用: reject(new Error('重命名失败，请稍后重试'))
    setTimeout(() => {
      resolve()
    }, 500)
  })
}

// 打开新建文件对话框
function openCreateFileDialog() {
  templateLibraryDialog.value = true
  templateLibraryType.value = 'upload'
}

// 打开新建文件夹对话框
function openCreateFolderDialog() {
  createFolderName.value = ''
  selectedParentFolder.value = 'root'
  createFolderDialogVisible.value = true
}

// 创建文件夹API封装（示例）
function callCreateFolderApi(_name: string, _parentFolder: string) {
  // 这里替换为实际的API调用
  return new Promise<void>((resolve, _reject) => {
    // 模拟API调用成功
    // 如果要模拟失败，使用: reject(new Error('创建失败，请稍后重试'))
    setTimeout(() => {
      resolve()
    }, 500)
  })
}

// 处理创建文件夹
function handleCreateFolder() {
  if (!createFolderName.value.trim()) {
    ElMessage.warning({
      message: t('knowledge_base.folder.name_empty_error'),
      duration: 2000,
    }, appContext)
    return
  }

  // 调用创建文件夹API
  callCreateFolderApi(createFolderName.value, selectedParentFolder.value)
    .then(() => {
      // API成功，添加到本地数据
      folderList.value.push({
        name: createFolderName.value,
      })

      ElMessage.success({
        message: t('knowledge_base.folder.create_success', { name: createFolderName.value }),
        duration: 2000,
      }, appContext)

      createFolderDialogVisible.value = false
    })
    .catch((error) => {
      // API失败，显示错误提示
      ElMessage.error({
        message: t('knowledge_base.folder.create_failed', { error: error.message || t('common.messages.unknown_error') }),
        duration: 2000,
      }, appContext)
    })
}

// 处理模板选择事件
function handleSelectTemplate(template: Template) {
  selectedTemplate.value = template
  selectFolderDialogVisible.value = true
}

// 处理模板创建确认
function handleTemplateConfirm() {
  if (!selectedTemplate.value) {
    return
  }

  // 这里将来需要实现模板创建的API调用
  // 例如：createDocumentFromTemplate(selectedTemplate.value, selectedParentFolder.value)

  ElMessage.success({
    message: t('common.messages.operation_success', { operation: t('knowledge_base.template.use') }),
    duration: 2000,
  }, appContext)

  selectFolderDialogVisible.value = false
  selectedTemplate.value = null
}
</script>

<template>
  <div h-full flex flex-col pb-18px>
    <div class="btn-group flex justify-end gap-12px px-58px pt-28px !lt-md:justify-end !lt-md:p-4">
      <el-button plain size="large" @click="openTemplateLibrary">
        <template #icon>
          <SvgoTxt />
        </template>
        <template v-if="!isMobileDevice" #default>
          {{ $t('knowledge_base.index.template_library') }}
        </template>
      </el-button>
      <el-button plain size="large" @click="openUploadDialog">
        <template #icon>
          <div class="i-carbon:upload" />
        </template>
        <template v-if="!isMobileDevice" #default>
          {{ $t('knowledge_base.index.upload') }}
        </template>
      </el-button>
      <el-dropdown>
        <el-button type="primary" size="large">
          <template v-if="!isMobileDevice">
            {{ $t('common.actions.create') }}
          </template>
          <template v-else>
            <div class="i-carbon:add-large" />
          </template>
          <div ml-8px h-16px w-16px flex-center>
            <SvgoArrowBottomFilled text-6px />
          </div>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="openCreateFolderDialog">
              {{ $t('knowledge_base.index.folder') }}
            </el-dropdown-item>
            <el-dropdown-item @click="openCreateFileDialog">
              {{ $t('knowledge_base.index.file') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <!-- <Dashboard /> -->
    <!-- 文件夹 -->
    <div pl-37px pr-53px lt-md:pl-10px lt-md:pr-10px>
      <div mb-8px text-16px text-tprimary font-bold>
        {{ $t('knowledge_base.index.folders') }}
      </div>
      <div p-8px class="folder-container bg-[#f7f7f7] dark:bg-black">
        <div v-for="item in folderList" :key="item.name" class="folder-item" p="y-20px l-20px r-11px" flex items-center justify-between rounded-4px bg-white dark:bg-overlay>
          <div flex items-center gap-13px>
            <FolderIcon h-19px w-19px style="color: #FFC300;" />
            <div text-tprimary>
              {{ item.name }}
            </div>
          </div>
          <el-dropdown trigger="click">
            <span class="dropdown-trigger">
              <SvgoMore cursor-pointer text-20px text-tregular />
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="rename" @click="openRenameDialog(item, folderList.indexOf(item))">
                  <el-icon class="mr-5px">
                    <EditPen />
                  </el-icon>{{ $t('knowledge_base.folder.rename') }}
                </el-dropdown-item>
                <el-dropdown-item command="delete" divided @click="handleDelete(item)">
                  <el-icon class="mr-5px">
                    <Delete />
                  </el-icon>{{ $t('knowledge_base.delete') }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
    <!-- 知识空间 -->
    <div mt-16px min-h-0 flex flex-1 flex-col pl-37px pr-53px lt-md:pl-10px lt-md:pr-10px>
      <div mb-16px flex items-center justify-between>
        <span text-16px text-tprimary font-bold>
          {{ $t('knowledge_base.index.knowledge_space') }}
        </span>
        <span text-12px text-tregular>
          {{ viewingText }}
        </span>
      </div>
      <Switch
        v-model="currentFileFilterType"
        h-36px
        :columns="switchColumns"
        :item-width="83"
      />
      <FolderTable
        class="folder-table mt-16px min-h-0 flex-1"
        :type="currentFileFilterType"
      />
    </div>

    <TemplateLibraryDialog
      v-model="templateLibraryDialog"
      :default-type="templateLibraryType"
      @select-template="handleSelectTemplate"
    />

    <!-- 重命名对话框 -->
    <el-dialog
      v-model="renameDialogVisible"
      :title="$t('knowledge_base.folder.rename_dialog_title')"
      width="360px"
    >
      <el-form @submit.prevent="handleRename">
        <el-form-item>
          <el-input
            v-model="newFolderName"
            :placeholder="$t('knowledge_base.folder.enter_new_folder_name')"
            autofocus
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="renameDialogVisible = false">{{ $t('common.actions.cancel') }}</el-button>
          <el-button type="primary" @click="handleRename">{{ $t('common.actions.confirm') }}</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 新建文件夹对话框 -->
    <el-dialog
      v-model="createFolderDialogVisible"
      :title="$t('knowledge_base.folder.create_dialog_title')"
      width="400px"
      class="create-folder-dialog"
      :fullscreen="isMobileDevice"
    >
      <el-form label-width="100px" @submit.prevent="handleCreateFolder">
        <el-form-item :label="$t('knowledge_base.folder.target_location')" class="lt-md:mb-4">
          <el-select
            v-model="selectedParentFolder"
            :placeholder="$t('knowledge_base.folder.select_folder')"
            class="w-full"
          >
            <el-option
              key="root"
              :label="$t('knowledge_base.folder.root_folder')"
              value="root"
            />
            <el-option
              v-for="item in folderList"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('knowledge_base.folder.folder_name')" class="lt-md:mb-4">
          <el-input
            v-model="createFolderName"
            :placeholder="$t('knowledge_base.folder.enter_folder_name')"
            autofocus
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="createFolderDialogVisible = false">{{ $t('common.actions.cancel') }}</el-button>
          <el-button type="primary" @click="handleCreateFolder">{{ $t('common.actions.confirm') }}</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 选择目录对话框 -->
    <el-dialog
      v-model="selectFolderDialogVisible"
      :title="$t('knowledge_base.template.select_folder')"
      width="400px"
      class="select-folder-dialog"
      :fullscreen="isMobileDevice"
    >
      <el-form label-width="100px" @submit.prevent="handleTemplateConfirm">
        <el-form-item :label="$t('knowledge_base.folder.target_location')" class="lt-md:mb-4">
          <el-select
            v-model="selectedParentFolder"
            :placeholder="$t('knowledge_base.folder.select_folder')"
            class="w-full"
          >
            <el-option
              key="root"
              :label="$t('knowledge_base.folder.root_folder')"
              value="root"
            />
            <el-option
              v-for="item in folderList"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="selectFolderDialogVisible = false">{{ $t('common.actions.cancel') }}</el-button>
          <el-button type="primary" @click="handleTemplateConfirm">{{ $t('common.actions.confirm') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.btn-group {
  .el-button {
    margin-left: 0;
  }

  @media (max-width: 768px) {
    justify-content: center;
    padding: 0;
    padding-bottom: 14px;
    padding-top: 14px;
  }
}

.folder-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  padding: 8px;
  border-radius: 4px;
  .folder-item {
    height: 60px;
    border-radius: 4px;
    border: 1px solid var(--app-border-regular);
    display: flex;
  }
}

.folder-table {
  @media (max-width: 768px) {
    height: 500px;
    min-height: 500px;
  }
}

.create-folder-dialog {
  .el-form-item {
    margin-bottom: 20px;
  }

  @media (max-width: 768px) {
    .el-form-item__label {
      padding-bottom: 8px;
      display: block;
      text-align: left;
    }

    .el-select,
    .el-input {
      width: 100%;
    }
  }
}
</style>
