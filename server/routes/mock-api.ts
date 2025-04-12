import type { ApiResponse } from '../utils/types'
import { defineEventHandler } from 'h3'
import { currentUser } from '../data'

export default defineEventHandler((): ApiResponse<any> => {
  return {
    code: 20000,
    message: '欢迎使用本地Mock API服务',
    data: {
      name: 'Qingyan Mock API',
      version: '1.0.0',
      currentUser,
    },
  }
})
