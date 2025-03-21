<script lang="ts" setup>
const searchValue = ref('')
</script>

<template>
  <div class="header" p="l-24px r-53px" flex h-64px items-center justify-between>
    <div flex items-center>
      <div i-carbon:ai-label text-primary h-30px w-30px />
      <span ml-8px>AI 助手</span>
    </div>
    <el-input v-model="searchValue" class="search-input ml-auto mr-100px h-36px !rounded-50px !w-260px">
      <template #prefix>
        <SvgoSearch text="20px primary" />
      </template>
    </el-input>
    <div flex gap-12px items-center>
      <SvgoNotice class="icon-notice" text="24px" cursor-pointer />
      <img src="@/assets/img/avatar.png" alt="avatar" rounded-full h-36px w-36px cursor-pointer>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  border-bottom: 1px solid var(--el-border-color);

  :deep(.search-input) {
    .el-input__wrapper {
      border-radius: 20px;
    }
  }

  .icon-notice {
    color: #4e5969;
  }
}
</style>
