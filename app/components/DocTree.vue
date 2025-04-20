<script lang="ts" setup>
import type { ElTree } from 'element-plus'
import ArrowRightFilled from '@/assets/svg/arrow-right-filled.svg?component'
import Folder from '@/assets/svg/folder.svg?component'

interface Props {
  data: FileTreeType[]
  checkboxVisible?: boolean
  editable?: boolean
  checkable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  editable: false,
  checkable: false,
  checkboxVisible: false,
})

const emits = defineEmits<{
  (e: 'update:checkboxVisible', value: boolean): void
  (e: 'checkChange', data: string[]): void
  (e: 'nodeClick', data: FileTreeType, fileRoute: string[]): void
}>()

// 默认展开一级节点
const defaultExpandedKeys = ref<string[]>([])
onMounted(() => {
  defaultExpandedKeys.value = props.data.filter(item => item.level === 1).map(item => item.id)
})

function handleNodeClick(data: FileTreeType, node: any) {
  // 递归寻找node.parent.label
  const getFileRoute = (node: any): string => {
    const label = node.data.label

    if (!node.parent || node.parent.level === 0)
      return label

    return `${getFileRoute(node.parent)}/${label}`
  }
  const fileRouteStr = getFileRoute(node)

  emits('nodeClick', data, fileRouteStr.split('/').filter(Boolean))
}

const treeRef = useTemplateRef<InstanceType<typeof ElTree>>('treeRef')
// 选中的节点
const checkedKeys = ref<string[]>([])
function handleCheckChange() {
  checkedKeys.value = treeRef.value?.getCheckedKeys() as string[]
  emits('checkChange', checkedKeys.value)
}
function setCheckedKeys(keys: string[]) {
  treeRef.value?.setCheckedKeys(keys)
}
defineExpose({
  setCheckedKeys,
})
</script>

<template>
  <el-tree
    ref="treeRef"
    :data="props.data"
    :icon="ArrowRightFilled"
    :show-checkbox="props.checkboxVisible"
    :check-strictly="true"
    :expand-on-click-node="false"
    :check-on-click-leaf="false"
    node-key="id"
    :draggable="true"
    :default-expanded-keys="defaultExpandedKeys"
    @check-change="handleCheckChange"
    @node-click="handleNodeClick"
  >
    <template #default="{ node, data }">
      <div class="custom-tree-node" flex items-center justify-between>
        <Folder v-if="data.type === 'folder'" mr-7px h-12px w-12px color-tregular />
        <template v-else-if="data.type === 'file'">
          <FileIcon :file-type="data.fileType" mr-7px :size="12" />
        </template>

        <span flex-1>{{ node.label }}</span>
        <template v-if="data.level === 1">
          <div v-if="!props.checkboxVisible" flex gap-5px style="color: #C9CDD4;" @click.stop>
            <SvgoPlus v-if="props.editable" />
            <SvgoMultiSelect v-if="props.editable" @click="emits('update:checkboxVisible', true)" />
          </div>
          <div v-else flex gap-5px style="color: #C9CDD4;" @click.stop>
            <div class="i-carbon:filter-reset" @click="emits('update:checkboxVisible', false)" />
          </div>
        </template>
      </div>
    </template>
  </el-tree>
</template>

<style lang="scss" scoped>
.el-tree {
  :deep(.el-tree-node) {
    &:focus {
      > .el-tree-node__content {
        background-color: transparent;

        .custom-tree-node {
        }
      }
    }

    .el-tree-node__content {
      > label.el-checkbox {
        margin-right: 0;
      }
      &:hover {
        background-color: transparent;
        .custom-tree-node {
          // background-color: var(--el-color-primary);
          // color: white;
        }
      }

      .custom-tree-node {
        height: 100%;
        display: flex;
        align-items: center;
        padding-left: 6px;
        flex: 1;
        border-radius: 4px;
        transition: background-color 0.3s ease;
      }

      > .el-tree-node__expand-icon {
        padding: 0;
        font-size: 9px;
        margin-right: 4px;
      }
    }
  }

  //   一级节点样式控制
  > :deep(.el-tree-node) {
    > .el-tree-node__content {
      .custom-tree-node {
        font-size: 16px;
      }
    }
  }
}

// 复选框样式调整
:deep(.el-checkbox) {
  .el-checkbox__input {
    .el-checkbox__inner {
      border-color: var(--el-text-color-primary);
    }

    &.is-checked {
      .el-checkbox__inner {
        background-color: white;
        &::after {
          border-color: var(--el-color-primary);
        }
      }
    }
    &.is-indeterminate {
      .el-checkbox__inner {
        background-color: white;
        &::before {
          background-color: var(--el-color-primary);
        }
      }
    }
  }
}
</style>
