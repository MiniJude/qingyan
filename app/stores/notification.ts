import { defineStore } from 'pinia'

export interface Notification {
  id: string
  content: string
  time: string
  read: boolean
  type: 'capacity' | 'token' | 'vip' | 'system' // 通知类型: 容量不足、token不足、VIP到期、系统通知
}

export const useNotificationStore = defineStore('notification', () => {
  // 通知列表
  const notifications = ref<Notification[]>([
    {
      id: '1',
      content: 'notification.capacity_insufficient',
      time: '2023-11-20 15:30',
      read: false,
      type: 'capacity',
    },
    {
      id: '2',
      content: 'notification.token_insufficient',
      time: '2023-11-19 10:15',
      read: false,
      type: 'token',
    },
    {
      id: '3',
      content: 'notification.vip_expiring',
      time: '2023-11-18 09:45',
      read: true,
      type: 'vip',
    },
    {
      id: '4',
      content: 'notification.system_update',
      time: '2023-11-15 14:20',
      read: true,
      type: 'system',
    },
  ])

  // 获取未读通知数量
  const unreadCount = computed(() => {
    return notifications.value.filter(notification => !notification.read).length
  })

  // 获取所有通知
  const getNotifications = computed(() => {
    return notifications.value
  })

  // 获取未读通知
  const getUnreadNotifications = computed(() => {
    return notifications.value.filter(notification => !notification.read)
  })

  // 标记单个通知为已读
  function markAsRead(id: string) {
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.read = true
    }
  }

  // 全部标记为已读
  function markAllAsRead() {
    notifications.value.forEach((notification) => {
      notification.read = true
    })
  }

  // 添加新通知
  function addNotification(notification: Omit<Notification, 'id'>) {
    const id = Date.now().toString()
    notifications.value.unshift({
      id,
      ...notification,
    })
  }

  return {
    notifications,
    unreadCount,
    getNotifications,
    getUnreadNotifications,
    markAsRead,
    markAllAsRead,
    addNotification,
  }
})
