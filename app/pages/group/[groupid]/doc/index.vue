<script setup lang="ts">
// 使用文件过滤hook
const { currentFileFilterType } = useFileFilter()

const { isMobileDevice } = useDeviceDetection()

// 模板库对话框
const templateLibraryDialog = ref(false)
const templateLibraryType = ref('all')
const hideTemplateLibraryTabs = ref(false)

// 打开上传文档对话框
function openUploadDialog() {
  templateLibraryDialog.value = true
  templateLibraryType.value = 'upload'
  hideTemplateLibraryTabs.value = false
}

// 打开新建AI文档对话框
function openNewDocDialog() {
  templateLibraryDialog.value = true
  templateLibraryType.value = 'ai-rich'
  hideTemplateLibraryTabs.value = true
}
</script>

<template>
  <div flex flex-col>
    <div min-h-0 flex flex-1 flex-col p-20px>
      <div class="flex self-end">
        <el-button plain :size="isMobileDevice ? 'default' : 'large'" @click="openUploadDialog">
          <template #icon>
            <div class="i-carbon:upload" />
          </template>
          {{ $t('knowledge_base.index.upload') }}
        </el-button>
        <el-button type="primary" :size="isMobileDevice ? 'default' : 'large'" @click="openNewDocDialog">
          <template #icon>
            <div class="i-carbon:add-large" />
          </template>
          {{ $t('common.actions.create') }}
        </el-button>
      </div>
      <FolderTable
        class="mt-16px min-h-0 flex-1"
        :type="currentFileFilterType"
      />
    </div>

    <TemplateLibraryDialog
      v-model="templateLibraryDialog"
      :default-type="templateLibraryType"
      :hide-left-tabs="hideTemplateLibraryTabs"
    />
  </div>
</template>
