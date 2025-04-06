<script setup lang="ts">
import { Download, Star } from '@element-plus/icons-vue'

defineProps<{
  data: any
}>()

// 日期格式化
function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

// 获取文件图标
function getFileIcon(fileType: string): string {
  switch (fileType) {
    case 'image':
      return 'i-carbon:image'
    case 'pdf':
      return 'i-carbon:document-pdf'
    case 'doc':
    case 'docx':
      return 'i-carbon:document'
    case 'xls':
    case 'xlsx':
      return 'i-carbon:spreadsheet'
    case 'ppt':
    case 'pptx':
      return 'i-carbon:presentation-file'
    default:
      return 'i-carbon:document'
  }
}
</script>

<template>
  <NuxtLink :to="data.preview_url" class="document-item">
    <div class="document-icon">
      <div :class="getFileIcon(data.file_type)" />
    </div>
    <div class="document-content">
      <h3 class="document-title">
        {{ data.title }}
      </h3>
      <p v-if="data.file_content" class="document-desc">
        {{ processContent(data.file_content) }}
      </p>
      <div class="document-meta">
        <div class="meta-left">
          <div class="meta-item favor">
            <el-icon class="meta-icon">
              <Star />
            </el-icon>
            <span>{{ data.favor }}</span>
          </div>
          <div class="meta-item download">
            <el-icon class="meta-icon">
              <Download />
            </el-icon>
            <span>{{ data.download }}</span>
          </div>
          <div class="group-tag">
            <span>{{ data.group }}</span>
          </div>
        </div>
        <div class="meta-user">
          <img
            :src="`https://www.writebug.com/${data.avatar}`"
            class="user-avatar"
            loading="lazy"
            alt=""
          >
          <span>{{ data.username }}</span>
          <span class="date">{{ formatDate(data.create_datetime) }}</span>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<style lang="scss" scoped>
.document-item {
  display: flex;
  padding: 16px;
  border-radius: 8px;
  background-color: var(--app-board-bg-color);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  gap: 16px;
  text-decoration: none;
  color: inherit;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.document-icon {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(64, 158, 255, 0.1);
  flex-shrink: 0;
  color: #409eff;
  font-size: 28px;
}

.document-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.document-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.document-desc {
  font-size: 14px;
  color: #606266;
  margin: 0 0 8px;
  line-height: 1.5;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.document-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  margin-top: auto;
}

.meta-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
}

.meta-icon {
  font-size: 14px;
  color: #909399;
  margin-right: 4px;
}

.group-tag {
  display: flex;
  align-items: center;
  background-color: rgba(103, 194, 58, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  color: #67c23a;
  font-size: 12px;
}

.meta-user {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #909399;

  .user-avatar {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin-right: 6px;
    object-fit: cover;
  }

  .date {
    margin-left: 8px;
  }
}
</style>
