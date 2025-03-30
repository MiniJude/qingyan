// composables/useAuth.ts
import { useState } from '#imports'

interface LoginResponse {
  token: string
  userinfo: UserInfo
}

interface UserInfo {
  avatar: string
}

export function useAuth() {
  const user = useState<UserInfo | null>('user', () => null)
  const token = useState<string | null>('token', () => null)

  // 初始化函数：从localStorage和cookie恢复用户状态
  const init = () => {
    // 从cookie中恢复token
    const tokenCookie = useCookie('token')
    if (tokenCookie.value) {
      token.value = tokenCookie.value
    }

    // 从localStorage中恢复用户信息
    if (import.meta.client) {
      const savedUserInfo = localStorage.getItem('userInfo')
      if (savedUserInfo) {
        try {
          user.value = JSON.parse(savedUserInfo)
        }
        catch (e) {
          console.error('Failed to parse saved user info', e)
          localStorage.removeItem('userInfo')
        }
      }
    }
  }

  // 页面加载时自动初始化
  onMounted(() => {
    init()
  })

  const login = async (phone: string, password: string) => {
    const response = await $api<LoginResponse>('/copy/?url=https://www.writebug.com/api/v3/member/login/', {
      method: 'POST',
      body: { phone, password },
    })

    // 假设服务器返回 token 和 userInfo
    const { token: receivedToken, userinfo } = response

    // 存储 token 和 userInfo
    if (receivedToken) {
      // 正确使用 useCookie：先创建引用，再赋值
      const tokenCookie = useCookie('token', { httpOnly: true })
      tokenCookie.value = receivedToken
      token.value = receivedToken
    }

    if (userinfo) {
      userinfo.avatar = `https://www.writebug.com${userinfo.avatar}`
      user.value = userinfo
      // 可以将 userInfo 存储在 localStorage 或 sessionStorage 中
      localStorage.setItem('userInfo', JSON.stringify(userinfo))
    }
  }

  /**
   * 退出登录
   * 清除所有认证相关的状态和存储
   */
  const logout = async () => {
    try {
      // 可选：调用登出API
      // await $api('/copy/?url=https://www.writebug.com/api/v3/member/logout')

      // 清除状态
      user.value = null
      token.value = null

      // 清除cookie
      const tokenCookie = useCookie('token')
      tokenCookie.value = null

      // 清除localStorage
      localStorage.removeItem('userInfo')

      return true
    }
    catch (error) {
      console.error('登出失败:', error)
      return false
    }
  }

  // 初始化时自动运行一次
  if (import.meta.client) {
    init()
  }

  return { user, token, login, logout, init }
}
