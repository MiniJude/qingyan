<script lang="ts" setup>
import ArrowRightFilled from '@/assets/svg/arrow-right-filled.svg?component'
import DocIcon from '@/assets/svg/doc.svg?component'
import Folder from '@/assets/svg/folder.svg?component'
import PptIcon from '@/assets/svg/ppt.svg?component'

export interface TreeType {
  label: string
  children?: TreeType[]
  level?: number
  type?: 'folder' | 'file'
  fileType?: 'doc' | 'pdf' | 'ppt' | 'excel' | 'txt' | 'other'
}

const props = defineProps<{
  data: TreeType[]
  showCheckbox: boolean
}>()

const emits = defineEmits<{
  (e: 'update:showCheckbox', value: boolean): void
  (e: 'multi-select', data: TreeType): void
}>()

function handleNodeClick(data: TreeType) {
  emits('node-click', data)
}
</script>

<template>
  <el-tree
    style="max-width: 600px"
    :data="props.data"
    :icon="ArrowRightFilled"
    :show-checkbox="props.showCheckbox"
    @node-click="handleNodeClick"
  >
    <template #default="{ node, data }">
      <div class="custom-tree-node" flex items-center justify-between>
        <Folder v-if="data.type === 'folder'" mr-7px h-12px w-12px />
        <template v-else-if="data.type === 'file'">
          <DocIcon v-if="data.fileType === 'doc'" mr-7px h-12px w-12px />
          <PptIcon v-if="data.fileType === 'ppt'" mr-7px h-12px w-12px />
        </template>

        <span flex-1>{{ node.label }}</span>
        <div v-if="data.level === 1 && !props.showCheckbox" flex gap-5px style="color: #C9CDD4;" @click.stop>
          <SvgoPlus />
          <SvgoMultiSelect @click="emits('update:showCheckbox', true)" />
        </div>
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
          // background-color: var(--el-color-primary);
          // color: white;
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
