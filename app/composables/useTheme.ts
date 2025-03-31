import { ElMessage } from 'element-plus'

// 扩展的主题颜色接口，包含图片中显示的所有颜色类型
interface CustomThemeColors {
  // 主调色板
  primaryColor: string // 强调的功能操作，确定按钮 #660874
  primaryHoverColor: string // 悬浮色 #8D7697
  navBarBgColor: string // 导航栏底色，看板底色 #EDEFF3
  bgCutColor: string // 切换按钮色，目录选中色白底悬浮色 #E9EDF7
  bgMainWhite: string // 主页背景底色 #FFFFFF

  // 字体调色板
  textEmphasis: string // 强调文字/正文标题 #1D2129
  textSubEmphasis: string // 次强调文字 #4E5969
  textSecondary: string // 置灰信息 #C9CDD4
  textLight: string // 深底文字 #FFFFFF

  // 边框/分割线调色板
  borderRegular: string // 常规/浅色 #C9CDD4

  // 滚动条调色板
  scrollThumb: string // 点击 #999DA3
  scrollRegular: string // 常规 #C9CDD4
}

// 默认主题颜色
const defaultThemeColors: CustomThemeColors = {
  // 主调色板
  primaryColor: '#660874', // 强调的功能操作，确定按钮
  primaryHoverColor: '#8D7697', // 悬浮色
  navBarBgColor: '#EDEFF3', // 导航栏底色，看板底色
  bgCutColor: '#E9EDF7', // 切换按钮色，目录选中色白底悬浮色
  bgMainWhite: '#FFFFFF', // 主页背景底色

  // 字体调色板
  textEmphasis: '#1D2129', // 强调文字/正文标题
  textSubEmphasis: '#4E5969', // 次强调文字
  textSecondary: '#C9CDD4', // 置灰信息
  textLight: '#FFFFFF', // 深底文字

  // 边框/分割线调色板
  borderRegular: '#C9CDD4', // 常规/浅色

  // 滚动条调色板
  scrollThumb: '#999DA3', // 点击
  scrollRegular: '#C9CDD4', // 常规
}

// 从CSS变量中读取颜色（如果在浏览器环境）
function getComputedThemeColors(): CustomThemeColors {
  if (import.meta.client) {
    // 获取计算后的CSS变量值
    const getComputedColor = (name: string, fallback: string) => {
      const computedStyle = getComputedStyle(document.documentElement)
      return computedStyle.getPropertyValue(`--app-${name}`).trim() || fallback
    }

    return {
      // 主调色板
      primaryColor: getComputedColor('primary-color', defaultThemeColors.primaryColor),
      primaryHoverColor: getComputedColor('primary-hover-color', defaultThemeColors.primaryHoverColor),
      navBarBgColor: getComputedColor('nav-bar-bg-color', defaultThemeColors.navBarBgColor),
      bgCutColor: getComputedColor('bg-cut-color', defaultThemeColors.bgCutColor),
      bgMainWhite: getComputedColor('bg-main-white', defaultThemeColors.bgMainWhite),

      // 字体调色板
      textEmphasis: getComputedColor('text-emphasis', defaultThemeColors.textEmphasis),
      textSubEmphasis: getComputedColor('text-sub-emphasis', defaultThemeColors.textSubEmphasis),
      textSecondary: getComputedColor('text-secondary', defaultThemeColors.textSecondary),
      textLight: getComputedColor('text-light', defaultThemeColors.textLight),

      // 边框/分割线调色板
      borderRegular: getComputedColor('border-regular', defaultThemeColors.borderRegular),

      // 滚动条调色板
      scrollThumb: getComputedColor('scroll-thumb', defaultThemeColors.scrollThumb),
      scrollRegular: getComputedColor('scroll-regular', defaultThemeColors.scrollRegular),
    }
  }
  return defaultThemeColors
}

// 保存主题颜色到localStorage
function saveTheme(colors: CustomThemeColors) {
  if (import.meta.client) {
    localStorage.setItem('custom-theme-colors', JSON.stringify(colors))
  }
}

// 从localStorage加载主题颜色
function loadTheme(): CustomThemeColors {
  if (import.meta.client) {
    const saved = localStorage.getItem('custom-theme-colors')
    // 如果localStorage中有保存的颜色，使用保存的颜色，否则从计算样式获取颜色
    return saved ? JSON.parse(saved) : getComputedThemeColors()
  }
  return defaultThemeColors
}

// 使用useState确保全局状态共享
function useThemeState() {
  const colors = useState<CustomThemeColors>('custom-theme-colors', () => loadTheme())
  const themeDrawerVisible = useState<boolean>('theme-drawer-visible', () => false)

  return {
    colors,
    themeDrawerVisible,
  }
}

export function useTheme() {
  // 使用全局共享状态
  const { colors, themeDrawerVisible } = useThemeState()

  // 应用主题颜色到CSS变量
  const applyThemeColors = () => {
    if (!import.meta.client)
      return // 确保在客户端环境

    const html = document.documentElement

    // 设置自定义CSS变量
    html.style.setProperty('--app-primary-color', colors.value.primaryColor)
    html.style.setProperty('--app-primary-hover-color', colors.value.primaryHoverColor)
    html.style.setProperty('--app-nav-bar-bg-color', colors.value.navBarBgColor)
    html.style.setProperty('--app-bg-cut-color', colors.value.bgCutColor)
    html.style.setProperty('--app-bg-main-white', colors.value.bgMainWhite)

    html.style.setProperty('--app-text-emphasis', colors.value.textEmphasis)
    html.style.setProperty('--app-text-sub-emphasis', colors.value.textSubEmphasis)
    html.style.setProperty('--app-text-secondary', colors.value.textSecondary)
    html.style.setProperty('--app-text-light', colors.value.textLight)

    html.style.setProperty('--app-border-regular', colors.value.borderRegular)

    html.style.setProperty('--app-scroll-thumb', colors.value.scrollThumb)
    html.style.setProperty('--app-scroll-regular', colors.value.scrollRegular)

    // 同时更新Element Plus的主要颜色，保持兼容性
    html.style.setProperty('--el-color-primary', colors.value.primaryColor)
  }

  // 修改主题颜色
  const setColor = (key: keyof CustomThemeColors, value: string) => {
    colors.value[key] = value
    applyThemeColors()
    saveTheme(colors.value)
  }

  // 重置为默认颜色
  const resetColors = () => {
    colors.value = getComputedThemeColors() // 重置为计算样式中的颜色
    applyThemeColors()
    saveTheme(colors.value)
    ElMessage.success('主题颜色已重置')
  }

  // 打开主题设置抽屉
  const openThemeDrawer = () => {
    themeDrawerVisible.value = true
  }

  // 关闭主题设置抽屉
  const closeThemeDrawer = () => {
    themeDrawerVisible.value = false
  }

  // 初始化应用主题
  onMounted(() => {
    applyThemeColors()
  })

  return {
    colors,
    themeDrawerVisible,
    setColor,
    resetColors,
    openThemeDrawer,
    closeThemeDrawer,
    applyThemeColors,
  }
}
