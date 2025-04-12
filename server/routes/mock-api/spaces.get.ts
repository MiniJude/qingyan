import type { ApiResponse } from '../../utils/types'
import { defineEventHandler, getQuery } from 'h3'
import { currentUser, getAllSpaces, getUserSpaces } from '../../data'

export default defineEventHandler(async (event): Promise<ApiResponse<any>> => {
  const query = getQuery(event)
  const userId = query.userId as string || currentUser.id

  // 返回用户的空间或所有空间
  const spaces = userId ? getUserSpaces(userId) : getAllSpaces()
  return {
    code: 20000,
    message: '获取空间列表成功',
    data: spaces,
  }
})
