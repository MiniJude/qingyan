// 使用pinia存储文件路径
import { defineStore } from 'pinia'

export const useFileStore = defineStore('file', () => {
  const fileRoute = ref<string[]>([])

  function setFileRoute(_fileRoute: string[]) {
    fileRoute.value = _fileRoute
  }

  return {
    fileRoute,
    setFileRoute,
  }
}, {
  persist: true,
})
