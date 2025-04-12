import { defineStore } from 'pinia'

// 从useAuth.ts中提取的UserInfo接口
interface UserInfo {
  avatar: string
  username?: string
  bio?: string
  phone?: string
  email?: string
  // 根据实际需求可以添加更多字段
}

// 定义store状态的接口
interface UserState {
  userInfo: UserInfo | null
  token: string | null
}

// 使用defineStore创建用户store
export const useUserStore = defineStore('user', {
  // 初始状态
  state: (): UserState => ({
    userInfo: null,
    token: null,
  }),

  // 操作状态的actions
  actions: {
    // 设置用户信息
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo
    },

    // 设置token
    setToken(token: string) {
      this.token = token
    },

    // 清除用户信息（登出时使用）
    clearUserInfo() {
      this.userInfo = null
      this.token = null
    },

    // 更新用户信息中的某些字段
    updateUserInfo(partialUserInfo: Partial<UserInfo>) {
      if (this.userInfo) {
        this.userInfo = { ...this.userInfo, ...partialUserInfo }
      }
    },
  },

  // 使用getters获取状态
  getters: {
    // 判断用户是否已登录
    isLoggedIn(): boolean {
      return !!this.userInfo && !!this.token
    },

    // 获取用户头像
    userAvatar(): string | undefined {
      return this.userInfo?.avatar
    },

    // 获取用户名
    username(): string | undefined {
      return this.userInfo?.username
    },
  },

  // 开启持久化 - 使用简单配置
  persist: true as const,
})
