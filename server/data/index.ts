// 定义数据类型
export interface Space {
  id: string
  name: string
  type: 'personal' | 'team'
  description?: string
  owner: string
  members?: string[]
  publicSpace?: boolean
  publicApply?: boolean
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

// 初始化模拟数据
const spaces: Space[] = [
  {
    id: '1',
    name: '个人空间',
    type: 'personal',
    description: '这是我的个人工作空间',
    owner: 'user1',
    publicSpace: false,
    publicApply: false,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
  {
    id: '2',
    name: '团队空间',
    type: 'team',
    description: '这是一个团队协作空间',
    owner: 'user1',
    members: ['user2', 'user3'],
    publicSpace: true,
    publicApply: true,
    createdAt: new Date('2023-02-15'),
    updatedAt: new Date('2023-02-15'),
  },
]

const users: User[] = [
  {
    id: 'user1',
    name: '张三',
    email: 'zhangsan@example.com',
    avatar: '/avatar/user1.png',
  },
  {
    id: 'user2',
    name: '李四',
    email: 'lisi@example.com',
    avatar: '/avatar/user2.png',
  },
  {
    id: 'user3',
    name: '王五',
    email: 'wangwu@example.com',
    avatar: '/avatar/user3.png',
  },
]

// 获取所有空间列表
export function getAllSpaces() {
  // 确保始终返回至少包含默认空间的数组
  if (spaces.length === 0) {
    // 如果spaces为空，添加一些默认的空间
    spaces.push({
      id: '1',
      name: '个人空间',
      type: 'personal',
      description: '这是我的个人工作空间',
      owner: 'user1',
      publicSpace: false,
      publicApply: false,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    })
  }
  return [...spaces]
}

// 获取特定用户的空间列表
export function getUserSpaces(userId: string) {
  // 获取用户的空间，如果没有则返回空数组
  const userSpaces = spaces.filter(space =>
    space.owner === userId
    || (space.members && space.members.includes(userId)),
  )

  // 如果用户没有空间，为其创建一个默认的个人空间
  if (userSpaces.length === 0 && userId) {
    const defaultSpace: Space = {
      id: `space_${Date.now()}`,
      name: '个人空间',
      type: 'personal',
      description: '这是我的个人工作空间',
      owner: userId,
      publicSpace: false,
      publicApply: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    spaces.push(defaultSpace)
    return [defaultSpace]
  }

  return userSpaces
}

// 根据ID获取空间
export function getSpaceById(id: string) {
  return spaces.find(space => space.id === id)
}

// 创建新空间
export function createSpace(spaceData: Omit<Space, 'id' | 'createdAt' | 'updatedAt'>) {
  const newSpace: Space = {
    id: `space_${Date.now()}`,
    ...spaceData,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  spaces.push(newSpace)
  return newSpace
}

// 更新空间
export function updateSpace(id: string, data: Partial<Omit<Space, 'id' | 'createdAt'>>) {
  const index = spaces.findIndex(space => space.id === id)
  if (index === -1)
    return null

  spaces[index] = {
    ...spaces[index],
    ...data,
    updatedAt: new Date(),
  }

  return spaces[index]
}

// 删除空间
export function deleteSpace(id: string) {
  const index = spaces.findIndex(space => space.id === id)
  if (index === -1)
    return false

  spaces.splice(index, 1)
  return true
}

// 获取所有用户
export function getAllUsers() {
  return [...users]
}

// 根据ID获取用户
export function getUserById(id: string) {
  return users.find(user => user.id === id)
}

// 当前用户（模拟登录用户）
export const currentUser = {
  id: 'user1',
  name: '张三',
  email: 'zhangsan@example.com',
}
