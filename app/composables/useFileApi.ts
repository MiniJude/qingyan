/**
 * 文件API相关的composable
 */
export function useFileApi() {
  /**
   * 根据文件ID获取文件详情
   * @param fileId 文件ID
   * @returns 文件详情数据
   */
  async function getFileById(fileId: string): Promise<FileTreeType | null> {
    try {
      const fileObj = await $api<FileTreeType>(`/mock-api/knowledge-base/${fileId}`)
      return fileObj
    }
    catch (error) {
      console.error('获取文件详情失败:', error)
      return null
    }
  }

  return {
    getFileById,
  }
}
