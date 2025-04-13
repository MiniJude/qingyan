// 引入随机生成id的函数
import { v4 as uuidv4 } from 'uuid'

// 个人空间数据
export const personalData: FileTreeType[] = [
  {
    label: '文件夹',
    level: 1,
    id: uuidv4(),
    children: [
      {
        id: uuidv4(),
        label: '高等数学',
        level: 2,
        type: 'folder',
        children: [
          {
            id: uuidv4(),
            label: '香氛机产品外观设计开发需求表',
            level: 3,
            type: 'file',
            fileType: 'excel',
            fileUrl: '/assets/files/香氛机产品外观设计开发需求表(1).xlsx',
          },
        ],
      },
    ],
  },
  {
    label: '微信输入',
    level: 1,
    id: uuidv4(),
    children: [
      {
        id: uuidv4(),
        label: '大一学期',
        level: 2,
        type: 'folder',
        children: [
        ],
      },
    ],
  },
  {
    id: uuidv4(),
    label: '待归档',
    level: 1,
    children: [
      {
        id: uuidv4(),
        label: '大一学期',
        level: 2,
        type: 'folder',
        children: [
          {
            id: uuidv4(),
            label: '四六级报名通知',
            level: 3,
            type: 'file',
            fileType: 'wechat-article',
          },
        ],
      },
    ],
  },
]

// 团队空间数据
export const teamData: FileTreeTypeWithOptionalId[] = [
  {
    label: '文件夹',
    level: 1,
    children: [
      {
        label: '高等数学',
        level: 2,
        type: 'folder',
        children: [
          {
            label: '信息学一本通第五版',
            level: 3,
            type: 'file',
            fileType: 'ppt',
          },
          {
            label: '算法设计与分析',
            level: 3,
            type: 'file',
            fileType: 'ppt',
          },
          {
            label: '平衡树专题序言',
            level: 3,
            type: 'file',
            fileType: 'ppt',
          },
          {
            label: '毕业论文任务书',
            level: 3,
            type: 'file',
            fileType: 'doc',
          },
        ],
      },
      {
        label: '机械制图',
        level: 2,
        type: 'folder',
      },
      {
        label: '大学物理',
        level: 2,
        type: 'folder',
      },
      {
        label: '形势与政策',
        level: 2,
        type: 'folder',
      },
      {
        label: '流体力学',
        level: 2,
        type: 'folder',
      },
    ],
  },
]
