<script setup lang="ts">
import { getCurrentInstance } from 'vue'
import { useNotificationStore } from '~/stores/notification'

// 弹框可见性
const props = defineProps<{
  visible: boolean
}>()
const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()
const { t } = useI18n()
const { appContext } = getCurrentInstance()!
const { isMobileDevice } = useDeviceDetection()

// 计算属性处理v-model
const dialogVisible = computed({
  get: () => props.visible,
  set: value => emit('update:visible', value),
})

// 关闭弹框
function closeDialog() {
  emit('update:visible', false)
}

// 使用通知存储
const notificationStore = useNotificationStore()

// 标记单个通知为已读
function markAsRead(id: string) {
  notificationStore.markAsRead(id)
  ElMessage.success({ message: t('notification.marked_as_read'), appContext })
}

// 全部标记为已读
function markAllAsRead() {
  notificationStore.markAllAsRead()
  ElMessage.success({ message: t('notification.all_marked_as_read'), appContext })
}

// 获取通知项图标
function getNotificationIcon(type: string) {
  switch (type) {
    case 'capacity':
      return 'i-carbon:assembly-cluster'
    case 'token':
      return 'i-carbon:currency'
    case 'vip':
      return 'i-carbon:star-filled'
    case 'system':
    default:
      return 'i-carbon:notification'
  }
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="$t('notification.title')"
    width="460px"
    :fullscreen="isMobileDevice"
    @close="closeDialog"
  >
    <div class="notifications-header mb-16px flex items-center justify-between">
      <div class="text-14px text-gray-600">
        <span v-if="notificationStore.unreadCount > 0">{{ $t('notification.unread_count', { count: notificationStore.unreadCount }) }}</span>
        <span v-else>{{ $t('notification.no_unread') }}</span>
      </div>
      <el-button
        v-if="notificationStore.unreadCount > 0"
        size="small"
        link
        type="primary"
        @click="markAllAsRead"
      >
        {{ $t('notification.mark_all_read') }}
      </el-button>
    </div>

    <div v-if="notificationStore.notifications.length === 0" class="empty-state py-40px text-center">
      <div i-carbon:notification class="mx-auto mb-16px text-48px text-gray-400" />
      <p class="text-14px text-gray-500">
        {{ $t('notification.empty') }}
      </p>
    </div>

    <div v-else class="notifications-list">
      <div
        v-for="notification in notificationStore.notifications"
        :key="notification.id"
        class="notification-item mb-8px rounded-6px p-16px"
        :class="{ unread: !notification.read }"
      >
        <div class="flex justify-between">
          <div class="flex items-start">
            <div class="mr-12px shrink-0 text-24px" :class="[getNotificationIcon(notification.type)]" />
            <div>
              <div class="notification-content mb-4px text-14px">
                {{ $t(notification.content) }}
              </div>
              <div class="notification-time text-12px text-gray-400">
                {{ notification.time }}
              </div>
            </div>
          </div>
          <el-button
            v-if="!notification.read"
            type="primary"
            link
            size="small"
            @click="markAsRead(notification.id)"
          >
            {{ $t('notification.mark_read') }}
          </el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
.notification-item {
  background-color: var(--el-bg-color-page);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }

  &.unread {
    background-color: rgba(var(--el-color-primary-rgb), 0.05);
    border-left: 3px solid var(--el-color-primary);
  }
}
</style>
