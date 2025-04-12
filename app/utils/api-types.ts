// API响应接口
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 空间接口
export interface Space {
  id: string
  name: string
  type: 'personal' | 'team'
  description?: string
  owner: string
  members?: string[]
  publicSpace?: boolean
  publicApply?: boolean
  createdAt: string | Date
  updatedAt: string | Date
}

// 用户接口
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}
