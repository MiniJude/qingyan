<script lang="ts" setup>
import type { ElTree } from 'element-plus'
import ArrowRightFilled from '@/assets/svg/arrow-right-filled.svg?component'
import Folder from '@/assets/svg/folder.svg?component'
import { Link } from '@element-plus/icons-vue'

interface Props {
  data: FileTreeType[]
  checkboxVisible?: boolean
  editable?: boolean
  checkable?: boolean
  isTeamSpace?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  editable: false,
  checkable: false,
  checkboxVisible: false,
  isTeamSpace: false,
})

const emits = defineEmits<{
  (e: 'update:checkboxVisible', value: boolean): void
  (e: 'checkChange', data: string[]): void
  (e: 'nodeClick', data: FileTreeType, fileRoute: string[]): void
  (e: 'addFolder', parentId: string, name: string): void
  (e: 'addFile', parentId: string, templateId: string): void
  (e: 'openTeamSetting', activeMenu: string, teamName: string): void
}>()

const { isMobileDevice } = useDeviceDetection()

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

// 判断是否显示用户图标
function showTeamIcon(nodeLabel: string): boolean {
  return props.isTeamSpace && nodeLabel !== '个人' && nodeLabel !== '全体成员'
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

// 新增操作相关
const currentNode = ref<FileTreeType | null>(null)
const newFolderDialogVisible = ref(false)
const templateLibraryVisible = ref(false)
const newFolderName = ref('')

// 处理添加菜单命令
function handleAddCommand(command: string, node: FileTreeType) {
  currentNode.value = node

  if (command === 'folder') {
    newFolderDialogVisible.value = true
  }
  else if (command === 'file' && node.level !== 1) {
    // 只有非一级节点才能添加文件
    templateLibraryVisible.value = true
  }
}

// 确认新建文件夹
function confirmAddFolder() {
  if (newFolderName.value.trim() && currentNode.value) {
    emits('addFolder', currentNode.value.id, newFolderName.value.trim())
    newFolderName.value = ''
    newFolderDialogVisible.value = false
  }
}

// 处理模板选择
function handleSelectTemplate(template: any) {
  if (currentNode.value) {
    emits('addFile', currentNode.value.id, template.id)
  }
}

// 打开团队设置
function openTeamSetting(activeMenu: string, teamName: string) {
  emits('openTeamSetting', activeMenu, teamName)
}

// 绑定微信弹框
const bindWechatDialogVisible = ref(false)
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
        <template v-if="props.editable">
          <div flex gap-5px style="color: #C9CDD4;" @click.stop>
            <el-icon v-if="node.label === '微信输入' && data.level === 1" @click="bindWechatDialogVisible = true">
              <Link />
            </el-icon>
            <div class="relative">
              <el-dropdown trigger="click" @command="(command) => handleAddCommand(command, data)">
                <div class="cursor-pointer">
                  <SvgoPlus />
                </div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="folder">
                      <div flex items-center>
                        <div class="i-carbon:folder-add mr-8px" />
                        {{ $t('knowledge_base.new_folder') }}
                      </div>
                    </el-dropdown-item>
                    <el-dropdown-item v-if="data.level !== 1" command="file">
                      <div flex items-center>
                        <div class="i-carbon:document-add mr-8px" />
                        {{ $t('knowledge_base.new_file') }}
                      </div>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>

            <template v-if="data.level === 1">
              <template v-if="showTeamIcon(node.label)">
                <div class="i-carbon:user" @click="openTeamSetting('permission', node.label)" />
                <div class="i-carbon:overflow-menu-horizontal" @click="openTeamSetting('more-settings', node.label)" />
              </template>
              <template v-if="!showTeamIcon(node.label)">
                <SvgoMultiSelect v-if="!props.checkboxVisible" @click="emits('update:checkboxVisible', true)" />
                <div v-else class="i-carbon:filter-reset" @click="emits('update:checkboxVisible', false)" />
              </template>
            </template>
          </div>
        </template>
      </div>
    </template>
  </el-tree>

  <!-- 新建文件夹对话框 -->
  <el-dialog
    v-model="newFolderDialogVisible"
    :title="$t('knowledge_base.create_folder')"
    width="400px"
    :close-on-click-modal="false"
  >
    <el-form @submit.prevent="confirmAddFolder">
      <el-form-item :label="$t('knowledge_base.folder_name')" required>
        <el-input
          v-model="newFolderName"
          :placeholder="$t('knowledge_base.please_input_folder_name')"
          autofocus
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div flex justify-end gap-10px>
        <el-button @click="newFolderDialogVisible = false">
          {{ $t('common.actions.cancel') }}
        </el-button>
        <el-button type="primary" :disabled="!newFolderName.trim()" @click="confirmAddFolder">
          {{ $t('common.actions.confirm') }}
        </el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 模板库对话框 -->
  <TemplateLibraryDialog
    v-model="templateLibraryVisible"
    @select-template="handleSelectTemplate"
  />

  <!-- 绑定微信弹框 -->
  <el-dialog v-model="bindWechatDialogVisible" :title="$t('header.user_profile.wechat_assistant')" :fullscreen="isMobileDevice">
    <WechatAssistantPanel />
  </el-dialog>
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
