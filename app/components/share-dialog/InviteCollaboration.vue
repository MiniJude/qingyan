<script setup lang="ts">
import { CopyDocument } from '@element-plus/icons-vue'
import { useClipboard } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import { getCurrentInstance, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// 获取应用上下文（用于ElMessage）
const { appContext } = getCurrentInstance()!
const { t } = useI18n()

// 复制链接
const shareLink = ref('https://example.com/shared-document/xyz123')
// 使用VueUse的剪贴板功能
const { copy, copied, isSupported } = useClipboard()

async function copyShareLink() {
  await copy(shareLink.value)

  if (copied.value) {
    ElMessage.success({
      message: t('common.messages.operation_success', { operation: t('common.actions.copy') }),
      duration: 2000,
    }, appContext)
  }
  else if (!isSupported.value) {
    ElMessage.error({
      message: t('common.messages.operation_failed', { operation: t('common.actions.copy') }),
      duration: 2000,
    }, appContext)
  }
}

// 分享范围控制
const shareRangeVisible = ref(false)
const currentShareRange = ref(t('knowledge_base.share_dialog.invite.collaborators_only'))

// 分享范围选项
const shareRangeOptions = [
  { label: t('knowledge_base.share_dialog.invite.collaborators_only'), value: 'collaborators_only' },
  { label: t('knowledge_base.share_dialog.invite.space_read'), value: 'space_read' },
  { label: t('knowledge_base.share_dialog.invite.space_edit'), value: 'space_edit' },
  { label: t('knowledge_base.share_dialog.invite.internet_read'), value: 'internet_read' },
  { label: t('knowledge_base.share_dialog.invite.internet_edit'), value: 'internet_edit' },
]

// 更新分享范围
function updateShareRange(option: { label: string, value: string }) {
  currentShareRange.value = option.label
  shareRangeVisible.value = false
  ElMessage.success({
    message: t('knowledge_base.share_dialog.invite.range_updated'),
    duration: 2000,
  }, appContext)
}

// 添加协作者表单
const collaboratorEmail = ref('')
</script>

<template>
  <div class="invite-collaboration">
    <!-- 顶部分享链接区域 -->
    <div class="share-link-container mb-24px rounded-4px bg-gray-50 p-16px">
      <div class="flex items-center justify-between">
        <span class="text-14px text-gray-700">{{ $t('knowledge_base.share_dialog.invite.share_link') }}</span>
        <el-button
          type="primary"
          plain
          size="small"
          @click="copyShareLink"
        >
          <el-icon class="mr-4px">
            <CopyDocument />
          </el-icon>
          {{ $t('knowledge_base.share_dialog.invite.copy_link') }}
        </el-button>
      </div>
      <div class="share-link mt-8px truncate rounded-4px bg-white p-8px text-12px text-gray-500">
        {{ shareLink }}
      </div>
    </div>

    <!-- 链接设置 -->
    <div class="share-settings mb-24px">
      <h3 class="mb-16px text-16px font-medium">
        {{ $t('knowledge_base.share_dialog.invite.link_settings') }}
      </h3>

      <!-- 分享范围 -->
      <div class="share-range mb-16px">
        <div class="flex items-center justify-between">
          <span class="text-14px text-gray-700">{{ $t('knowledge_base.share_dialog.invite.share_range') }}</span>
          <el-dropdown
            v-model:visible="shareRangeVisible"
            trigger="click"
          >
            <span class="flex cursor-pointer items-center text-primary">
              {{ currentShareRange }}
              <el-icon class="ml-4px"><el-icon-arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="option in shareRangeOptions"
                  :key="option.value"
                  @click="updateShareRange(option)"
                >
                  {{ option.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>

      <!-- 添加协作者 -->
      <div class="collaborators">
        <h4 class="mb-12px text-14px font-medium">
          {{ $t('knowledge_base.share_dialog.invite.add_collaborator') }}
        </h4>
        <el-input
          v-model="collaboratorEmail"
          :placeholder="$t('knowledge_base.share_dialog.invite.email_placeholder')"
          class="mb-8px"
        >
          <template #append>
            <el-button>{{ $t('knowledge_base.share_dialog.invite.add') }}</el-button>
          </template>
        </el-input>
        <p class="text-12px text-gray-500">
          {{ $t('knowledge_base.share_dialog.invite.invitation_note') }}
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.invite-collaboration {
  padding: 16px 0;
}
</style>
