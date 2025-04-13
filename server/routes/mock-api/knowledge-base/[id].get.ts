import type { ApiResponse } from '../../../utils/types'
import { defineEventHandler, getRouterParam } from 'h3'
import { personalData, teamData } from '../../../../app/mock/knowledge-base'

// 根据ID递归查找文件
function findFileById(items: FileTreeType[] | FileTreeTypeWithOptionalId[], fileId: string): FileTreeType | null {
  for (const item of items) {
    if (item.id === fileId) {
      return item as FileTreeType
    }
    if (item.children && item.children.length > 0) {
      const found = findFileById(item.children, fileId)
      if (found)
        return found
    }
  }
  return null
}

export default defineEventHandler(async (event): Promise<ApiResponse<FileTreeType | null>> => {
  const fileId = getRouterParam(event, 'id')

  if (!fileId) {
    return {
      code: 40000,
      message: '缺少文件ID参数',
      data: null,
    }
  }

  // 在个人空间和团队空间数据中查找文件
  let file = findFileById(personalData, fileId)

  // 如果在个人空间中未找到，则在团队空间中查找
  if (!file) {
    // 为teamData中的每个项添加id
    const teamDataWithIds: FileTreeTypeWithOptionalId[] = JSON.parse(JSON.stringify(teamData)).map((item: FileTreeTypeWithOptionalId) => {
      if (!item.id)
        item.id = crypto.randomUUID()
      return item
    })

    file = findFileById(teamDataWithIds, fileId)
  }

  if (!file) {
    return {
      code: 40400,
      message: '未找到指定ID的文件',
      data: null,
    }
  }

  return {
    code: 20000,
    message: '获取文件数据成功',
    data: file,
  }
})
