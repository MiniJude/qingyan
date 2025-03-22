<script setup lang="ts">
import Dashboard from './Dashboard.vue'
</script>

<template>
  <div>
    <div class="btn-group" mr-54px mt-28px flex gap-12px justify-end>
      <el-button plain size="large">
        <template #icon>
          <SvgoTxt />
        </template>
        模板库
      </el-button>
      <el-button plain size="large">
        <template #icon>
          <SvgoFolder2 />
        </template>
        自动分类
      </el-button>
      <el-dropdown>
        <el-button plain size="large">
          上传
          <div ml-8px flex-center h-16px w-16px>
            <SvgoArrowBottomFilled text-6px />
          </div>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>文档</el-dropdown-item>
            <el-dropdown-item>表格</el-dropdown-item>
            <el-dropdown-item>图片</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-dropdown>
        <el-button type="primary" size="large">
          新建
          <div ml-8px flex-center h-16px w-16px>
            <SvgoArrowBottomFilled text-6px />
          </div>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>文件夹</el-dropdown-item>
            <el-dropdown-item>文档</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <Dashboard />
  </div>
</template>

<style scoped lang="scss">
.btn-group {
  .el-button {
    margin-left: 0;
  }
}
</style>
