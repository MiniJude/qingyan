import type { ApiResponse } from '../../utils/types'
import { defineEventHandler, readBody } from 'h3'
import { createSpace, currentUser } from '../../data'

export default defineEventHandler(async (event): Promise<ApiResponse<any>> => {
  const body = await readBody(event)

  if (!body || !body.name || !body.type) {
    return {
      code: 40000,
      message: '参数错误',
      data: null,
    }
  }

  // 使用当前用户作为创建者
  const spaceData = {
    ...body,
    owner: currentUser.id,
  }

  const newSpace = createSpace(spaceData)
  return {
    code: 20000,
    message: '创建空间成功',
    data: newSpace,
  }
})
