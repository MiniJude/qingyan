import type { ApiResponse } from '../../../utils/types'
import { defineEventHandler } from 'h3'
import { getSpaceById } from '../../../data'

export default defineEventHandler((event): ApiResponse<any> => {
  const id = event.context.params?.id

  if (!id) {
    return {
      code: 40000,
      message: '参数错误',
      data: null,
    }
  }

  const space = getSpaceById(id)
  if (!space) {
    return {
      code: 40404,
      message: '空间不存在',
      data: null,
    }
  }

  return {
    code: 20000,
    message: '获取空间成功',
    data: space,
  }
})
