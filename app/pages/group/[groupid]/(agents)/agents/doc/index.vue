<script setup lang="ts">
import { AiDocType } from '@/constants'

const { t } = useI18n()

// 使用文件过滤hook
const { currentFileFilterType, switchColumns } = useFileFilter()

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

// 创建文档对应的值
const _docTypes = [
  { label: t('agents.doc.formats.ppt'), value: AiDocType.PPT },
  { label: t('agents.doc.formats.word'), value: AiDocType.WORD },
  { label: t('agents.doc.formats.excel'), value: AiDocType.EXCEL },
]
</script>

<template>
  <div flex flex-col>
    <div class="agent-header" h-80px flex items-center justify-between pl-37px pr-53px>
      <div flex items-center gap-8px>
        <img width="48" src="@/assets/img/logo-icon.png" alt="">
        <span text-20px text-tprimary>{{ $t('agents.doc_assistant.name') }}</span>
      </div>
      <div flex items-center gap-20px text-20px style="color: #4E5969;">
        <SvgoInfo cursor-pointer />
      </div>
    </div>
    <div min-h-0 flex flex-1 flex-col p-20px>
      <div class="flex self-end gap-12px">
        <el-button plain size="large" @click="openUploadDialog">
          <template #icon>
            <div class="i-carbon:upload" />
          </template>
          {{ $t('knowledge_base.index.upload') }}
        </el-button>
        <el-button type="primary" size="large" @click="openNewDocDialog">
          <template #icon>
            <div class="i-carbon:add-large" />
          </template>
          {{ $t('common.actions.create') }}
        </el-button>
      </div>
      <div mb-16px mt-34px text-16px text-tprimary font-bold>
        {{ $t('agents.doc.ai_documents') }}
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
      :hide-left-tabs="hideTemplateLibraryTabs"
    />
  </div>
</template>

<style lang="scss" scoped>
.agent-header {
  border-bottom: 1px solid var(--app-border-regular);
}
</style>
