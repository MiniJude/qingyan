<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'

const fileRoute = useFileStore().fileRoute
</script>

<template>
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item v-for="route in fileRoute" :key="route">
      {{ route }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style lang="scss" scoped>
// 最后一个加粗
.el-breadcrumb {
  :deep(.el-breadcrumb__item) {
    .el-breadcrumb__inner,
    .el-breadcrumb__separator {
      color: var(--el-text-color-disabled);
      font-size: 16px;
    }
    &:last-child {
      .el-breadcrumb__inner {
        color: var(--el-text-color-primary);
      }
    }
  }
}
</style>
