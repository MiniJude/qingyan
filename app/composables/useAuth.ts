// composables/useAuth.ts
import { useUserStore } from '~/stores/user'

interface LoginResponse {
  token: string
  userinfo: UserInfo
}

interface UserInfo {
  avatar: string
  username?: string
  bio?: string
  phone?: string
  email?: string
}

export async function useLogin(phone: string, password: string) {
  const response = await $api<LoginResponse>('/api/member/login/', {
    method: 'POST',
    body: { phone, password },
  })

  // 获取用户store
  const userStore = useUserStore()

  // 假设服务器返回 token 和 userInfo
  const { token: receivedToken, userinfo } = response

  // 存储 token
  if (receivedToken) {
    // 使用 Pinia 存储 token
    userStore.setToken(receivedToken)

    // 同时也设置到 cookie 中以便服务端访问
    const token = useCookie('token')
    token.value = receivedToken
  }

  if (userinfo) {
    userinfo.avatar = `https://www.writebug.com${userinfo.avatar}`
    // 使用 Pinia 存储用户信息
    userStore.setUserInfo(userinfo)
  }
}

export async function useLogout() {
  // 获取用户store
  const userStore = useUserStore()

  // 可选：调用登出API
  // await $api('/api/member/logout')

  // 使用 Pinia 清除用户信息
  userStore.clearUserInfo()

  // 清除 cookie 中的 token
  const token = useCookie('token')
  token.value = null

  // 回到首页
  const localePath = useLocalePath()
  navigateTo(localePath('/' as I18nRoutePath), { replace: true })
}
