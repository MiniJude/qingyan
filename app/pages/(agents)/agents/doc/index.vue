<script setup lang="ts">
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
      <el-dropdown class="self-end">
        <el-button type="primary" size="large">
          {{ $t('agents.doc.create_new_doc') }}
          <div ml-8px h-16px w-16px flex-center>
            <SvgoArrowBottomFilled text-6px />
          </div>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>{{ $t('agents.doc.formats.ppt') }}</el-dropdown-item>
            <el-dropdown-item>{{ $t('agents.doc.formats.word') }}</el-dropdown-item>
            <el-dropdown-item>{{ $t('agents.doc.formats.excel') }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <div mb-16px mt-34px text-16px text-tprimary font-bold>
        {{ $t('agents.doc.ai_documents') }}
      </div>
      <Switch h-36px :columns="[{ label: $t('knowledge_base.index.my_personal') }, { label: $t('knowledge_base.index.shared_with_me') }]" :item-width="83" />
      <FolderTable class="mt-16px min-h-0 flex-1" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.agent-header {
  border-bottom: 1px solid var(--app-border-regular);
}
</style>
