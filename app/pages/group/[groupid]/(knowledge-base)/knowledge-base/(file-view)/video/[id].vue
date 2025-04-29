<script setup lang="ts">
import FileHeader from '../../components/FileHeader.vue'
// 获取当前路由参数
const route = useRoute()
const fileId = (route.params as any).id
const videoUrl = ref('')

async function getVideoUrl() {
  const fileObj = await $api<FileTreeType>(`/mock-api/knowledge-base/${fileId}`)
  if (fileObj && fileObj.fileUrl) {
    videoUrl.value = fileObj.fileUrl
  }
}

getVideoUrl()
</script>

<template>
  <div p="t-29px r-53px b-27px l-19px" h-full flex flex-col gap-16px>
    <!-- 顶部区域 -->
    <FileHeader />

    <!-- 内容区域 -->
    <div min-h-0 flex flex-1 flex-gap-67px pl-81px>
      <!-- 左侧内容区域 -->
      <div h-full min-w-895px flex flex-1 flex-col items-center justify-center overflow-y-auto>
        <div class="video-container">
          <video class="video-player" :src="videoUrl" controls />
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

.video-container {
  width: 80%;
  max-width: 1200px;
  aspect-ratio: 16/9;
  position: relative;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.video-player {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
