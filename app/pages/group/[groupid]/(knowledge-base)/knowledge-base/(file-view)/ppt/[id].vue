<script setup lang="ts">
import { init as initPpt } from 'pptx-preview'
import AIAssistant from '~/components/chat-bot/AIAssistant.vue'
import FileHeader from '../../components/FileHeader.vue'

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

// 调用库的init方法生成一个预览器
let pptxPreviewer: any

async function loadContent(url: string) {
  loading.value = true
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP错误 ${response.status}`)
    }
    const res = await response.arrayBuffer()
    // 调用预览器的preview方法
    pptxPreviewer.preview(res)
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
  const pptxWrapperWidth = document.getElementById('pptx-wrapper')!.offsetWidth
  const pptxWrapperHeight = document.getElementById('pptx-wrapper')!.offsetHeight

  pptxPreviewer = initPpt(document.getElementById('pptx-wrapper')!, {
    width: pptxWrapperWidth,
    height: pptxWrapperHeight,
  })

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
      <div h-full min-w-895px flex-1>
        <div id="pptx-wrapper" class="h-full w-full" />
      </div>
    </div>

    <!-- AI助手组件 -->
    <AIAssistant />
  </div>
</template>
