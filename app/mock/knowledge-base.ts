// 个人空间数据
export const personalData: FileTreeType[] = [
  {
    label: '文件夹',
    level: 1,
    id: '1',
    children: [
      {
        id: '1-1',
        label: '高等数学',
        level: 2,
        type: 'folder',
        children: [
          {
            id: '1-1-1',
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
    id: '2',
    children: [
      {
        id: '2-1',
        label: '大一学期',
        level: 2,
        type: 'folder',
        children: [
        ],
      },
    ],
  },
  {
    id: '3',
    label: '待归档',
    level: 1,
    children: [
      {
        id: '3-1',
        label: '大一学期',
        level: 2,
        type: 'folder',
        children: [
          {
            id: '3-1-1',
            label: 'P020220728570290339415.jpg',
            level: 3,
            type: 'file',
            fileType: 'picture',
            fileUrl: 'https://www.writebug.com/api/v3/document/file/download/?id=b79f5592-0ae7-11f0-aa41-0242c0a81019&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDUwMjM5MzgsImFjY291bnQiOnsiaWQiOiIzNmY1M2VhMi0wYzY4LTExZjAtYWE0MS0wMjQyYzBhODEwMTkiLCJyb2xlIjpudWxsLCJ1c2VybmFtZSI6Ikp1ZGUiLCJlbWFpbCI6IjE1NDY5ODU2OTBAcXEuY29tIiwicGhvbmUiOiIxNTM2NjA2MTk3OSIsImF2YXRhciI6Ii9zdGF0aWMvaW1hZ2VzL2RlZmF1bHQtYXZhdGFyLnBuZyIsInB1dF9vbl9oYXQiOm51bGwsInNpZ25hdHVyZSI6IjEzMTIzIiwiZ2VuZGVyIjpudWxsLCJzY2hvb2wiOm51bGwsImJpcnRoZGF5IjpudWxsLCJtYWpvciI6bnVsbCwiZW50cmFuY2UiOm51bGwsImVkdWNhdGlvbiI6bnVsbCwiZGlzYWJsZWRfbG9naW4iOmZhbHNlLCJhdXRoX3N0YXRlIjoiMTAiLCJhY2Nlc3NfdG9rZW4iOiI3ZDE4MDhkOWRjMmM1NTBjMGIyY2Q3NDk5OTU1ZTk1MDZjZTM0YzQxIiwib25saW5lIjpmYWxzZSwiZGV2aWNlIjowLCJncm91cF9wdWJsaWMiOnRydWUsImZhdl9wdWJsaWMiOnRydWUsImFuc3dlcl9wdWJsaWMiOnRydWUsImhpc3RvcnlfcHVibGljIjp0cnVlLCJmb2xsb3dfcHVibGljIjp0cnVlLCJhY3Rpdml0eV9wdWJsaWMiOnRydWUsImlzX2ZyZWV6ZSI6bnVsbCwiaXNfZmFrZXVzZXIiOm51bGwsImRlbGV0ZSI6bnVsbCwiZ2l0X3VzZXJfaWQiOjEyMDA2NCwidGhlbWUiOm51bGwsImxhbmciOm51bGwsIm9wZW5pZCI6bnVsbCwidW5pb25pZCI6bnVsbCwiZXh0ZXJuYWxfdXNlcmlkIjpudWxsLCJ3ZWNoYXRfc2F2ZV9ncm91cCI6bnVsbCwiZmlyc3RMb2dpbiI6ZmFsc2UsImRvbWFpbiI6IlRjZUVYWVJxQkMiLCJsb2dvIjoiL3N0YXRpYy9pbWFnZXMvZGVmYXVsdC1wcml2YXRlLWdyb3VwLnBuZyJ9fQ.L6zbm3s1Jdzm6ctTgXUyHomcnW4eBvNRdJBZfP3kcmU',
          },
          {
            id: '3-1-2',
            label: 'imageinput_让画面里的图像动起来，人向前走路_2025-04-03 10_05_35.mp4',
            level: 3,
            type: 'file',
            fileType: 'video',
            fileUrl: '/assets/files/下载.mp4',
          },
          // {
          //   id: uuidv4(),
          //   label: '姜昱臣小组.pptx',
          //   level: 3,
          //   type: 'file',
          //   fileType: 'ppt',
          //   // fileUrl: 'https://qingyan.minijude.cn/assets/files/P020220728570290339415.jpg',
          //   fileUrl: '/assets/files/P020220728570290339415.jpg',
          // },
          {
            id: '3-1-3',
            label: '商务场景设计说明迭代.txt',
            level: 3,
            type: 'file',
            fileType: 'txt',
            fileUrl: '/assets/files/商务场景设计说明迭代.txt',
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
