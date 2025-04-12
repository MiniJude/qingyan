import { defineStore } from 'pinia'

interface FileState {
  currentFileRoute: string[]
}

export const useFileStore = defineStore('file', {
  state: (): FileState => ({
    currentFileRoute: [],
  }),

  actions: {
    // 设置当前文件路径
    setFileRoute(route: string[]) {
      this.currentFileRoute = route
    },

    // 清除当前文件路径
    clearFileRoute() {
      this.currentFileRoute = []
    },
  },

  persist: true,
})
