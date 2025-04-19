<script setup lang="ts">
import { CopyDocument, Discount, Promotion } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getCurrentInstance } from 'vue'

const props = withDefaults(defineProps<Props>(), {
  message: '',
  messageId: '',
  liked: false,
  disliked: false,
})

const emit = defineEmits<{
  (e: 'like', messageId: string): void
  (e: 'dislike', messageId: string): void
  (e: 'copy', message: string): void
}>()

const { appContext } = getCurrentInstance()!

interface Props {
  message?: string
  messageId?: string
  liked?: boolean
  disliked?: boolean
}

function handleLike() {
  emit('like', props.messageId)
}

function handleDislike() {
  emit('dislike', props.messageId)
}

function copyMessage() {
  if (!props.message) {
    ElMessage.warning({ message: '没有可复制的内容', appContext })
    return
  }

  navigator.clipboard.writeText(props.message)
    .then(() => {
      ElMessage.success({ message: '内容已复制到剪贴板', appContext })
      emit('copy', props.message)
    })
    .catch(() => {
      ElMessage.error({ message: '复制失败，请手动选择并复制', appContext })
    })
}
</script>

<template>
  <div class="message-actions">
    <div class="action-btn" @click="handleLike">
      <div class="i-carbon:thumbs-up" text-12px />
    </div>
    <div class="action-btn" @click="handleDislike">
      <div class="i-carbon:thumbs-down" text-12px />
    </div>
    <div class="action-btn copy-btn" @click="copyMessage">
      <div class="i-carbon:copy" text-12px />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.message-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 2px;
  margin-top: 8px;
  padding: 4px 0;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  color: #86909c;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: var(--el-color-primary);
  }

  .dark & {
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
}

.copy-btn {
  padding: 6px 10px;
}
</style>
