<script setup lang="ts">
import type { ElInput } from 'element-plus'
import type { FileInfo } from '~/types/file'

interface Props {
  placeholder?: string
  replyToMessage?: string
  attachedFiles: FileInfo[]
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请输入消息...',
  replyToMessage: '',
})

const emit = defineEmits<{
  (e: 'send', text: string): void
  (e: 'cancelReply'): void
  (e: 'openUpload'): void
  (e: 'removeFile', fileId: string): void
}>()

const inputText = ref('')
const inputRef = ref<InstanceType<typeof ElInput> | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)

// 处理发送消息
function handleSend() {
  if (inputText.value.trim() || props.attachedFiles.length > 0) {
    emit('send', inputText.value)
    inputText.value = ''
  }
}

// 移除已上传文件
function removeFile(fileId: string) {
  emit('removeFile', fileId)
}

// 设置输入框焦点
function setFocus() {
  nextTick(() => {
    inputRef.value?.$el.querySelector('input')?.focus()
  })
}

// 在组件加载后自动设置焦点
onMounted(() => {
  setFocus()
})

// 当回复状态改变时也设置焦点
onUpdated(() => {
  if (props.replyToMessage) {
    setFocus()
  }
})

defineExpose({
  focus: setFocus,
})
</script>

<template>
  <div class="input-container">
    <!-- 回复提示 -->
    <div v-if="replyToMessage" class="reply-indicator">
      <div class="reply-indicator-content">
        <span class="reply-to-label">回复消息:</span>
        <span class="reply-to-content">{{ replyToMessage }}</span>
      </div>
      <div class="reply-indicator-close" @click="$emit('cancelReply')">
        ×
      </div>
    </div>

    <!-- 显示已上传文件 -->
    <div v-if="attachedFiles.length > 0" class="attached-files mb-2">
      <FileCard
        v-for="file in attachedFiles"
        :key="file.id"
        :file="file"
        :removable="true"
        @remove="removeFile"
      />
    </div>

    <!-- 文本输入区域 -->
    <div ref="containerRef" class="input-area-wrapper h-48px">
      <div class="upload-btn-wrapper">
        <div class="upload-btn" @click="$emit('openUpload')">
          <div class="i-carbon:add" />
        </div>
      </div>
      <el-input
        ref="inputRef"
        v-model="inputText"
        class="h-full flex-1"
        :placeholder="replyToMessage ? '请输入回复内容...' : placeholder"
        @keyup.enter="handleSend"
      >
        <template #suffix>
          <div class="h-32px w-32px flex-center cursor-pointer rounded-full bg-primary">
            <div class="i-carbon:send-filled rotate--90 text-white" @click="handleSend" />
          </div>
        </template>
      </el-input>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.input-container {
  width: 100%;
}

.attached-files {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.input-area-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;
}

.upload-btn-wrapper {
  position: relative;
  margin-right: 10px;
}

.upload-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background-color: white;
  border-radius: 50%;
  border: 1px solid #dcdfe6;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: #f5f7fa;
    transform: scale(1.05);
  }

  .dark & {
    background-color: #141414;
    border-color: #4c4d4f;

    &:hover {
      background-color: #18181a;
    }
  }

  .i-carbon\\:add {
    font-size: 24px;
    color: var(--el-color-primary);
  }
}

.send-btn {
  width: 192px;
  height: 54px;
}

.reply-indicator {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 6px;
  padding: 8px 12px;
  margin-bottom: 8px;
  border-left: 3px solid var(--el-color-primary);

  .dark & {
    background-color: rgba(255, 255, 255, 0.05);
  }
}

.reply-indicator-content {
  flex: 1;
  overflow: hidden;
}

.reply-to-label {
  color: var(--el-color-primary);
  font-weight: 500;
  margin-right: 8px;
}

.reply-to-content {
  color: #86909c;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.reply-indicator-close {
  cursor: pointer;
  font-size: 16px;
  color: #86909c;
  margin-left: 8px;

  &:hover {
    color: var(--el-color-primary);
  }
}
</style>
