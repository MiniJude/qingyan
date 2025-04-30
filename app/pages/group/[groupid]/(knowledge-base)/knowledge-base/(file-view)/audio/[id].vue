<script setup lang="ts">
import FileHeader from '../../components/FileHeader.vue'
// 获取当前路由参数
const route = useRoute()
const fileId = (route.params as any).id
const fileUrl = ref('')

async function getVideoUrl() {
  const fileObj = await $api<FileTreeType>(`/mock-api/knowledge-base/${fileId}`)
  if (fileObj && fileObj.fileUrl) {
    fileUrl.value = fileObj.fileUrl
  }
}

getVideoUrl()
</script>

<template>
  <div p="t-29px r-53px b-27px l-19px" h-full flex flex-col gap-16px>
    <!-- 顶部区域 -->
    <FileHeader />

    <!-- 内容区域 -->
    <div min-h-0 flex flex-1 flex-gap-67px>
      <!-- 左侧内容区域 -->
      <div h-full w-full flex flex-1 flex-col items-center justify-center overflow-y-auto>
        <audio :src="fileUrl" controls />
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
</style>
