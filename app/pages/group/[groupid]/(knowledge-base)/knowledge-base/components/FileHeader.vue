<template>
  <div flex items-center justify-between lt-md:flex-col lt-md:items-start lt-md:gap-12px>
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
</style>
