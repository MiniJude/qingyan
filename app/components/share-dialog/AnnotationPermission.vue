<script setup lang="ts">
import { InfoFilled } from '@element-plus/icons-vue'

// 获取应用上下文（用于ElMessage）
const { appContext } = getCurrentInstance()!
const { t } = useI18n()

// 批注权限
const permissionSelectVisible = ref(false)
const currentPermission = ref(t('knowledge_base.share_dialog.annotation.space_can_edit'))
const currentPermissionValue = ref('space_can_edit')

// 批注权限选项
const permissionOptions = [
  { label: t('knowledge_base.share_dialog.annotation.space_can_edit'), value: 'space_can_edit' },
  { label: t('knowledge_base.share_dialog.annotation.space_can_view'), value: 'space_can_view' },
]

// 更新批注权限
function updatePermission(option: { label: string, value: string }) {
  currentPermission.value = option.label
  currentPermissionValue.value = option.value
  permissionSelectVisible.value = false
  ElMessage.success({
    message: t('knowledge_base.share_dialog.annotation.permission_updated'),
    duration: 2000,
  }, appContext)
}
</script>

<template>
  <div class="annotation-permission">
    <!-- 说明文字 -->
    <div class="mb-24px flex items-center">
      <el-icon class="mr-8px">
        <InfoFilled />
      </el-icon>
      <p class="text-14px text-gray-700">
        {{ $t('knowledge_base.share_dialog.annotation.annotation_desc') }}
      </p>
    </div>

    <!-- 批注权限设置 -->
    <div class="permission-settings mb-24px">
      <h3 class="mb-16px text-16px font-medium">
        {{ $t('knowledge_base.share_dialog.annotation.annotation_permission') }}
      </h3>

      <div class="permission-select flex items-center justify-between rounded-4px bg-gray-50 p-12px">
        <span class="text-14px text-gray-700">{{ $t('knowledge_base.share_dialog.annotation.who_can_annotate') }}</span>
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
                <div class="flex items-center">
                  <span>{{ option.label }}</span>
                  <span v-if="currentPermissionValue === option.value" class="ml-8px text-success">
                    <el-icon><el-icon-check /></el-icon>
                  </span>
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.annotation-permission {
  padding: 16px 0;
}
</style>
