<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { getCurrentInstance, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// 获取应用上下文（用于ElMessage）
const { appContext } = getCurrentInstance()!
const { t } = useI18n()

// 下载权限
const permissionSelectVisible = ref(false)
const currentPermission = ref(t('knowledge_base.share_dialog.download.space_download'))

// 下载权限选项
const permissionOptions = [
  { label: t('knowledge_base.share_dialog.download.space_download'), value: 'space_download' },
  { label: t('knowledge_base.share_dialog.download.only_self_download'), value: 'only_self_download' },
]

// 更新下载权限
function updatePermission(option: { label: string, value: string }) {
  currentPermission.value = option.label
  permissionSelectVisible.value = false
  ElMessage.success({
    message: t('knowledge_base.share_dialog.download.permission_updated'),
    duration: 2000,
  }, appContext)
}
</script>

<template>
  <div class="download-permission">
    <!-- 说明文字 -->
    <div class="mb-24px">
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
        <el-dropdown
          v-model:visible="permissionSelectVisible"
          trigger="click"
        >
          <span class="flex cursor-pointer items-center text-primary">
            {{ currentPermission }}
            <el-icon class="ml-4px"><el-icon-arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="option in permissionOptions"
                :key="option.value"
                @click="updatePermission(option)"
              >
                {{ option.label }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 提示信息 -->
    <div class="info-tips">
      <p class="text-12px text-gray-500">
        {{ $t('knowledge_base.share_dialog.download.permission_note') }}
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.download-permission {
  padding: 16px 0;
}
</style>
