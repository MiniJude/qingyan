// composables/useAuth.ts
import { useState } from '#imports'

interface LoginResponse {
  token: string
  userinfo: UserInfo
}

interface UserInfo {
  avatar: string
}

export const useUser = () => useState<UserInfo | null>('user', () => null)

export async function useLogin(phone: string, password: string) {
  const response = await $api<LoginResponse>('/copy/?url=https://www.writebug.com/api/v3/member/login/', {
    method: 'POST',
    body: { phone, password },
  })

  // 假设服务器返回 token 和 userInfo
  const { token: receivedToken, userinfo } = response
  // 存储 token 和 userInfo
  if (receivedToken) {
    // 正确使用 useCookie：先创建引用，再赋值
    const token = useCookie('token')
    token.value = receivedToken
  }

  if (userinfo) {
    userinfo.avatar = `https://www.writebug.com${userinfo.avatar}`
    const user = useUser()
    user.value = userinfo
    // 可以将 userInfo 存储在 localStorage 或 sessionStorage 中
    localStorage.setItem('userInfo', JSON.stringify(userinfo))
  }
}

export async function useLogout() {
  // 可选：调用登出API
  // await $api('/copy/?url=https://www.writebug.com/api/v3/member/logout')
  const user = useUser()
  user.value = null
  const token = useCookie('token')
  token.value = null

  // 清除localStorage
  localStorage.removeItem('userInfo')
  // 回到首页
  const localePath = useLocalePath()
  navigateTo(localePath('/' as I18nRoutePath), { replace: true })
}
