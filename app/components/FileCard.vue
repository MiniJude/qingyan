<script setup lang="ts">
import type { FileInfo } from '~/types/file'
import { FileType } from '~/types/file'

// 组件属性
interface Props {
  file: FileInfo
  removable?: boolean
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  removable: false,
  clickable: false,
})

// 事件
const emit = defineEmits<{
  (e: 'remove', fileId: string): void
  (e: 'click', file: FileInfo): void
}>()

// 获取文件图标
function getFileIcon(type: FileType) {
  switch (type) {
    case FileType.Document:
      return 'i-carbon:document'
    case FileType.Pdf:
      return 'i-carbon:document-pdf'
    case FileType.Image:
      return 'i-carbon:image'
    case FileType.Presentation:
      return 'i-carbon:presentation-file'
    default:
      return 'i-carbon:document-unknown'
  }
}

// 获取文件类型显示文本
function getFileTypeText(type: FileType) {
  switch (type) {
    case FileType.Document:
      return '文档'
    case FileType.Pdf:
      return '文件'
    case FileType.Image:
      return '图片'
    case FileType.Presentation:
      return '演示文档'
    default:
      return '文件'
  }
}

// 获取显示颜色
function getFileColorClass(type: FileType) {
  switch (type) {
    case FileType.Document:
      return 'bg-pink-500'
    case FileType.Pdf:
      return 'bg-blue-500'
    case FileType.Image:
      return 'bg-amber-400'
    case FileType.Presentation:
      return 'bg-green-500'
    default:
      return 'bg-gray-500'
  }
}

// 移除文件处理
function handleRemove(event: Event) {
  event.stopPropagation()
  emit('remove', props.file.id)
}

// 点击文件处理
function handleClick() {
  if (props.clickable) {
    emit('click', props.file)
  }
}
</script>

<template>
  <div
    class="file-card"
    :class="{ clickable }"
    @click="handleClick"
  >
    <div class="file-icon" :class="getFileColorClass(file.type)">
      <div :class="getFileIcon(file.type)" class="icon" />
    </div>
    <div class="file-info">
      <div class="file-name">
        {{ file.name }}
      </div>
      <div class="file-type">
        {{ getFileTypeText(file.type) }}
      </div>
    </div>
    <div v-if="removable" class="file-close" @click="handleRemove">
      <div class="i-carbon:close-filled" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.file-card {
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin: 4px 0;
  max-width: 300px;

  &.clickable {
    cursor: pointer;

    &:hover {
      background-color: #f7f7f7;
    }
  }

  .file-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;

    .icon {
      color: white;
      width: 24px;
      height: 24px;
    }
  }

  .file-info {
    flex: 1;
    min-width: 0;

    .file-name {
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: var(--app-text-primary);
    }

    .file-type {
      font-size: 12px;
      color: var(--app-text-regular);
    }
  }

  .file-close {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin-left: 8px;
    color: #909399;

    &:hover {
      color: #f56c6c;
    }
  }
}

:deep(.dark) {
  .file-card {
    background-color: var(--app-bg-dark);

    &.clickable:hover {
      background-color: #333;
    }
  }
}
</style>
