<script setup lang="ts">
import type { FileInfo } from '~/types/file'
import DocTree from '~/components/DocTree.vue'
import { useFileUpload } from '~/composables/useFileUpload'
import { useSpaceStore } from '~/stores/space'
import { addUidToNodes } from '~/utils'

// 定义事件
const emits = defineEmits<{
  (e: 'select', selection: { source: string, files: any[] }): void
  (e: 'cancel'): void
}>()

const { t } = useI18n()

// 上传来源对话框
const visible = ref(false)
const activeTab = ref('knowledge-base') // 'knowledge-base' | 'local'

// 模拟的知识库树数据 - 实际应该从服务器获取
const mockKnowledgeData = ref([
  {
    label: '文件夹',
    level: 1,
    type: 'folder',
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
        ],
      },
      {
        label: '机械制图',
        level: 2,
        type: 'folder',
      },
    ],
  },
])

// 知识库数据
const treeData = ref(addUidToNodes(mockKnowledgeData.value as FileTreeTypeWithOptionalId[]))

// 当前空间
const spaceStore = useSpaceStore()
const selectedSpaceId = ref(spaceStore.currentSpace?.id || '1')

// 空间列表选项
const spaceList = computed(() => {
  return [
    { label: t('knowledge_base.copy_dialog.personal_kb'), value: '1' },
    { label: t('knowledge_base.copy_dialog.team_kb'), value: '2' },
  ]
})

// 监听空间变化
watch(selectedSpaceId, (_newId) => {
  // 实际项目中应该从服务器获取对应空间的知识库数据
  // 这里使用模拟数据
})

// 选中的文件
const selectedFiles = ref<FileTreeType[]>([])

// 选中的节点ID
const checkedTreeNodeIds = ref<string[]>([])

// 处理树节点选中状态变更
function handleTreeCheckChange(ids: string[]) {
  checkedTreeNodeIds.value = ids

  // 根据ID查找对应的节点
  selectedFiles.value = []
  ids.forEach((id) => {
    const findNode = (nodes: FileTreeType[]): FileTreeType | undefined => {
      for (const node of nodes) {
        if (node.id === id && node.type === 'file') {
          return node
        }
        if (node.children) {
          const found = findNode(node.children)
          if (found)
            return found
        }
      }
      return undefined
    }

    const node = findNode(treeData.value)
    if (node)
      selectedFiles.value.push(node)
  })
}

// 本地文件上传
async function handleLocalUpload() {
  // 使用公共上传函数，但不直接添加到聊天
  const { handleFileSelect } = useFileUpload()
  const files = await handleFileSelect()

  // 关闭对话框并返回文件列表
  visible.value = false
  emits('select', {
    source: 'local',
    files,
  })
}

// 确认选择
function onConfirm() {
  visible.value = false
  emits('select', {
    source: activeTab.value,
    files: activeTab.value === 'knowledge-base' ? selectedFiles.value : [],
  })
}

// 取消选择
function onCancel() {
  visible.value = false
  emits('cancel')
}

// 对外暴露的接口
defineExpose({
  open() {
    visible.value = true
    // 重置状态
    selectedFiles.value = []
    checkedTreeNodeIds.value = []
    activeTab.value = 'knowledge-base'
  },
})
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="$t('agents.qa.upload_dialog.title')"
    width="860"
    :close-on-click-modal="false"
    align-center
  >
    <el-tabs v-model="activeTab" class="upload-tabs">
      <el-tab-pane name="knowledge-base" :label="$t('agents.qa.upload_dialog.from_knowledge_base')">
        <div class="kb-selection">
          <div class="mb-4">
            <el-form-item :label="$t('agents.qa.upload_dialog.select_space')" label-width="140px" label-position="left">
              <el-select v-model="selectedSpaceId" class="w-322px">
                <el-option
                  v-for="item in spaceList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </div>

          <!-- 文件树选择区域 -->
          <div class="tree-container h-300px w-full overflow-y-auto border-1 border-gray-200 rounded-4px border-solid p-4">
            <DocTree
              :data="treeData"
              :checkbox-visible="true"
              @check-change="handleTreeCheckChange"
            />
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane name="local" :label="$t('agents.qa.upload_dialog.from_local')">
        <div class="local-upload h-300px w-full flex items-center justify-center border-1 border-gray-200 rounded-4px border-solid p-4">
          <div class="flex flex-col items-center text-center">
            <div class="i-carbon:upload mb-4 text-48px text-gray-400" />
            <el-button type="primary" @click="handleLocalUpload">
              {{ $t('agents.qa.upload_dialog.select_files') }}
            </el-button>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="onCancel">
          {{ $t('common.actions.cancel') }}
        </el-button>
        <el-button type="primary" @click="onConfirm">
          {{ $t('common.actions.confirm') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.upload-tabs {
  margin-top: 10px;
}

.tree-container {
  min-height: 300px;
}

.local-upload {
  min-height: 300px;
  background-color: #fcfcfc;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f5f7fa;
  }

  .dark & {
    background-color: #1a1a1a;

    &:hover {
      background-color: #242424;
    }
  }
}
</style>
