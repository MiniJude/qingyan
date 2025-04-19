<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

// 获取当前路由参数
const route = useRoute()
const fileId = (route.params as any).id

// 文本内容和文件URL
const textContent = ref('')
const fileUrl = ref('')
const loading = ref(false)
const error = ref(false)

// 批注组件相关
const activeIndex = ref(0)

async function getTxtFileUrl() {
  try {
    const file = await $api<FileTreeType>(`/mock-api/knowledge-base/${fileId}`)
    if (file && file.fileUrl) {
      fileUrl.value = file.fileUrl
      await loadTextContent(file.fileUrl)
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

async function loadTextContent(url: string) {
  loading.value = true
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP错误 ${response.status}`)
    }
    textContent.value = await response.text()
  }
  catch (e) {
    console.error('加载文本内容失败', e)
    error.value = true
  }
  finally {
    loading.value = false
  }
}

// 处理AI助手点击
function handleAiAssist() {
  // 这里可以添加AI助手的逻辑
  // 实际实现中应替换为真实功能
}

onMounted(() => {
  getTxtFileUrl()
})
</script>

<template>
  <div p="t-29px r-53px b-27px l-19px" h-full flex flex-col gap-58px>
    <!-- 顶部区域 -->
    <div flex items-center justify-between>
      <div flex flex-col gap-4px>
        <FileBreadCrumb />
        <span class="last-modify-time">{{ $t('knowledge_base.doc_view.last_modified', { date: '2025年1月1日' }) }}</span>
      </div>
    </div>

    <!-- 内容区域 -->
    <div min-h-0 flex flex-1 flex-gap-67px pl-81px>
      <!-- 左侧内容区域 -->
      <div h-full min-w-895px flex-1 overflow-y-auto>
        <div v-if="loading" class="flex flex-col items-center justify-center">
          <el-skeleton :rows="15" style="width: 100%" animated />
        </div>
        <div v-else-if="error" class="flex flex-col items-center justify-center">
          <el-empty :description="$t('common.file_not_found')" />
        </div>
        <div v-else-if="textContent" class="text-container">
          <pre class="text-content">{{ textContent }}</pre>
        </div>
        <div v-else class="flex flex-col items-center justify-center">
          <el-empty :description="$t('common.empty_content')" />
        </div>
      </div>

      <!-- 使用封装的批注组件 -->
      <DocumentAnnotation
        v-model:active-index="activeIndex"
        @ai-assist="handleAiAssist"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.last-modify-time {
  color: var(--el-text-color-disabled);
}

.text-container {
  min-height: 400px;
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  width: 100%;
}

.text-content {
  white-space: pre-wrap;
  font-family: 'Courier New', Courier, monospace;
  line-height: 1.6;
  color: #333;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: auto;
}
</style>
