<script setup lang="ts">
const activeIndex = ref(0)
</script>

<template>
  <div p="t-29px r-53px b-27px l-19px" h-full flex flex-col gap-58px>
    <!-- 顶部区域 -->
    <div flex items-center justify-between>
      <div flex flex-col gap-4px>
        <FileBreadCrumb />
        <span class="last-modify-time">{{ $t('knowledge_base.doc_view.last_modified', { date: '2025年1月1日' }) }}</span>
      </div>
      <div class="btn-group" flex gap-12px>
        <el-button plain size="large">
          <template #icon>
            <SvgoEdit />
          </template>
          {{ $t('knowledge_base.doc_view.edit') }}
        </el-button>
        <el-button plain size="large">
          <template #icon>
            <SvgoDownload />
          </template>
          {{ $t('knowledge_base.doc_view.download') }}
        </el-button>

        <el-dropdown>
          <el-button type="primary" size="large">
            {{ $t('knowledge_base.doc_view.share') }}
            <div ml-8px h-16px w-16px flex-center>
              <SvgoArrowBottomFilled text-6px />
            </div>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>{{ $t('knowledge_base.doc_view.copy_link') }}</el-dropdown-item>
              <el-dropdown-item>{{ $t('knowledge_base.doc_view.generate_qrcode') }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 内容区域 -->
    <div min-h-0 flex flex-1 flex-gap-67px pl-81px>
      <!-- 左侧内容区域 -->
      <div h-full min-w-895px flex-1 overflow-y-auto>
        <div v-for="i in 100" :key="i">
          {{ $t('knowledge_base.doc_view.content_placeholder') }}
        </div>
      </div>

      <!-- 右侧批注区域 -->
      <div h-full w-331px flex flex-col gap-24px overflow-y-auto>
        <el-button type="primary" size="large" class="w-145px !rounded-lb-50px !rounded-lt-50px !rounded-rb-0 !rounded-rt-0" self-end>
          <SvgoAi class="text-24px" />
          <span ml-22px>{{ $t('knowledge_base.doc_view.document_assistant') }}</span>
        </el-button>
        <JSwitch v-model:active-index="activeIndex" :columns="[{ label: $t('knowledge_base.doc_view.content_outline') }, { label: $t('knowledge_base.doc_view.notes') }]" h-36px :item-width="83" />
        <div class="note-container bg-[#edeff3] dark:bg-black">
          <span v-if="activeIndex === 0">{{ $t('knowledge_base.doc_view.outline_placeholder') }}</span>
          <span v-else>{{ $t('knowledge_base.doc_view.notes_placeholder') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.last-modify-time {
  color: var(--el-text-color-disabled);
}

.btn-group {
  .el-button {
    margin-left: 0;
  }
}

.note-container {
  height: 459px;
  border-radius: 10px;
  padding: 16px;
  font-size: 14px;
}
</style>
