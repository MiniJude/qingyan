<script lang="ts" setup>
import { ArrowDown } from '@element-plus/icons-vue'

const { t } = useI18n()

const dataSourceOptions = [
  { label: t('agents.form.data_source_options.current_space'), value: 0 },
  { label: t('agents.form.data_source_options.llm_native'), value: 1 },
]
const dataSourceType = ref(1)
const dataSourceLabel = computed(() => {
  return dataSourceOptions.find(i => i.value === dataSourceType.value)?.label ?? 'unknown source'
})
</script>

<template>
  <div class="h-full w-full flex flex-col">
    <div class="agent-header" h-80px flex items-center justify-between pl-37px pr-53px>
      <div class="flex items-center">
        <div class="flex items-center gap-8px">
          <img width="48" src="@/assets/img/logo-icon.png" alt="">
          <span class="text-20px text-tprimary">{{ $t('agents.kb_qa_assistant.name') }}</span>
        </div>
        <div class="text-14px text-tprimary">
          （{{ dataSourceLabel }}）
        </div>
      </div>
      <!-- <div class="flex items-center gap-20px text-20px" style="color: #4E5969;">
        <SvgoNotice class="cursor-pointer" />
        <SvgoClear class="cursor-pointer" />
        <SvgoInfo class="cursor-pointer" />
      </div> -->
    </div>

    <div class="agent-content min-h-0 flex flex-1 flex-col">
      <div class="date-display my-4 flex items-center justify-center gap-17px text-14px" style="color: #86909C;">
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
