<script setup lang="ts">
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

    <!-- 视频预览区域 -->
    <div min-h-0 flex flex-1 flex-col items-center justify-center overflow-hidden>
      <div class="video-container">
        <video class="video-player" :src="videoUrl" controls />
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
