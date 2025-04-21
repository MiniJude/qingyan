// 用于检测设备类型的composable，同时兼容服务端和客户端
import { useRequestHeaders } from 'nuxt/app'

export function useDeviceDetection() {
  // 服务端检测设备类型的简化正则表达式
  const mobileRegex = /android|iphone|ipod|mobile|phone|iemobile|blackberry|opera mini|fennec/i
  const tabletRegex = /ipad|tablet|playbook|silk|android(?!.*mobile)/i

  // 检测是否为移动设备 (包括平板)
  const isMobileDevice = ref(false)

  // 服务端检测
  if (import.meta.server) {
    const headers = useRequestHeaders(['user-agent'])
    const userAgent = headers['user-agent'] || ''

    isMobileDevice.value = mobileRegex.test(userAgent) || tabletRegex.test(userAgent)
  }

  // 客户端检测
  if (import.meta.client) {
    // 客户端初始化时检测
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || ''
    const isMobileByUserAgent = mobileRegex.test(userAgent) || tabletRegex.test(userAgent)

    // 使用媒体查询检测
    const mediaQuery = window.matchMedia('(max-width: 767px), (pointer: coarse)')
    isMobileDevice.value = mediaQuery.matches || isMobileByUserAgent

    // 监听媒体查询变化（如屏幕旋转）
    mediaQuery.addEventListener('change', (e) => {
      isMobileDevice.value = e.matches || isMobileByUserAgent
    })
  }

  return {
    isMobileDevice,
  }
}
