import type { ApiResponse } from '../../../utils/types'
import { defineEventHandler } from 'h3'
import { currentUser } from '../../../data'

export default defineEventHandler((): ApiResponse<any> => {
  return {
    code: 20000,
    message: '获取当前用户成功',
    data: currentUser,
  }
})
