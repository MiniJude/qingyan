<script setup lang="ts">
defineProps<{
  data: any
}>()

// 日期格式化
function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

// 处理内容，移除HTML标签和Markdown标记（优化版）
function processContent(content: string): string {
  if (!content)
    return ''

  // 一次性替换所有标记
  return content
    .replace(/<[^>]+>/g, '') // HTML标签
    .replace(/#{1,6}\s?|(\*\*|__)|(\*|_)|\n\s*>|\n\s*-\s|!\[.*?\]\(.*?\)|\[.*?\]\(.*?\)/g, '') // Markdown标记
    .trim()
}
</script>

<template>
  <NuxtLink :to="data.preview_url" class="article-item">
    <div class="article-image">
      <img
        :src="`https://www.writebug.com${data.image}`"
        :alt="data.title"
        loading="lazy"
      >
    </div>
    <div class="article-content">
      <h3 class="article-title">
        {{ data.title }}
      </h3>
      <p class="article-desc">
        {{ processContent(data.content) }}
      </p>
      <div class="article-meta">
        <div class="meta-left">
          <div class="meta-item like">
            <div class="heart-icon" />
            <span>{{ data.like }}</span>
          </div>
          <div class="group-tag">
            <span>{{ data.group }}</span>
          </div>
        </div>
        <div class="meta-user">
          <img
            :src="`https://www.writebug.com${data.avatar}`"
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
.article-item {
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

.article-image {
  width: 120px;
  height: 100px;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
  background-color: #f0f0f0; // 图片加载前的背景色

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }
  }
}

.article-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.article-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.article-desc {
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

.article-meta {
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

.heart-icon {
  width: 14px;
  height: 14px;
  background-color: #909399;
  margin-right: 4px;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E")
    no-repeat center;
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E")
    no-repeat center;
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
