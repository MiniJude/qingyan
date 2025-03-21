<script lang="ts" setup>
import type { TreeType } from './Tree.vue'
import Tree from './Tree.vue'

const data1: TreeType[] = [
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
const data2: TreeType[] = [
  {
    label: '微信输入',
    level: 1,
    children: [
      {
        label: '大一学期',
        level: 2,
        type: 'folder',
        children: [
          {
            label: '四六级报名通知',
            level: 3,
            type: 'file',
            fileType: 'doc',
          },
          {
            label: '问题解答',
            level: 3,
            type: 'file',
            fileType: 'doc',
          },
          {
            label: '学习通',
            level: 3,
            type: 'file',
            fileType: 'doc',
          },
          {
            label: '高数MOOC',
            level: 3,
            type: 'file',
            fileType: 'doc',
          },
          {
            label: '实验数据',
            level: 3,
            type: 'file',
            fileType: 'doc',
          },
        ],
      },
      {
        label: '大二学期',
        level: 2,
        type: 'folder',
      },
    ],
  },
]

const data = reactive([
  {
    treeData: data1,
    showCheckbox: false,
  },
  {
    treeData: data2,
    showCheckbox: false,
  },
])
</script>

<template>
  <div>
    <Tree v-for="(item, index) in data" :key="index" :data="item.treeData" :show-checkbox="item.showCheckbox" />
  </div>
</template>

<style lang="scss" scoped>
</style>
