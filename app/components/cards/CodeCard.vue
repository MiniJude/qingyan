<script setup lang="ts">
defineProps<{
  data: any
}>()

// 日期格式化
function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}
</script>

<template>
  <div class="code-item">
    <img :src="`https://www.writebug.com/${data.image}`" alt="" class="code-icon-img">
    <div class="code-content">
      <h3 class="code-title">
        {{ data.title }}
      </h3>
      <div>
        <p class="code-desc">
          {{ data.content }}
        </p>
        <div class="score-circle">
          {{ data.score }}
        </div>
      </div>
      <div class="code-meta">
        <div class="meta-left">
          <div class="meta-item like">
            <div class="heart-icon" />
            <span>{{ data.like }}</span>
          </div>
          <div class="group-tag">
            <span>{{ data.group }}</span>
          </div>
        </div>
        <div class="meta-right">
          <div class="meta-user">
            <img :src="`https://www.writebug.com/${data.avatar}`" class="user-avatar">
            <span>{{ data.username }}</span>
            <span class="date">{{ formatDate(data.create_datetime) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.code-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 8px;
  background-color: var(--app-board-bg-color);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.code-icon-img {
  height: 100px;
  width: 130px;
  border-radius: 18px 5px 18px 5px;
}

.code-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.code-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: calc(100% - 80px);
}

.code-desc {
  font-size: 14px;
  color: #606266;
  margin: 0 0 12px;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  width: calc(100% - 80px);
  -webkit-box-orient: vertical;
  flex: 1;
}

.code-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.meta-left {
  display: flex;
  align-items: center;
}

.meta-item {
  display: flex;
  align-items: center;

  .heart-icon {
    width: 14px;
    height: 14px;
    background-color: #909399;
    mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E")
      no-repeat center;
    -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E")
      no-repeat center;
    margin-right: 4px;
  }
}

.meta-right {
  display: flex;
  align-items: center;
}

.group-tag {
  display: flex;
  align-items: center;
  background-color: rgba(103, 194, 58, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 10px;
  color: #67c23a;
  font-size: 12px;

  .group-icon {
    width: 14px;
    height: 14px;
    margin-right: 4px;
  }
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

.score-circle {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: rgba(64, 158, 255, 0.2);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: bold;
}
</style>
