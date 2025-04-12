<script setup lang="ts">
import type { ApiResponse, Space } from '~/utils/api-types'
import { ElPopover } from 'element-plus'
import CreateSpaceForm from './CreateSpaceForm.vue'
import SpaceTypeSelector from './SpaceTypeSelector.vue'

defineProps<{
  isCollapsed: boolean
}>()

const { t } = useI18n()

// 当前选中的空间
const currentSpace = ref<Space>({
  id: '1',
  name: t('sidebar.personal_space'),
  type: 'personal',
  owner: '',
  createdAt: new Date(),
  updatedAt: new Date(),
})

// 空间列表数据
const spaceList = ref<Space[]>([])
const loading = ref(false)

// 加载空间列表
async function loadSpaces() {
  loading.value = true

  try {
    const response = await $api<ApiResponse<Space[]>>('/mock-api/spaces')

    if (response.code === 20000 && Array.isArray(response.data) && response.data.length > 0) {
      spaceList.value = response.data

      // 如果当前选中的空间不在列表中，则选择第一个
      const currentSpaceExists = spaceList.value.some(space => space.id === currentSpace.value.id)
      if (!currentSpaceExists) {
        currentSpace.value = spaceList.value[0] as Space
      }
    }
    else {
      // 使用默认数据
      setDefaultSpaces()
    }
  }
  catch (error) {
    console.error('加载空间列表失败', error)
    // 使用默认数据
    setDefaultSpaces()
  }
  finally {
    loading.value = false
  }
}

// 设置默认空间数据
function setDefaultSpaces() {
  const defaultSpaces: Space[] = [
    {
      id: '1',
      name: t('sidebar.personal_space'),
      type: 'personal',
      owner: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: t('sidebar.team_space'),
      type: 'team',
      owner: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  spaceList.value = defaultSpaces

  // 确保当前选中的空间是列表中的第一个
  currentSpace.value = defaultSpaces[0]
}

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
async function handleCreateSpaceSubmit(values: { name: string, description: string }) {
  try {
    const response = await $api<ApiResponse<Space>>('/mock-api/spaces', {
      method: 'POST',
      body: {
        name: values.name,
        description: values.description,
        type: createSpaceType.value,
      },
    })

    if (response.code === 20000 && response.data) {
      // 添加新创建的空间到列表
      spaceList.value.push(response.data)
      // 切换到新创建的空间
      // @ts-expect-error - 类型不匹配，临时忽略
      currentSpace.value = response.data
      ElMessage.success(t('space.create_success'))
    }
  }
  catch (error) {
    console.error('创建空间失败', error)
    ElMessage.error(t('space.create_failed'))
  }

  showCreateDialog.value = false
}

// 初始加载
onMounted(() => {
  loadSpaces()
})
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
