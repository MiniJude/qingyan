<script setup lang="ts">
import AIAssistant from '~/components/chat-bot/AIAssistant.vue'
import FileHeader from '../../components/FileHeader.vue'

// 获取当前路由参数
const route = useRoute()
const fileId = (route.params as any).id

// 文本内容和文件URL
const fileUrl = ref('')
const error = ref(false)

async function getFileUrl() {
  try {
    const file = await $api<FileTreeType>(`/mock-api/knowledge-base/${fileId}`)
    if (file && file.fileUrl) {
      fileUrl.value = file.fileUrl
    }
    else {
      error.value = true
    }
  }
  catch (e) {
    console.error('获取文件信息失败', e)
    error.value = true
  }
}

onMounted(() => {
  getFileUrl()
})
</script>

<template>
  <div p="t-29px r-53px b-27px l-19px" relative h-full flex flex-col gap-16px overflow-hidden>
    <!-- 顶部区域 -->
    <FileHeader />

    <!-- 内容区域 -->
    <div min-h-0 flex flex-1 flex-gap-67px>
      <!-- 左侧内容区域 -->
      <div h-full flex-1>
        <iframe v-if="fileUrl" :src="fileUrl" class="h-full w-full" />
      </div>
    </div>

    <!-- AI助手组件 -->
    <AIAssistant />
  </div>
</template>
