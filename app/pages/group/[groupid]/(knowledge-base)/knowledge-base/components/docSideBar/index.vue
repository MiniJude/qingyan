<script setup lang="ts">
import CircleDoc from '@/assets/svg/circle-doc.svg?skipsvgo'
import CreateTeamDialog from '@/components/team-setting/CreateTeamDialog.vue'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import CopyFormDialog from './CopyFormDialog.vue'
import DocTree from './docTree/index.vue'

const route = useRoute()
const spaceStore = useSpaceStore()
const { isMobileDevice } = useDeviceDetection()
const { appContext } = getCurrentInstance()!
const { t } = useI18n()

const docTreeRef = useTemplateRef<InstanceType<typeof DocTree>>('docTreeRef')
const createTeamDialogVisible = ref(false)

// 移动端抽屉状态
const isCollapsed = ref(isMobileDevice.value)

// 监听设备类型变化，自动调整抽屉状态
watch(isMobileDevice, (newValue) => {
  isCollapsed.value = newValue
})

// 切换抽屉显示/隐藏状态
function toggleDrawer() {
  isCollapsed.value = !isCollapsed.value
}

// 空间设置对话框相关
const spaceSettingVisible = ref(false)
const spaceSettingActiveTab = ref<'space-upgrade' | 'space-setting' | 'space-model' | 'space-member' | 'space-permission' | 'space-team' | 'space-trash'>('space-trash')

// 获取当前空间ID
const currentSpaceId = computed(() => spaceStore.currentSpace?.id || '1')

// 生成完整的路径
function getFullPath(path: string): string {
  return `/group/${currentSpaceId.value}${path}`
}

// 打开回收站
function openTrash() {
  spaceSettingActiveTab.value = 'space-trash'
  spaceSettingVisible.value = true
}

// 当前路由是否是全部文档（/knowledge-base）
const isAllDoc = computed(() => {
  // 检查路由路径是否以知识库结尾
  return route.path.endsWith('/knowledge-base')
})

// 是否是团队空间
const isTeamSpace = computed(() => {
  return spaceStore.currentSpace?.type === 'team'
})

/** 是否显示底部按钮组 */
const isBtnGroupShow = computed(() => {
  return docTreeRef.value?.data.some(item => item.checkboxVisible)
})

const allCheckedKeys = computed(() => {
  return docTreeRef.value?.data.map(item => item.checkedKeys).flat() ?? []
})

// 移动到
const folderData = [
  {
    value: '1',
    label: 'Level one 1',
    children: [
      {
        value: '1-1',
        label: 'Level two 1-1',
        children: [
          {
            value: '1-1-1',
            label: 'Level three 1-1-1',
          },
        ],
      },
    ],
  },
  {
    value: '2',
    label: 'Level one 2',
    children: [
      {
        value: '2-1',
        label: 'Level two 2-1',
        children: [
          {
            value: '2-1-1',
            label: 'Level three 2-1-1',
          },
        ],
      },
      {
        value: '2-2',
        label: 'Level two 2-2',
        children: [
          {
            value: '2-2-1',
            label: 'Level three 2-2-1',
          },
        ],
      },
    ],
  },
  {
    value: '3',
    label: 'Level one 3',
    children: [
      {
        value: '3-1',
        label: 'Level two 3-1',
        children: [
          {
            value: '3-1-1',
            label: 'Level three 3-1-1',
          },
        ],
      },
      {
        value: '3-2',
        label: 'Level two 3-2',
        children: [
          {
            value: '3-2-1',
            label: 'Level three 3-2-1',
          },
        ],
      },
    ],
  },
]

// 移动到
const moveFormVisible = ref(false)
const moveForm = ref({
  folderId: '',
})

// 删除确认对话框
const deleteDialogVisible = ref(false)

// 删除按钮点击事件
function handleDelete() {
  deleteDialogVisible.value = true
}

// 确认删除
async function confirmDelete() {
  try {
    // 这里添加删除文件的API调用
    // const result = await $api(`/api/knowledge-base/delete`, {
    //   method: 'POST',
    //   body: { fileIds: allCheckedKeys.value },
    // })

    // 暂时使用模拟的删除成功
    ElMessage.success({ message: t('common.messages.deleted'), duration: 2000 }, appContext)

    // 关闭对话框
    deleteDialogVisible.value = false

    // 刷新文档树
    refreshTree()
  }
  catch (error) {
    console.error('删除文件失败:', error)
    ElMessage.error({ message: t('common.messages.operation_failed', { operation: t('knowledge_base.delete') }), duration: 2000 }, appContext)
  }
}

// 刷新文档树
async function refreshTree() {
  if (docTreeRef.value) {
    const knowledgeBaseData = await $api<FileTreeType[]>(`/mock-api/knowledge-base?spaceId=${currentSpaceId.value}`)

    if (Array.isArray(knowledgeBaseData)) {
      docTreeRef.value.data = knowledgeBaseData.map(item => ({
        treeData: [item],
        checkboxVisible: false,
        checkedKeys: [],
      }))
    }
  }
}

// 取消删除
function cancelDelete() {
  deleteDialogVisible.value = false
}

// 团队创建回调
function handleTeamCreated(_team: any) {
  // 处理团队创建成功后的逻辑
  // 这里可以添加团队创建后的业务逻辑
}

const copyFormDialogRef = useTemplateRef<InstanceType<typeof CopyFormDialog>>('copyFormDialogRef')
</script>

<template>
  <div
    class="doc-side-bar-wrapper"
  >
    <div
      class="doc-side-bar"
      :class="{ collapsed: isCollapsed }"
      p="t-28px r-16px b-18px l-16px"
      flex="~ col"
    >
      <!-- 移动端展开/收起按钮 -->
      <div
        v-if="isMobileDevice"
        class="drawer-toggle-btn"
        @click="toggleDrawer"
      >
        <el-icon size="20">
          <component :is="isCollapsed ? ArrowRight : ArrowLeft" />
        </el-icon>
      </div>

      <!-- 顶部按钮（全部文档） -->
      <NuxtLink :to="getFullPath('/knowledge-base')">
        <div class="all-doc-btn" :class="{ active: isAllDoc }">
          <CircleDoc />
          <span ml-12px text-16px>{{ $t('knowledge_base.all_documents') }}</span>
        </div>
      </NuxtLink>

      <!-- 文档树 -->
      <div flex="~ col 1">
        <DocTree ref="docTreeRef" />
        <!-- 新建团队按钮 -->
        <div v-if="isTeamSpace" class="mb-24px mt-40px">
          <div class="create-team-btn" @click="createTeamDialogVisible = true">
            <span ml-12px text-16px>{{ $t('knowledge_base.create_team') }}</span>
          </div>
        </div>
        <div class="trash-link" @click="openTrash">
          <div flex cursor-pointer items-center gap-10px>
            <SvgoTrash />
            <span text-tprimary>{{ $t('knowledge_base.trash') }}</span>
          </div>
        </div>
      </div>

      <!-- 底部按钮组（移动到、创建副本、删除） -->
      <div v-if="isBtnGroupShow" class="btn-group" mt-16px flex justify-between>
        <el-button plain :disabled="!allCheckedKeys.length" @click="copyFormDialogRef?.open()">
          {{ $t('knowledge_base.create_copy') }}
        </el-button>
        <el-button plain :disabled="!allCheckedKeys.length" @click="moveFormVisible = true">
          {{ $t('knowledge_base.move_to') }}
        </el-button>
        <el-button plain :disabled="!allCheckedKeys.length" @click="handleDelete">
          {{ $t('knowledge_base.delete') }}
        </el-button>
      </div>

      <!-- 弹框：移动到 -->
      <el-dialog v-model="moveFormVisible" :title="$t('knowledge_base.move_to')" width="600" :show-close="false" align-center>
        <el-form :model="moveForm" size="large">
          <el-form-item :label="$t('knowledge_base.select_folder')" label-width="140px" label-position="left">
            <el-tree-select
              v-model="moveForm.folderId"
              :data="folderData"
              :check-strictly="true"
              :render-after-expand="false"
              :placeholder="$t('knowledge_base.please_select')"
              class="!w-322px"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button plain @click="moveFormVisible = false">
              {{ $t('knowledge_base.cancel') }}
            </el-button>
            <el-button type="primary" @click="moveFormVisible = false">
              {{ $t('knowledge_base.confirm') }}
            </el-button>
          </div>
        </template>
      </el-dialog>

      <!-- 弹框：删除确认 -->
      <el-dialog
        v-model="deleteDialogVisible"
        :title="$t('knowledge_base.delete_confirm.title')"
        width="400"
        align-center
      >
        <span>{{ $t('knowledge_base.delete_confirm.message') }}</span>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="cancelDelete">{{ $t('knowledge_base.delete_confirm.cancel') }}</el-button>
            <el-button type="primary" @click="confirmDelete">
              {{ $t('knowledge_base.delete_confirm.confirm') }}
            </el-button>
          </span>
        </template>
      </el-dialog>

      <!-- 弹框：创建副本 -->
      <CopyFormDialog ref="copyFormDialogRef" />
      <!-- 弹框：新建团队 -->
      <CreateTeamDialog
        v-model="createTeamDialogVisible"
        @team-created="handleTeamCreated"
      />
      <!-- 弹框：空间设置 -->
      <SpaceSetting
        v-model="spaceSettingVisible"
        v-model:active-tab="spaceSettingActiveTab"
      />
    </div>

    <!-- 移动端蒙层 -->
    <div
      v-if="isMobileDevice && !isCollapsed"
      class="mobile-overlay"
      @click="toggleDrawer"
    />
  </div>
</template>

<style lang="scss" scoped>
.doc-side-bar-wrapper {
  position: relative;
  height: 100%;
}

.doc-side-bar {
  border-right: 1px solid var(--app-border-regular);
  position: relative;
  height: 100%;
  width: 263px;
  transition: transform 0.3s ease;

  @media (max-width: 767px) {
    position: fixed;
    top: 0;
    left: 0;
    width: 263px;
    height: 100%;
    background-color: var(--el-bg-color);
    z-index: 1000;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

    &.collapsed {
      transform: translateX(-100%);
    }
  }

  .drawer-toggle-btn {
    position: absolute;
    top: 50%;
    right: -32px;
    width: 32px;
    height: 40px;
    background-color: var(--el-color-primary);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 0 4px 4px 0;
    z-index: 1000;
    transform: translateY(-50%);
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
    transition: right 0.3s ease;
  }

  .all-doc-btn {
    color: var(--el-color-primary);
    border-radius: 4px;
    display: flex;
    width: 100%;
    align-items: center;
    font-size: 18px;
    padding: 9px;
    height: 44px;
    justify-content: start;
    border: 1px solid var(--el-color-primary);
    cursor: pointer;
    &.active {
      background-color: var(--el-color-primary);
      color: white;
      cursor: auto;
    }
  }

  .create-team-btn {
    color: var(--el-color-primary);
    border-radius: 4px;
    display: flex;
    width: 100%;
    align-items: center;
    font-size: 18px;
    padding: 9px;
    height: 44px;
    justify-content: start;
    border: 1px solid var(--el-color-primary);
    cursor: pointer;
  }

  .trash-link {
    cursor: pointer;
    padding: 8px;
    border-radius: 4px;

    &:hover {
      background-color: var(--el-color-primary-light-9);
    }
  }

  .btn-group {
    .el-button {
      margin: 0;
    }
  }
}

.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  backdrop-filter: blur(2px);
}
</style>
