// 团队类型定义
import type { User } from '../utils/api-types'

// 团队成员角色枚举
export enum TeamMemberRole {
  Owner = 'owner',
  Admin = 'admin',
  Member = 'member',
  Guest = 'guest',
}

// 团队成员接口
export interface TeamMember {
  id: string
  userId: string
  teamId: string
  role: TeamMemberRole
  joinedAt: Date | string
  user?: User
}

// 团队接口
export interface Team {
  id: string | number
  name: string
  description?: string
  avatar?: string
  isLocked?: boolean
  isPublic?: boolean
  createdTime: Date | string
  updatedAt?: Date | string
  ownerId?: string
  members?: TeamMember[]
}

// 创建团队的请求参数
export interface CreateTeamRequest {
  name: string
  description?: string
  avatar?: string
  isPublic?: boolean
}

// 更新团队的请求参数
export interface UpdateTeamRequest {
  name?: string
  description?: string
  avatar?: string
  isPublic?: boolean
  isLocked?: boolean
}
