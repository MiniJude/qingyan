<script setup lang="ts">
import * as docx from 'docx-preview'
import AIAssistant from '~/components/chat-bot/AIAssistant.vue'
import FileHeader from '../../components/FileHeader.vue'

const activeIndex = ref(0)

// 获取当前路由参数
const route = useRoute()
const fileId = (route.params as any).id

// 文本内容和文件URL
const fileUrl = ref('')
const loading = ref(false)
const error = ref(false)

async function getFileUrl() {
  try {
    const file = await $api<FileTreeType>(`/mock-api/knowledge-base/${fileId}`)
    if (file && file.fileUrl) {
      fileUrl.value = file.fileUrl
      await loadContent(file.fileUrl)
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

async function loadContent(url: string) {
  loading.value = true
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP错误 ${response.status}`)
    }
    const res = await response.arrayBuffer()
    docx.renderAsync(res, document.getElementById('container')!)
  }
  catch (e) {
    console.error('加载文本内容失败', e)
    error.value = true
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  getFileUrl()
})
</script>

<template>
  <div p="t-29px r-53px b-27px l-19px" relative h-full flex flex-col gap-16px>
    <!-- 顶部区域 -->
    <FileHeader />

    <!-- 内容区域 -->
    <div min-h-0 flex flex-1 flex-gap-67px pl-81px>
      <!-- 左侧内容区域 -->
      <div h-full min-w-895px flex-1 overflow-y-auto>
        <div id="container" />
      </div>

      <!-- 使用封装的批注组件 -->
      <DocumentAnnotation
        v-model:active-index="activeIndex"
      />
    </div>

    <!-- AI助手组件 -->
    <AIAssistant />
  </div>
</template>
