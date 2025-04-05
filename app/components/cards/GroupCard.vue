<script setup lang="ts">
defineProps<{
  data: any
}>()
</script>

<template>
  <div class="group-item">
    <div class="group-content">
      <h3 class="group-title">
        {{ data.title }}
      </h3>
      <p class="group-desc">
        {{ data.content }}
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.group-item {
  display: flex;
  padding: 16px;
  border-radius: 8px;
  background-color: var(--el-bg-color-overlay);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.1);
  }
}

.group-content {
  flex: 1;
}

.group-title {
  margin: 0 0 10px;
  font-size: 18px;
  color: var(--el-color-primary);
}

.group-desc {
  margin: 0 0 16px;
  color: var(--el-text-color-primary);
  line-height: 1.6;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
