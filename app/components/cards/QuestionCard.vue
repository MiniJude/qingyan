<script setup lang="ts">
import { Comment, Star, View } from '@element-plus/icons-vue'
import { processContent } from '~/utils'

defineProps<{
  data: any
}>()

// 日期格式化
function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

// 获取头像URL
function getAvatarUrl(avatar: string): string {
  if (!avatar)
    return '/static/images/default-avatar.png'
  return `https://www.writebug.com${avatar}`
}
</script>

<template>
  <NuxtLink :to="data.preview_url" class="question-item">
    <div class="question-content">
      <h3 class="question-title">
        {{ data.title }}
      </h3>
      <p v-if="data.background" class="question-desc">
        {{ processContent(data.background) }}
      </p>
      <div class="question-meta">
        <div class="meta-left">
          <div v-if="data.like" class="meta-item like">
            <el-icon class="meta-icon">
              <Star />
            </el-icon>
            <span>{{ data.like }}</span>
          </div>
          <div class="meta-item answer">
            <el-icon class="meta-icon">
              <Comment />
            </el-icon>
            <span>{{ data.answer }}</span>
          </div>
          <div v-if="data.views" class="meta-item view">
            <el-icon class="meta-icon">
              <View />
            </el-icon>
            <span>{{ data.views }}</span>
          </div>
          <div class="group-tag">
            <span>{{ data.group }}</span>
          </div>
        </div>
        <div v-if="data.answerUserList && data.answerUserList.length > 0" class="avatar-list">
          <div
            v-for="(user, index) in data.answerUserList.slice(0, 3)"
            :key="user.user_key_id"
            class="avatar-item"
            :style="{ zIndex: data.answerUserList.length - index }"
          >
            <img
              :src="getAvatarUrl(user.user_key__avatar)"
              class="avatar-image"
              loading="lazy"
              alt="回答者头像"
            >
          </div>
        </div>
        <div class="date">
          {{ formatDate(data.create_datetime) }}
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<style lang="scss" scoped>
.question-item {
  display: flex;
  padding: 16px;
  border-radius: 8px;
  background-color: var(--app-board-bg-color);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  text-decoration: none;
  color: inherit;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.question-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.question-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.question-desc {
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

.question-meta {
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

.avatar-list {
  display: flex;
  align-items: center;
  margin-right: 0px;
  margin-left: auto;
}

.avatar-item {
  margin-left: -8px;
  width: 24px;
  height: 24px;
  overflow: hidden;
  border-radius: 50%;
  border: 2px solid #fff;

  &:first-child {
    margin-left: 0;
  }

  .avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.date {
  font-size: 12px;
  color: #909399;
  margin-left: 12px;
}
</style>
