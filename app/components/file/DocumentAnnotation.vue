<script setup lang="ts">
interface Props {
  /** 默认激活的标签页索引 */
  activeIndex?: number
  /** 自定义内容大纲 */
  outlineContent?: string
  /** 自定义笔记内容 */
  notesContent?: string
}

const props = withDefaults(defineProps<Props>(), {
  activeIndex: 0,
  outlineContent: '',
  notesContent: '',
})

const emit = defineEmits<{
  (e: 'update:activeIndex', value: number): void
  (e: 'aiAssist'): void
}>()

// 引入国际化
const { t } = useI18n()

// 激活的标签页
const localActiveIndex = computed({
  get: () => props.activeIndex,
  set: val => emit('update:activeIndex', val),
})

// 切换标签选项
const switchColumns = computed(() => [
  { label: t('knowledge_base.doc_view.content_outline') },
  { label: t('knowledge_base.doc_view.notes') },
])

// 处理AI助手按钮点击
function handleAiAssistClick() {
  emit('aiAssist')
}
</script>

<template>
  <div h-full w-331px flex flex-col gap-24px overflow-y-auto>
    <!-- AI助手按钮 -->
    <el-button
      type="primary"
      size="large"
      class="w-145px !rounded-lb-50px !rounded-lt-50px !rounded-rb-0 !rounded-rt-0"
      self-end
      @click="handleAiAssistClick"
    >
      <SvgoAi class="text-24px" />
      <span ml-22px>{{ t('knowledge_base.doc_view.document_assistant') }}</span>
    </el-button>

    <!-- 内容切换开关 -->
    <Switch
      v-model:active-index="localActiveIndex"
      :columns="switchColumns"
      h-36px
      :item-width="83"
    />

    <!-- 内容容器 -->
    <div class="note-container bg-board dark:bg-black">
      <slot v-if="localActiveIndex === 0" name="outline">
        <span>{{ outlineContent || t('knowledge_base.doc_view.outline_placeholder') }}</span>
      </slot>
      <slot v-else name="notes">
        <span>{{ notesContent || t('knowledge_base.doc_view.notes_placeholder') }}</span>
      </slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.note-container {
  flex: 1;
  padding: 16px;
  border-radius: 8px;
  overflow-y: auto;
}
</style>
