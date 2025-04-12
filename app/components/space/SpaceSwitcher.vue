<script setup lang="ts">
import { ElPopover } from 'element-plus'
import CreateSpaceForm from './CreateSpaceForm.vue'
import SpaceTypeSelector from './SpaceTypeSelector.vue'

interface Space {
  id: string
  name: string
  type: 'personal' | 'team'
}

defineProps<{
  isCollapsed: boolean
}>()

const { t } = useI18n()

// 当前选中的空间
const currentSpace = ref<Space>({
  id: '1',
  name: t('sidebar.personal_space'),
  type: 'personal',
})

// 模拟空间列表数据
const spaceList = ref<Space[]>([
  {
    id: '1',
    name: t('sidebar.personal_space'),
    type: 'personal',
  },
  {
    id: '2',
    name: t('sidebar.team_space'),
    type: 'team',
  },
])

// 切换空间
function handleSpaceSwitch(space: Space) {
  currentSpace.value = space
}

// 创建空间相关
const showCreateDialog = ref(false)
const createSpaceType = ref<'personal' | 'team'>('personal')
const createSpaceFormRef = ref()

// 打开创建空间弹框
function openCreateSpaceDialog(type: 'personal' | 'team') {
  createSpaceType.value = type
  showCreateDialog.value = true
}

// 处理表单提交
async function handleCreateSpaceSubmit(_values: { name: string, description: string }) {
  // TODO: 调用创建空间API，创建类型：createSpaceType.value，表单数据：values
  showCreateDialog.value = false
}
</script>

<template>
  <ElPopover
    placement="right-start"
    :width="242"
    trigger="click"
    popper-class="space-switcher-popover"
  >
    <template #reference>
      <div
        m="l-4px b-12px t-10px"
        h-35px
        flex
        cursor-pointer
        items-center
      >
        <div text="white 10px" h-36px w-36px flex-center flex-shrink-0 rounded-5px bg-primary px-4px text-center>
          {{ currentSpace.name.slice(0, 2) }}
        </div>
        <template v-if="!isCollapsed">
          <span m="l-21px" flex-1 whitespace-nowrap>{{ currentSpace.name }}</span>
          <div i-carbon:chevron-right h-20px w-20px />
        </template>
      </div>
    </template>

    <!-- Popover 内容 -->
    <div class="space-list">
      <div text-14px font-500 p="x-16px y-12px">
        {{ $t('space.switch_space') }}
      </div>

      <!-- 空间列表 -->
      <div class="space-items">
        <div
          v-for="space in spaceList"
          :key="space.id"
          class="space-item"
          :class="{ active: currentSpace.id === space.id }"
          @click="handleSpaceSwitch(space)"
        >
          <div text="10px white" h-36px w-36px flex-center flex-shrink-0 rounded-5px bg-primary px-4px text-center>
            {{ space.name.slice(0, 2) }}
          </div>
          <span ml-12px flex-1>{{ space.name }}</span>
          <div
            v-if="currentSpace.id === space.id"
            i-carbon:checkmark
            text-primary
          />
        </div>
      </div>

      <el-divider class="!my-8px" />

      <!-- 创建新空间按钮 -->
      <div
        class="create-space-btn"
        @click="openCreateSpaceDialog('personal')"
      >
        <div i-carbon:add-alt h-20px w-20px />
        <span ml-8px>{{ $t('common.actions.create') }}</span>
      </div>
    </div>
  </ElPopover>

  <!-- 创建空间弹框 -->
  <el-dialog
    v-model="showCreateDialog"
    :title="$t('space.create_dialog.title')"
    width="600px"
    :destroy-on-close="true"
  >
    <div class="create-space-container">
      <!-- 空间类型选择器 -->
      <SpaceTypeSelector
        v-model="createSpaceType"
      />

      <!-- 空间表单 -->
      <CreateSpaceForm
        ref="createSpaceFormRef"
        :type="createSpaceType"
        @submit="handleCreateSpaceSubmit"
      />
    </div>

    <!-- 底部按钮 -->
    <template #footer>
      <div flex justify-end gap-12px>
        <el-button @click="showCreateDialog = false">
          {{ $t('common.actions.cancel') }}
        </el-button>
        <el-button
          type="primary"
          @click="createSpaceFormRef?.handleSubmit()"
        >
          {{ $t('common.actions.create') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.space-items {
  max-height: 300px;
  overflow-y: auto;
}

.space-item {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.space-item:hover {
  background-color: var(--el-color-primary-light-9);
}

.space-item.active {
  background-color: var(--el-color-primary-light-9);
}

.create-space-btn {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  color: var(--el-color-primary);
  transition: all 0.3s ease;
}

.create-space-btn:hover {
  background-color: var(--el-color-primary-light-9);
}

.create-space-container {
  display: flex;
  flex-direction: column;
}
</style>
