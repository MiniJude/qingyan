<script setup lang="ts">
</script>

<template>
  <div flex flex-col>
    <div class="agent-header" pl-37px pr-53px flex h-80px items-center justify-between>
      <div flex gap-8px items-center>
        <img width="48" src="@/assets/img/logo-icon.png" alt="">
        <span text-20px text-tprimary>AI文档助手</span>
      </div>
      <div text-20px flex gap-20px items-center style="color: #4E5969;">
        <SvgoInfo cursor-pointer />
      </div>
    </div>
    <div p-20px flex flex-1 flex-col min-h-0>
      <el-dropdown class="self-end">
        <el-button type="primary" size="large">
          新建AI文档
          <div ml-8px flex-center h-16px w-16px>
            <SvgoArrowBottomFilled text-6px />
          </div>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>ppt</el-dropdown-item>
            <el-dropdown-item>word</el-dropdown-item>
            <el-dropdown-item>excel</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <div text-16px text-tprimary font-bold mb-16px mt-34px>
        AI文档
      </div>
      <JSwitch h-36px :columns="[{ label: '我个人的' }, { label: '邀请协作的' }]" :item-width="83" />
      <FolderTable class="mt-16px flex-1 min-h-0" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.agent-header {
  border-bottom: 1px solid var(--el-border-color);
}
</style>
