import type { ApiResponse, Space } from '~/utils/api-types'
import { defineStore } from 'pinia'

// 定义空间store状态接口
interface SpaceState {
  currentSpace: Space | null
  spaceList: Space[]
  loading: boolean
}

export const useSpaceStore = defineStore('space', {
  // 初始状态
  state: (): SpaceState => ({
    currentSpace: null,
    spaceList: [],
    loading: false,
  }),

  // 操作状态的actions
  actions: {
    // 设置当前选中空间
    setCurrentSpace(space: Space) {
      this.currentSpace = space
    },

    // 设置空间列表
    setSpaceList(spaceList: Space[]) {
      this.spaceList = spaceList

      // 如果当前选中的空间不在列表中，则选择第一个
      if (this.spaceList.length > 0) {
        const currentSpaceExists = this.currentSpace
          && this.spaceList.some(space => space.id === this.currentSpace?.id)

        if (!currentSpaceExists) {
          // 使用非空断言，避免类型错误
          this.currentSpace = this.spaceList[0]!
        }
      }
      else {
        // 如果列表为空，则设置currentSpace为null
        this.currentSpace = null
      }
    },

    // 添加空间到列表
    addSpace(space: Space) {
      this.spaceList.push(space)
    },

    // 加载空间列表
    async loadSpaces() {
      this.loading = true

      try {
        // 从服务器获取空间列表，$api已经封装了对code的判断
        const data = await $api<Space[]>('/mock-api/spaces')
        // 直接使用返回的数据
        this.setSpaceList(Array.isArray(data) ? data : [])
      }
      catch (error) {
        console.error('加载空间列表失败', error)
        // 网络错误时，使用默认数据
        this.setDefaultSpaces()
      }
      finally {
        this.loading = false
      }
    },

    // 设置默认空间数据
    setDefaultSpaces() {
      const { t } = useI18n()
      const defaultSpaces: Space[] = [
        {
          id: '1',
          name: t('sidebar.personal_space'),
          type: 'personal',
          owner: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: t('sidebar.team_space'),
          type: 'team',
          owner: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      this.setSpaceList(defaultSpaces)
    },

    // 创建空间
    async createSpace(values: { name: string, description: string, type: 'personal' | 'team' }) {
      try {
        // $api已经封装了对code的判断，直接使用返回数据
        const newSpace = await $api<Space>('/mock-api/spaces', {
          method: 'POST',
          body: {
            name: values.name,
            description: values.description,
            type: values.type,
          },
        })

        // 添加新创建的空间到列表
        this.addSpace(newSpace)
        // 切换到新创建的空间
        this.setCurrentSpace(newSpace)
        return newSpace
      }
      catch (error) {
        console.error('创建空间失败', error)
        return null
      }
    },
  },

  // 使用getters获取状态
  getters: {
    // 判断是否有空间
    hasSpaces(): boolean {
      return this.spaceList.length > 0
    },
  },

  // 开启持久化
  persist: true,
})
