<script setup lang="ts">
// 获取当前路由参数
const route = useRoute()
const fileId = (route.params as any).id

// 图片文件URL
const imageUrl = ref('')

// 批注组件相关
const activeIndex = ref(0)

async function getImageUrl() {
  const file = await $api<FileTreeType>(`/mock-api/knowledge-base/${fileId}`)
  if (file && file.fileUrl) {
    imageUrl.value = file.fileUrl
  }
}

// 处理AI助手点击
function handleAiAssist() {
  // 这里可以添加AI助手的逻辑
  // 实际实现中应替换为真实功能
}

onMounted(() => {
  getImageUrl()
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
      <!-- <div class="btn-group" flex gap-12px>
        <el-button plain size="large">
          <template #icon>
            <SvgoDownload />
          </template>
          {{ $t('knowledge_base.doc_view.download') }}
        </el-button>

        <el-dropdown>
          <el-button type="primary" size="large">
            {{ $t('knowledge_base.doc_view.share') }}
            <div ml-8px h-16px w-16px flex-center>
              <SvgoArrowBottomFilled text-6px />
            </div>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>{{ $t('knowledge_base.doc_view.copy_link') }}</el-dropdown-item>
              <el-dropdown-item>{{ $t('knowledge_base.doc_view.generate_qrcode') }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div> -->
    </div>

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
