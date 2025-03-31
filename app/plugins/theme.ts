// 主题插件
export default defineNuxtPlugin(() => {
  // 在客户端环境下初始化
  if (import.meta.client) {
    const { applyThemeColors } = useTheme()

    // 页面加载后应用主题颜色
    onMounted(() => {
      setTimeout(() => {
        applyThemeColors()
      }, 0)
    })
  }
})
