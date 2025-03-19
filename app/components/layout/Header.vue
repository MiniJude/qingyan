<script lang="ts" setup>
</script>

<template>
  <div class="header" p="l-24px r-53px" flex h-64px items-center justify-between>
    <div flex items-center>
      <div i-carbon:ai-label text-primary h-30px w-30px />
      <span ml-8px>AI 助手</span>
    </div>
    <div flex gap-12px items-center>
      <SvgoNotice class="icon-notice" text="24px" />
      <img src="@/assets/img/avatar.png" alt="avatar" rounded-full h-36px w-36px>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  border-bottom: 1px solid var(--el-border-color);

  .icon-notice {
    color: #4e5969;
  }
}
</style>
