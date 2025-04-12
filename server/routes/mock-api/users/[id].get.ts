import type { ApiResponse } from '../../../utils/types'
import { defineEventHandler } from 'h3'
import { currentUser, getUserById } from '../../../data'

export default defineEventHandler((event): ApiResponse<any> => {
  const id = event.context.params?.id

  // 如果是获取当前用户
  if (id === 'current') {
    return {
      code: 20000,
      message: '获取当前用户成功',
      data: currentUser,
    }
  }

  if (!id) {
    return {
      code: 40000,
      message: '参数错误',
      data: null,
    }
  }

  const user = getUserById(id)
  if (!user) {
    return {
      code: 40404,
      message: '用户不存在',
      data: null,
    }
  }

  return {
    code: 20000,
    message: '获取用户成功',
    data: user,
  }
})
