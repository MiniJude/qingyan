import type { ApiResponse } from '../../utils/types'
import { defineEventHandler, getQuery } from 'h3'
import { personalData, teamData } from '../../../app/mock/knowledge-base'
import { getSpaceById } from '../../data'

// 为每个空间准备不同的模拟数据
const mockKnowledgeBaseData = new Map([
  ['1', personalData], // 个人空间使用personalData
  ['2', teamData], // 团队空间使用teamData
  // 可以添加更多空间的数据映射
])

export default defineEventHandler(async (event): Promise<ApiResponse<any>> => {
  const query = getQuery(event)
  const spaceId = query.spaceId as string

  if (!spaceId) {
    return {
      code: 40000,
      message: '缺少空间ID参数',
      data: null,
    }
  }

  // 验证空间是否存在
  const space = getSpaceById(spaceId)
  if (!space) {
    return {
      code: 40400,
      message: '指定的空间不存在',
      data: null,
    }
  }

  // 获取与空间ID对应的知识库数据
  const result = mockKnowledgeBaseData.get(spaceId) || []

  return {
    code: 20000,
    message: '获取知识库数据成功',
    data: result,
  }
})
