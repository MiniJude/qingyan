<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { localData, wechatData } from '~/mock/knowledge-base'
import { addUidToNodes } from '~/utils'
import Tree from './Tree.vue'

const router = useRouter()

// 为树节点添加唯一ID
const treeData1WithUid = addUidToNodes(localData)
const treeData2WithUid = addUidToNodes(wechatData)

const data = reactive<{
  treeData: FileTreeType[]
  checkboxVisible: boolean
  checkedKeys: string[]
}[]>([
  {
    treeData: treeData1WithUid,
    checkboxVisible: false,
    checkedKeys: [],
  },
  {
    treeData: treeData2WithUid,
    checkboxVisible: false,
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
    data[index]!.checkboxVisible = false
  }
}

function handleNodeClick(data: FileTreeType, fileRoute: string[]) {
  if (data.type === 'file') {
    router.push({
      path: `/knowledge-base/${data.fileType}/${data.id}`,
    })

    // 存储当前文件路径
    useFileStore().setFileRoute(fileRoute)
  }
}

defineExpose({
  data,
})
</script>

<template>
  <div flex flex-col gap-4px>
    <div v-for="(item, index) in data" :key="index">
      <div v-if="item.checkboxVisible" mb-8px flex items-center justify-between>
        <span>选中 {{ item.checkedKeys.length }} 项</span>
        <span i-carbon:close-large cursor-pointer @click="cancelCheck(index)" />
      </div>
      <Tree ref="treeRef" v-model:checkbox-visible="item.checkboxVisible" :data="item.treeData" :editable="true" :checkable="true" @check-change="handleCheckChange($event, index)" @node-click="handleNodeClick" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>
