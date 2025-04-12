import type { ApiResponse } from '../../utils/types'
import { defineEventHandler } from 'h3'
import { getAllUsers } from '../../data'

export default defineEventHandler((): ApiResponse<any> => {
  const users = getAllUsers()
  return {
    code: 20000,
    message: '获取用户列表成功',
    data: users,
  }
})
