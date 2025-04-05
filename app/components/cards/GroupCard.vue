<script setup lang="ts">
defineProps<{
  data: any
}>()
</script>

<template>
  <div class="group-item">
    <div class="image-wrapper">
      <img :src="`https://www.writebug.com/${data.logo}`" class="group-image" alt="">
    </div>
    <div class="group-content">
      <div class="group-header">
        <div class="group-icon">
          <div class="i-carbon:box" />
        </div>
        <h3 class="group-title">
          {{ data.title }}
        </h3>
      </div>
      <p class="group-desc">
        {{ data.content }}
      </p>
      <div class="group-footer">
        <div class="member-info">
          <div class="i-carbon:user-multiple" />
          <span>{{ data.members }}位成员</span>
        </div>
        <div class="avatar-list">
          <div
            v-for="(user, index) in data.userList?.slice(0, 3)"
            :key="user.user_key_id"
            class="avatar-item"
            :style="{ zIndex: data.userList.length - index }"
          >
            <img
              :src="`https://www.writebug.com/${user.user_key__avatar}`"
              class="avatar-image"
              alt="用户头像"
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.group-item {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  background-color: var(--el-bg-color-overlay, #f5f7fa);
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  height: 250px; /* 固定高度 */

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    .group-image {
      transform: scale(1.05);
    }
  }
}

.image-wrapper {
  width: 100%;
  height: 125px;
  flex-shrink: 0;
  overflow: hidden;

  .group-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
}

.group-content {
  padding: 12px 16px;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.group-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.group-icon {
  width: 24px;
  height: 24px;
  background-color: #67c23a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  color: white;
  flex-shrink: 0;
  font-size: 14px;
}

.group-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.group-desc {
  margin: 0 0 12px;
  color: #606266;
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-line;
  min-height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.group-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  flex-shrink: 0;
}

.member-info {
  display: flex;
  align-items: center;
  color: #909399;
  font-size: 13px;
  gap: 4px;
}

.avatar-list {
  display: flex;
  align-items: center;
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
</style>
