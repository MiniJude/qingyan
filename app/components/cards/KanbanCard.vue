<script setup lang="ts">
import { Calendar } from '@element-plus/icons-vue'
import { processContent } from '~/utils'

defineProps<{
  data: any
}>()

// 日期格式化
function formatDate(dateStr: string): string {
  if (!dateStr)
    return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

// 获取头像URL
function getAvatarUrl(avatar: string): string {
  if (!avatar)
    return '/static/images/default-avatar.png'
  return avatar.startsWith('http') ? avatar : `https://www.writebug.com${avatar}`
}

// 是否已经结束
function isCompleted(endDateStr: string): boolean {
  if (!endDateStr)
    return false
  const endDate = new Date(endDateStr)
  const now = new Date()
  return now > endDate
}
</script>

<template>
  <NuxtLink :to="data.preview_url" class="kanban-item">
    <!-- 卡片顶部图片区域 -->
    <div class="kanban-header" :class="{ 'has-image': data.image }">
      <div v-if="data.image" class="kanban-image">
        <img :src="`https://www.writebug.com${data.image}`" alt="" class="cover-image">
      </div>
      <div class="kanban-header-content">
        <h3 class="kanban-title">
          {{ data.title }}
        </h3>

        <div class="kanban-dates">
          <div class="date-item">
            <span class="date-label">开始日期：</span>
            <span class="date-value">{{ formatDate(data.begin_datetime) }}</span>
          </div>
          <div class="date-item">
            <span class="date-label">截止日期：</span>
            <span class="date-value">{{ formatDate(data.end_datetime) }}</span>
          </div>
          <div class="date-item">
            <span class="date-label">创建者：</span>
            <span class="date-value">{{ data.username }}</span>
          </div>
        </div>

        <div v-if="data.group" class="tag-container">
          <span class="group-tag">{{ data.group }}</span>
        </div>
      </div>
    </div>

    <!-- 卡片底部区域 -->
    <div class="kanban-footer">
      <h3 class="kanban-title-small">
        {{ data.title }}
      </h3>

      <div class="date-range">
        <span>{{ formatDate(data.begin_datetime) }}</span>
        <span class="date-separator" />
        <span>{{ formatDate(data.end_datetime) }}</span>
      </div>

      <div class="kanban-meta">
        <div class="user-avatar">
          <img :src="getAvatarUrl(data.avatar)" alt="用户头像">
        </div>

        <div class="status-tag" :class="{ completed: isCompleted(data.end_datetime) }">
          {{ isCompleted(data.end_datetime) ? '已结束' : '进行中' }}
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<style lang="scss" scoped>
.kanban-item {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  background-color: var(--app-board-bg-color);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  height: 100%;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.kanban-header {
  background-color: #2e3047;
  color: white;
  padding: 16px;
  position: relative;

  &.has-image {
    padding: 0;

    .kanban-header-content {
      padding: 16px;
      background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.7));
      position: relative;
      z-index: 1;
    }
  }
}

.kanban-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;

  .cover-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.kanban-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 12px;
  color: white;
}

.kanban-dates {
  margin-bottom: 12px;
  font-size: 14px;

  .date-item {
    margin-bottom: 4px;

    .date-label {
      opacity: 0.8;
    }

    .date-value {
      font-weight: 500;
    }
  }
}

.tag-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.group-tag {
  display: inline-block;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.kanban-footer {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.kanban-title-small {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.date-range {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  color: #606266;
  font-size: 14px;

  .date-separator {
    flex: 1;
    height: 1px;
    background-color: #e0e0e0;
    margin: 0 8px;
    min-width: 20px;
  }
}

.kanban-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.status-tag {
  background-color: rgba(64, 158, 255, 0.1);
  color: #409eff;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;

  &.completed {
    background-color: rgba(144, 147, 153, 0.1);
    color: #909399;
  }
}
</style>
