<script setup lang="ts">
import { CopyDocument, InfoFilled, RefreshRight } from '@element-plus/icons-vue'
import { useClipboard } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import { computed, getCurrentInstance, ref, watch } from 'vue'
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
const currentShareRangeValue = ref('collaborators_only')

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
  currentShareRangeValue.value = option.value
  shareRangeVisible.value = false
  ElMessage.success({
    message: t('knowledge_base.share_dialog.invite.range_updated'),
    duration: 2000,
  }, appContext)
}

// 静态的空间成员数据
const spaceMembers = [
  { id: 1, username: 'Jude', avatar: 'J', role: 'admin' },
  { id: 2, username: '张三', avatar: '张', role: 'member' },
  { id: 3, username: '李四', avatar: '李', role: 'member' },
  { id: 4, username: '王五', avatar: '王', role: 'member' },
  { id: 5, username: 'Mike', avatar: 'M', role: 'member' },
  { id: 6, username: 'Emma', avatar: 'E', role: 'member' },
  { id: 7, username: 'Alex', avatar: 'A', role: 'member' },
  { id: 8, username: '赵六', avatar: '赵', role: 'member' },
]

// 协作者选择相关
const selectedCollaborators = ref([])
const selectVisible = ref(false)

// 当选择面板关闭时处理添加协作者
function handleSelectClose() {
  if (selectedCollaborators.value.length > 0) {
    ElMessage.success({
      message: t('common.messages.operation_success', { operation: t('common.actions.add') }),
      duration: 2000,
    }, appContext)
  }
}

// 密码相关
const enablePassword = ref(false)
const accessPassword = ref(generateRandomPassword())

// 监听密码启用状态变化
watch(enablePassword, (newValue) => {
  if (newValue) {
    // 勾选启用密码时显示成功消息
    ElMessage.success({
      message: t('common.messages.operation_success', { operation: t('space.member.set_password') }),
      duration: 2000,
    }, appContext)
  }
})

// 检查是否显示密码功能
const shouldShowPassword = computed(() => {
  return currentShareRangeValue.value === 'internet_read' || currentShareRangeValue.value === 'internet_edit'
})

// 生成随机密码
function generateRandomPassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let password = ''
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

// 刷新密码
function refreshPassword() {
  accessPassword.value = generateRandomPassword()
  // 刷新密码时显示成功消息
  ElMessage.success({
    message: t('common.messages.operation_success', { operation: t('space.member.set_password') }),
    duration: 2000,
  }, appContext)
}
</script>

<template>
  <div class="invite-collaboration">
    <!-- 顶部分享链接区域 -->
    <div class="mb-24px flex items-center justify-between rounded-4px bg-gray-50 p-16px">
      {{ shareLink }}
      <el-icon class="mr-4px cursor-pointer" @click="copyShareLink">
        <CopyDocument />
      </el-icon>
    </div>

    <!-- 分享范围 -->
    <div class="mb-24px">
      <div class="mb-12px">
        <span class="text-14px font-medium">{{ $t('knowledge_base.share_dialog.invite.share_range') }}</span>
      </div>
      <div class="flex items-center justify-between rounded-4px bg-gray-50 p-16px">
        <span class="text-14px text-gray-700">{{ $t('knowledge_base.share_dialog.invite.access_level') }}</span>
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

      <!-- 密码设置 - 仅在选择互联网上获得链接的人可阅读/编辑时显示 -->
      <div v-if="shouldShowPassword" class="mt-12px">
        <div class="flex items-center px-12px">
          <el-checkbox v-model="enablePassword" class="mr-12px">
            {{ $t('space.member.set_password') }}
          </el-checkbox>
        </div>

        <!-- 密码输入框 -->
        <transition name="el-fade-in-linear">
          <div v-if="enablePassword" class="mt-8px rounded-4px bg-gray-50 p-16px">
            <div class="flex items-center">
              <div class="mr-8px w-300px">
                <el-input
                  v-model="accessPassword"
                  disabled
                  class="mr-8px"
                >
                  <template #append>
                    <el-button @click="refreshPassword">
                      <el-icon><RefreshRight /></el-icon>
                    </el-button>
                  </template>
                </el-input>
              </div>
            </div>
            <div class="mt-8px flex items-center text-12px text-gray-400">
              <el-icon class="mr-4px">
                <InfoFilled />
              </el-icon>
              {{ $t('knowledge_base.share_dialog.invite.password_tip') }}
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- 添加协作者 -->
    <div class="mb-24px">
      <div class="mb-12px">
        <span class="text-14px font-medium">{{ $t('knowledge_base.share_dialog.invite.add_collaborator') }}</span>
      </div>

      <!-- 多选下拉框选择协作者 -->
      <el-select
        v-model="selectedCollaborators"
        v-model:visible="selectVisible"
        multiple
        filterable
        collapse-tags
        collapse-tags-tooltip
        :max-collapse-tags="5"
        class="w-full"
        :placeholder="$t('knowledge_base.share_dialog.invite.email_placeholder')"
        @visible-change="visible => !visible && handleSelectClose()"
      >
        <el-option
          v-for="member in spaceMembers"
          :key="member.id"
          :label="member.username"
          :value="member.id"
        >
          <div class="flex items-center">
            <el-avatar :size="24" class="mr-8px">
              {{ member.avatar }}
            </el-avatar>
            <span>{{ member.username }}</span>
            <span class="ml-8px text-12px text-gray-400">({{ member.role }})</span>
          </div>
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.invite-collaboration {
  padding: 16px 0;

  :deep(.el-select) {
    width: 100%;
  }

  :deep(.el-select-dropdown__item) {
    height: 40px;
    line-height: 40px;
  }
}
</style>
