<script setup lang="ts">
import CircleDoc from '@/assets/svg/circle-doc.svg?skipsvgo'
import DocTree from './docTree/index.vue'
</script>

<template>
  <div class="doc-side-bar" p="t-28px r-16px b-18px l-16px" bg-white h-full w-263px flex="~ col">
    <el-button type="primary" class="mb-24px w-full !text-18px !px-9px !h-44px !justify-start">
      <template #icon>
        <CircleDoc />
      </template>
      <span text-16px ml-8px>全部文档</span>
    </el-button>

    <div flex="~ col 1">
      <div>
        <DocTree />
      </div>
      <div mt-40px flex gap-10px items-center>
        <SvgoTrash />
        <span text-tprimary>回收站</span>
      </div>
    </div>

    <div class="btn-group" mt-16px flex justify-between>
      <el-button plain>
        创建副本
      </el-button>
      <el-button plain>
        移动到
      </el-button>
      <el-button plain>
        删除
      </el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.doc-side-bar {
  border-right: 1px solid var(--el-border-color);
  .btn-group {
    .el-button {
      margin: 0;
    }
  }
}
</style>
