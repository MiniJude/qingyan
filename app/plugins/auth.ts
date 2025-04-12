export default defineNuxtPlugin(async () => {
  // 在应用加载时获取用户信息
  const userStore = useUserStore()

  // 从Pinia store获取用户信息（会自动从localStorage恢复）
  if (userStore.isLoggedIn) {
    // 如果需要执行一些登录后的初始化操作，可以在这里添加
  }
})
