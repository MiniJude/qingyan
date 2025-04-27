<script setup lang="ts">
import { InfoFilled } from '@element-plus/icons-vue'

// 获取应用上下文（用于ElMessage）
const { appContext } = getCurrentInstance()!
const { t } = useI18n()

// 下载权限
const isDownloadAllowed = ref(true)

// 更新下载权限
function updatePermission(value: boolean | string | number) {
  isDownloadAllowed.value = Boolean(value)
  ElMessage.success({
    message: t('knowledge_base.share_dialog.download.permission_updated'),
    duration: 2000,
  }, appContext)
}
</script>

<template>
  <div class="download-permission">
    <!-- 说明文字 -->
    <div class="mb-24px flex items-center">
      <el-icon class="mr-8px">
        <InfoFilled />
      </el-icon>
      <p class="text-14px text-gray-700">
        {{ $t('knowledge_base.share_dialog.download.download_desc') }}
      </p>
    </div>

    <!-- 下载权限设置 -->
    <div class="permission-settings mb-24px">
      <h3 class="mb-16px text-16px font-medium">
        {{ $t('knowledge_base.share_dialog.download.download_permission') }}
      </h3>

      <div class="permission-select flex items-center justify-between rounded-4px bg-gray-50 p-12px">
        <span class="text-14px text-gray-700">{{ $t('knowledge_base.share_dialog.download.who_can_download') }}</span>
        <el-switch
          v-model="isDownloadAllowed"
          @change="updatePermission"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.download-permission {
  padding: 16px 0;
}
</style>
