import type { Space } from '~/utils/api-types'

export default defineNuxtRouteMiddleware(async (to, _from) => {
  // 只处理/group/开头的路由
  if (!to.path.startsWith('/group/')) {
    return
  }

  // 获取路由中的空间ID（从groupid参数获取）
  const spaceId = typeof to.params.groupid === 'string' ? to.params.groupid : ''
  if (!spaceId) {
    return
  }

  // 获取space store
  const spaceStore = useSpaceStore()

  // 如果当前已经是这个空间，不需要重新获取
  if (spaceStore.currentSpace?.id === spaceId) {
    return
  }

  // 获取空间信息
  try {
    const spaceInfo = await $api<Space>(`/mock-api/spaces/${spaceId}`)
    if (spaceInfo) {
      // 将空间信息存储到store中
      spaceStore.setCurrentSpace(spaceInfo)
    }
    else {
      console.error('获取空间信息失败: 空间不存在')

      // 如果没有找到空间，可以重定向到默认空间或404页面
      if (spaceStore.hasSpaces) {
        // 重定向到第一个空间
        const firstSpace = spaceStore.spaceList[0]
        if (firstSpace && firstSpace.id !== spaceId) {
          return navigateTo(`/group/${firstSpace.id}${to.path.substring(to.path.indexOf('/', 7))}`)
        }
      }
      else {
        // 加载空间列表
        await spaceStore.loadSpaces()
        if (spaceStore.hasSpaces) {
          const firstSpace = spaceStore.spaceList[0]
          if (firstSpace && firstSpace.id !== spaceId) {
            return navigateTo(`/group/${firstSpace.id}${to.path.substring(to.path.indexOf('/', 7))}`)
          }
        }
      }
    }
  }
  catch (error) {
    console.error('获取空间信息失败:', error)

    // 异常情况下仍然尝试加载空间列表
    if (!spaceStore.hasSpaces) {
      await spaceStore.loadSpaces()
    }
  }
})
