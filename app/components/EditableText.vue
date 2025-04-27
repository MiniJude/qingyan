<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  modelValue: string
  placeholder?: string
  disabled?: boolean
  itemType?: 'file' | 'folder' | 'title'
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  disabled: false,
  itemType: 'title',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const isEditing = ref(false)
const tempValue = ref(props.modelValue)
const editRef = ref<HTMLInputElement | null>(null)
const confirmDialogVisible = ref(false)
const { appContext } = getCurrentInstance()!
const { t } = useI18n()

// 监听modelValue变化
watch(() => props.modelValue, (newVal) => {
  if (!isEditing.value)
    tempValue.value = newVal
})

// 开始编辑
function startEditing() {
  if (props.disabled)
    return

  isEditing.value = true
  tempValue.value = props.modelValue
  // 等待DOM更新后聚焦并选中全部文本
  nextTick(() => {
    if (editRef.value) {
      editRef.value.focus()
      editRef.value.select()
    }
  })
}

// 获取项目类型的国际化文本
function getItemTypeText() {
  switch (props.itemType) {
    case 'file':
      return t('knowledge_base.new_file')
    case 'folder':
      return t('knowledge_base.new_folder')
    default:
      return t('knowledge_base.title')
  }
}

// 确认修改
function confirmEdit() {
  confirmDialogVisible.value = false
  isEditing.value = false

  // 如果值有变化，触发更新
  if (tempValue.value !== props.modelValue) {
    emit('update:modelValue', tempValue.value)
  }
}

// 取消修改
function cancelEdit() {
  confirmDialogVisible.value = false
  isEditing.value = false
  tempValue.value = props.modelValue
}

// 显示确认对话框
function showConfirmDialog() {
  // 如果值没有变化，直接结束编辑
  if (tempValue.value === props.modelValue) {
    isEditing.value = false
    return
  }

  // 如果值为空，提示错误
  if (!tempValue.value.trim()) {
    ElMessage.warning({
      message: t('common.validation.required', { field: getItemTypeText() }),
      appContext,
    })
    return
  }

  confirmDialogVisible.value = true
}

// 处理按键事件
function handleKeyDown(e: Event) {
  const event = e as KeyboardEvent
  if (event.key === 'Enter') {
    event.preventDefault()
    showConfirmDialog()
  }
  else if (event.key === 'Escape') {
    event.preventDefault()
    cancelEdit()
  }
}

// 处理失焦事件
function handleBlur() {
  showConfirmDialog()
}
</script>

<template>
  <div class="editable-text-container">
    <!-- 显示模式 -->
    <div
      v-if="!isEditing"
      class="editable-text-display"
      :class="{ disabled }"
      @dblclick="startEditing"
    >
      <slot name="text">
        {{ modelValue }}
      </slot>
    </div>

    <!-- 编辑模式 -->
    <el-input
      v-else
      ref="editRef"
      v-model="tempValue"
      :placeholder="placeholder"
      size="small"
      @blur="handleBlur"
      @keydown="handleKeyDown"
    />

    <!-- 确认对话框 -->
    <el-dialog
      v-model="confirmDialogVisible"
      :title="$t('knowledge_base.rename_confirm.title')"
      width="30%"
      destroy-on-close
      append-to-body
    >
      <span>{{ $t('knowledge_base.rename_confirm.message') }}</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelEdit">
            {{ $t('knowledge_base.cancel') }}
          </el-button>
          <el-button type="primary" @click="confirmEdit">
            {{ $t('knowledge_base.confirm') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.editable-text-container {
  width: 100%;

  .editable-text-display {
    cursor: pointer;
    padding: 2px 4px;
    border-radius: 4px;
    min-height: 24px;
    word-break: break-all;

    &:hover {
      background-color: var(--el-fill-color-light);
    }

    &.disabled {
      cursor: default;

      &:hover {
        background-color: transparent;
      }
    }
  }
}
</style>
