import type { FileInfo } from '~/types/file'
import { FileType, getFileTypeFromExtension, getFileTypeFromMime } from '~/types/file'

export function useFileUpload() {
  // 生成唯一ID
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
  }

  // 将File对象转换为FileInfo
  function fileToFileInfo(file: File): FileInfo {
    const type = file.type
      ? getFileTypeFromMime(file.type)
      : getFileTypeFromExtension(file.name)

    return {
      id: generateId(),
      name: file.name,
      type,
      size: file.size,
      url: URL.createObjectURL(file),
    }
  }

  // 处理文件选择
  async function handleFileSelect(): Promise<FileInfo[]> {
    return new Promise((resolve) => {
      // 创建隐藏的文件输入框
      const input = document.createElement('input')
      input.type = 'file'
      input.multiple = true
      input.style.display = 'none'
      document.body.appendChild(input)

      // 监听文件选择
      input.onchange = () => {
        const files = Array.from(input.files || [])
        const fileInfos = files.map(fileToFileInfo)
        document.body.removeChild(input)
        resolve(fileInfos)
      }

      // 触发点击
      input.click()
    })
  }

  // 处理粘贴事件
  function handlePaste(event: ClipboardEvent): FileInfo[] {
    const items = Array.from(event.clipboardData?.items || [])
    const fileInfos: FileInfo[] = []

    items.forEach((item) => {
      if (item.kind === 'file') {
        const file = item.getAsFile()
        if (file) {
          fileInfos.push(fileToFileInfo(file))
        }
      }
    })

    return fileInfos
  }

  // 设置粘贴监听器
  function setupPasteListener(elementOrComponent: any, callback: (files: FileInfo[]) => void) {
    function pasteHandler(event: ClipboardEvent) {
      const files = handlePaste(event)
      if (files.length > 0) {
        callback(files)
      }
    }

    // 获取实际的DOM元素
    let element: HTMLElement | null = null

    // 检查是否是Vue组件实例（带有$el属性）
    if (elementOrComponent && elementOrComponent.$el) {
      element = elementOrComponent.$el
    }
    // 检查是否是El-input组件（需要查找内部的input元素）
    else if (elementOrComponent && typeof elementOrComponent === 'object') {
      // Element Plus的ElInput组件结构
      const inputEl = elementOrComponent.input
        || (elementOrComponent.$el && elementOrComponent.$el.querySelector('input'))
        || elementOrComponent

      element = inputEl
    }
    // 直接使用作为DOM元素
    else {
      element = elementOrComponent
    }

    if (!element || typeof element.addEventListener !== 'function') {
      console.warn('无法设置粘贴监听器：提供的元素无效，将尝试在document上监听')

      // 如果没有有效元素，则在document上监听粘贴事件（全局）
      document.addEventListener('paste', pasteHandler)

      return () => {
        document.removeEventListener('paste', pasteHandler)
      }
    }

    element.addEventListener('paste', pasteHandler)

    // 返回清理函数
    return () => {
      element.removeEventListener('paste', pasteHandler)
    }
  }

  return {
    handleFileSelect,
    handlePaste,
    setupPasteListener,
  }
}
