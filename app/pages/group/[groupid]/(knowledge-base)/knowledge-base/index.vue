<script setup lang="ts">
import FolderIcon from '@/assets/svg/folder.svg?component'
import ShareDialog from '@/components/share-dialog/index.vue'
import TemplateLibraryDialog from '@/components/TemplateLibraryDialog.vue'
import { useFileFilter } from '@/composables/useFileFilter'
import { DeleteFilled as Delete, EditPen, Share } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getCurrentInstance } from 'vue'

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

// 打开创建对话框
function openCreateDialog() {
  templateLibraryDialog.value = true
  templateLibraryType.value = 'rich'
}

// 使用文件过滤hook
const { currentFileFilterType, viewingText, switchColumns } = useFileFilter()

// 分享对话框
const shareDialogVisible = ref(false)
const selectedFolder = ref<{ name: string } | null>(null)

// 重命名对话框
const renameDialogVisible = ref(false)
const newFolderName = ref('')
const folderToRename = ref<{ name: string, index: number } | null>(null)

// 获取应用上下文（用于ElMessage）
const { appContext } = getCurrentInstance()!

// 处理重命名
function openRenameDialog(item: { name: string }, index: number) {
  folderToRename.value = { ...item, index }
  newFolderName.value = item.name
  renameDialogVisible.value = true
}

// 处理分享
function handleShare(item: { name: string }) {
  selectedFolder.value = item
  shareDialogVisible.value = true
}

// 处理删除
function handleDelete(item: { name: string }) {
  ElMessageBox.confirm(
    `确定要删除文件夹 "${item.name}" 吗？删除后将无法恢复。`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
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
        message: `文件夹 "${item.name}" 已删除`,
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
      message: '文件夹名称不能为空',
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
        message: `文件夹已重命名为 "${newFolderName.value}"`,
        duration: 2000,
      }, appContext)

      renameDialogVisible.value = false
    })
    .catch((error) => {
      // API失败，显示错误提示
      ElMessage.error({
        message: `重命名失败：${error.message || '未知错误'}`,
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
</script>

<template>
  <div h-full flex flex-col pb-18px>
    <div class="btn-group" mr-54px mt-28px flex justify-end gap-12px>
      <el-button plain size="large" @click="openTemplateLibrary">
        <template #icon>
          <SvgoTxt />
        </template>
        {{ $t('knowledge_base.index.template_library') }}
      </el-button>
      <!-- <el-button plain size="large">
        <template #icon>
          <SvgoFolder2 />
        </template>
        {{ $t('knowledge_base.index.auto_classify') }}
      </el-button> -->
      <el-button plain size="large" @click="openUploadDialog">
        <template #icon>
          <div class="i-carbon:upload" />
        </template>
        {{ $t('knowledge_base.index.upload') }}
      </el-button>
      <el-button type="primary" size="large" @click="openCreateDialog">
        <template #icon>
          <div class="i-carbon:add-large" />
        </template>
        {{ $t('knowledge_base.index.create_new') }}
      </el-button>
    </div>
    <!-- <Dashboard /> -->
    <!-- 文件夹 -->
    <div pl-37px pr-53px>
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
                  </el-icon>重命名
                </el-dropdown-item>
                <el-dropdown-item command="share" @click="handleShare(item)">
                  <el-icon class="mr-5px">
                    <Share />
                  </el-icon>分享
                </el-dropdown-item>
                <el-dropdown-item command="delete" divided @click="handleDelete(item)">
                  <el-icon class="mr-5px">
                    <Delete />
                  </el-icon>删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
    <!-- 知识空间 -->
    <div mt-16px min-h-0 flex flex-1 flex-col pl-37px pr-53px>
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
        class="mt-16px min-h-0 flex-1"
        :type="currentFileFilterType"
      />
    </div>

    <TemplateLibraryDialog
      v-model="templateLibraryDialog"
      :default-type="templateLibraryType"
    />

    <!-- 分享对话框 -->
    <ShareDialog
      v-model="shareDialogVisible"
      :file-name="selectedFolder?.name || ''"
    />

    <!-- 重命名对话框 -->
    <el-dialog
      v-model="renameDialogVisible"
      title="重命名文件夹"
      width="400px"
    >
      <el-form @submit.prevent="handleRename">
        <el-form-item>
          <el-input
            v-model="newFolderName"
            placeholder="请输入新的文件夹名称"
            autofocus
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="renameDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleRename">确定</el-button>
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
</style>
