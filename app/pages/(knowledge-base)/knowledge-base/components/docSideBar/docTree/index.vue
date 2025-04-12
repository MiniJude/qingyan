<script lang="ts" setup>
import { useFileStore } from '~/stores/file'
import { useSpaceStore } from '~/stores/space'
import { addUidToNodes } from '~/utils'

const localePath = useLocalePath()
const spaceStore = useSpaceStore()

// 响应式数据结构
const data = reactive<{
  treeData: FileTreeType[]
  checkboxVisible: boolean
  checkedKeys: string[]
}[]>([
  {
    treeData: [], // 本地数据
    checkboxVisible: false,
    checkedKeys: [],
  },
  {
    treeData: [], // 待归档数据
    checkboxVisible: false,
    checkedKeys: [],
  },
  {
    treeData: [], // 微信数据
    checkboxVisible: false,
    checkedKeys: [],
  },
])

// 加载状态
const loading = ref(false)

// 加载知识库数据
async function loadKnowledgeBaseData() {
  if (!spaceStore.currentSpace)
    return

  loading.value = true
  try {
    const spaceId = spaceStore.currentSpace.id
    const knowledgeBaseData = await $api<FileTreeTypeWithOptionalId[]>(`/mock-api/knowledge-base?spaceId=${spaceId}`)

    if (Array.isArray(knowledgeBaseData)) {
      // 将API返回的数据转换成有ID的树结构
      const treeDataWithUid = knowledgeBaseData.map(item => addUidToNodes([item])).flat()

      // 根据数据类型分配到不同的树中
      data.forEach((item, index) => {
        // 简单区分不同类型的数据（可根据实际需求调整）
        if (index === 0) {
          // 本地数据 - 查找文件夹类型
          item.treeData = treeDataWithUid.filter(node =>
            node.label === '文件夹'
            || node.label.includes('文档'),
          )
        }
        else if (index === 1) {
          // 待归档数据
          item.treeData = treeDataWithUid.filter(node =>
            node.label === '待归档'
            || node.label.includes('归档'),
          )
        }
        else if (index === 2) {
          // 微信数据
          item.treeData = treeDataWithUid.filter(node =>
            node.label === '微信输入'
            || node.label.includes('微信'),
          )
        }
      })
    }
    else {
      console.error('获取知识库数据格式错误')
    }
  }
  catch (error) {
    console.error('获取知识库数据失败', error)
  }
  finally {
    loading.value = false
  }
}

// 监听当前空间变化，重新加载知识库数据
watch(() => spaceStore.currentSpace?.id, (newSpaceId, oldSpaceId) => {
  if (newSpaceId && newSpaceId !== oldSpaceId) {
    loadKnowledgeBaseData()
  }
}, { immediate: true })

// 处理节点选中状态变更
function handleCheckChange(checkedKeys: string[], index: number) {
  data[index]!.checkedKeys = checkedKeys
}

const treeRef = useTemplateRef<HTMLElement[]>('treeRef')

// 处理节点点击
function handleNodeClick(data: FileTreeType, fileRoute: string[]) {
  if (data.type === 'file') {
    navigateTo(localePath(`/knowledge-base/${data.fileType}/${data.id}` as I18nRoutePath))

    // 存储当前文件路径
    useFileStore().setFileRoute(fileRoute)
  }
}

defineExpose({
  data,
})
</script>

<template>
  <div class="kb-tree-container">
    <div v-if="loading" class="h-full w-full flex items-center justify-center">
      <el-skeleton :rows="8" animated />
    </div>
    <div v-else>
      <div v-for="(item, index) in data" :key="index">
        <DocTree
          v-if="item.treeData.length > 0"
          ref="treeRef"
          :data="item.treeData"
          :checkbox-visible="item.checkboxVisible"
          editable
          @update:checkbox-visible="item.checkboxVisible = $event"
          @check-change="keys => handleCheckChange(keys, index)"
          @node-click="handleNodeClick"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.kb-tree-container {
  width: 100%;
  height: 100%;
}
</style>
