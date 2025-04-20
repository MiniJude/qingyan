<script setup lang="ts">
import CircleDoc from '@/assets/svg/circle-doc.svg?skipsvgo'
import CreateTeamDialog from '@/components/team-setting/CreateTeamDialog.vue'
import CopyFormDialog from './CopyFormDialog.vue'
import DocTree from './docTree/index.vue'

const route = useRoute()
const spaceStore = useSpaceStore()

const docTreeRef = useTemplateRef<InstanceType<typeof DocTree>>('docTreeRef')
const createTeamDialogVisible = ref(false)

// 获取当前空间ID
const currentSpaceId = computed(() => spaceStore.currentSpace?.id || '1')

// 生成完整的路径
function getFullPath(path: string): string {
  return `/group/${currentSpaceId.value}${path}`
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

// 团队创建回调
function handleTeamCreated(_team: any) {
  // 处理团队创建成功后的逻辑
  // 这里可以添加团队创建后的业务逻辑
}

const copyFormDialogRef = useTemplateRef<InstanceType<typeof CopyFormDialog>>('copyFormDialogRef')
</script>

<template>
  <div class="doc-side-bar" p="t-28px r-16px b-18px l-16px" h-full w-263px flex="~ col">
    <!-- 顶部按钮（全部文档） -->
    <NuxtLink :to="getFullPath('/knowledge-base')" class="mb-24px">
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
      <NuxtLink :to="getFullPath('/knowledge-base/trush')">
        <div flex cursor-pointer items-center gap-10px>
          <SvgoTrash />
          <span text-tprimary>{{ $t('knowledge_base.trash') }}</span>
        </div>
      </NuxtLink>
    </div>

    <!-- 底部按钮组（移动到、创建副本、删除） -->
    <div v-if="isBtnGroupShow" class="btn-group" mt-16px flex justify-between>
      <el-button plain :disabled="!allCheckedKeys.length" @click="copyFormDialogRef?.open()">
        {{ $t('knowledge_base.create_copy') }}
      </el-button>
      <el-button plain :disabled="!allCheckedKeys.length" @click="moveFormVisible = true">
        {{ $t('knowledge_base.move_to') }}
      </el-button>
      <el-button plain :disabled="!allCheckedKeys.length">
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
    <!-- 弹框：创建副本 -->
    <CopyFormDialog ref="copyFormDialogRef" />
    <!-- 弹框：新建团队 -->
    <CreateTeamDialog
      v-model="createTeamDialogVisible"
      @team-created="handleTeamCreated"
    />
  </div>
</template>

<style lang="scss" scoped>
.doc-side-bar {
  border-right: 1px solid var(--app-border-regular);

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

  .btn-group {
    .el-button {
      margin: 0;
    }
  }
}
</style>
