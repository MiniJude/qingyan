<script setup lang="ts">
import FileHeader from '../../components/FileHeader.vue'

// 获取当前路由参数
const route = useRoute()
const fileId = (route.params as any).id

// 图片文件URL
const imageUrl = ref('')

async function getImageUrl() {
  const file = await $api<FileTreeType>(`/mock-api/knowledge-base/${fileId}`)
  if (file && file.fileUrl) {
    imageUrl.value = file.fileUrl
  }
}

onMounted(() => {
  getImageUrl()
})
</script>

<template>
  <div p="t-29px r-53px b-27px l-19px" relative h-full flex flex-col gap-16px>
    <!-- 顶部区域 -->
    <FileHeader />

    <!-- 内容区域 -->
    <div min-h-0 flex flex-1 flex-gap-67px pl-81px>
      <!-- 左侧内容区域 -->
      <div h-full min-w-895px flex flex-1 flex-col items-center justify-center overflow-y-auto>
        <div v-if="imageUrl" class="image-container">
          <!-- 图片预览区 -->
          <img :src="imageUrl" class="preview-image">
        </div>
        <div v-else class="flex flex-col items-center justify-center">
          <el-empty description="未找到图片或正在加载中" />
        </div>
      </div>
    </div>

    <!-- AI助手组件 -->
    <AIAssistant />
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

.image-container {
  max-width: 90%;
  max-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>
