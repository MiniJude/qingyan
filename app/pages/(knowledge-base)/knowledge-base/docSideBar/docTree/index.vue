<script lang="ts" setup>
import type { TreeType } from './Tree.vue'
import { useId } from 'vue'
import Tree from './Tree.vue'

// 递归为树节点添加唯一ID
function addUidToNodes(nodes: TreeType[]): TreeType[] {
  return nodes.map((node) => {
    const nodeWithUid = {
      ...node,
      id: useId(),
    }

    if (nodeWithUid.children && nodeWithUid.children.length > 0) {
      nodeWithUid.children = addUidToNodes(nodeWithUid.children)
    }

    return nodeWithUid
  })
}

type OptionalIdTree<T extends { children?: T[] }> = Omit<T, 'id' | 'children'> & {
  id?: string
  children?: OptionalIdTree<T>[]
}

type TreeTypeWithOptionalId = OptionalIdTree<TreeType>
const data1: TreeTypeWithOptionalId[] = [
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
const data2: TreeTypeWithOptionalId[] = [
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
            fileType: 'wechat-article',
          },
          {
            label: '问题解答',
            level: 3,
            type: 'file',
            fileType: 'wechat-records',
          },
          {
            label: '学习通',
            level: 3,
            type: 'file',
            fileType: 'url',
          },
          {
            label: '高数MOOC',
            level: 3,
            type: 'file',
            fileType: 'link',
          },
          {
            label: '实验数据',
            level: 3,
            type: 'file',
            fileType: 'picture',
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

// 为树节点添加唯一ID
const treeData1WithUid = addUidToNodes(data1)
const treeData2WithUid = addUidToNodes(data2)

const data = reactive<{
  treeData: TreeType[]
  showCheckbox: boolean
  checkedKeys: string[]
}[]>([
  {
    treeData: treeData1WithUid,
    showCheckbox: false,
    checkedKeys: [],
  },
  {
    treeData: treeData2WithUid,
    showCheckbox: false,
    checkedKeys: [],
  },
])

function handleCheckChange(checkedKeys: string[], index: number) {
  data[index]!.checkedKeys = checkedKeys
}

const treeRef = useTemplateRef<InstanceType<typeof Tree>[]>('treeRef')

function cancelCheck(index: number) {
  if (treeRef.value) {
    treeRef.value[index]?.setCheckedKeys([])
    data[index]!.showCheckbox = false
  }
}
</script>

<template>
  <div flex flex-col gap-4px>
    <div v-for="(item, index) in data" :key="index">
      <div v-if="item.showCheckbox" mb-8px flex items-center justify-between>
        <span>选中 {{ item.checkedKeys.length }} 项</span>
        <span i-carbon:close-large cursor-pointer @click="cancelCheck(index)" />
      </div>
      <Tree ref="treeRef" v-model:show-checkbox="item.showCheckbox" :data="item.treeData" @check-change="handleCheckChange($event, index)" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>
