<script setup lang="ts">
const activeIndex = ref(0)
</script>

<template>
  <div p="t-29px r-53px b-27px l-19px" flex flex-col gap-58px h-full>
    <!-- 顶部区域 -->
    <div flex items-center justify-between>
      <div flex flex-col gap-4px>
        <FileBreadCrumb />
        <span class="last-modify-time">最近修改：2025年1月1日</span>
      </div>
      <div class="btn-group" flex gap-12px>
        <el-button plain size="large">
          <template #icon>
            <SvgoEdit />
          </template>
          编辑
        </el-button>
        <el-button plain size="large">
          <template #icon>
            <SvgoDownload />
          </template>
          下载
        </el-button>

        <el-dropdown>
          <el-button type="primary" size="large">
            分享
            <div ml-8px flex-center h-16px w-16px>
              <SvgoArrowBottomFilled text-6px />
            </div>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>复制链接</el-dropdown-item>
              <el-dropdown-item>生成二维码</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 内容区域 -->
    <div pl-81px flex flex-1 flex-gap-67px min-h-0>
      <!-- 左侧内容区域 -->
      <div flex-1 h-full min-w-895px overflow-y-auto>
        <div v-for="i in 100" :key="i">
          这是正文
        </div>
      </div>

      <!-- 右侧批注区域 -->
      <div flex flex-col gap-24px h-full w-331px overflow-y-auto>
        <el-button type="primary" size="large" class="w-145px !rounded-lb-50px !rounded-lt-50px !rounded-rb-0 !rounded-rt-0" self-end>
          <SvgoAi class="text-24px" />
          <span ml-22px>文档助手</span>
        </el-button>
        <JSwitch v-model:active-index="activeIndex" :columns="[{ label: '内容大纲' }, { label: '批注笔记' }]" h-36px :item-width="83" />
        <div class="note-container bg-[#edeff3] dark:bg-black">
          <span v-if="activeIndex === 0">这是内容大纲</span>
          <span v-else>这是批注笔记</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.last-modify-time {
  color: var(--el-text-color-disabled);
}

.btn-group {
  .el-button {
    margin-left: 0;
  }
}

.note-container {
  height: 459px;
  border-radius: 10px;
  padding: 16px;
  font-size: 14px;
}
</style>
