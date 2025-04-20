<script lang="ts" setup>
import { ArrowDown } from '@element-plus/icons-vue'
</script>

<template>
  <div class="h-full w-full flex flex-col">
    <div class="agent-header" h-80px flex items-center justify-between pl-37px pr-53px>
      <div class="flex items-center gap-8px">
        <img width="48" src="@/assets/img/logo-icon.png" alt="">
        <span class="text-20px text-tprimary">{{ $t('agents.kb_qa_assistant.name') }}</span>
      </div>
      <!-- <div class="flex items-center gap-20px text-20px" style="color: #4E5969;">
        <SvgoNotice class="cursor-pointer" />
        <SvgoClear class="cursor-pointer" />
        <SvgoInfo class="cursor-pointer" />
      </div> -->
    </div>

    <div class="agent-content min-h-0 flex flex-1 flex-col">
      <div class="date-display mb-4 mt-43px flex items-center justify-center gap-17px text-14px" style="color: #86909C;">
        <span>{{ $t('agents.qa.date') }}</span>
        <el-icon class="cursor-pointer">
          <ArrowDown />
        </el-icon>
      </div>

      <!-- 内容容器 -->
      <ChatBot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.agent-header {
  border-bottom: 1px solid var(--app-border-regular);
}
</style>
