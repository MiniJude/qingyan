<script setup lang="ts">
import type { Space } from '~/utils/api-types'
import { ElPopover } from 'element-plus'
import CreateSpaceForm from './CreateSpaceForm.vue'
import SpaceTypeSelector from './SpaceTypeSelector.vue'

defineProps<{
  isCollapsed: boolean
}>()

const { t } = useI18n()
const spaceStore = useSpaceStore()

// 控制Popover显示
const popoverVisible = ref(false)

// 创建空间相关
const showCreateDialog = ref(false)
const createSpaceType = ref<'personal' | 'team'>('personal')
const createSpaceFormRef = ref()

// 打开创建空间弹框
function openCreateSpaceDialog(type: 'personal' | 'team') {
  createSpaceType.value = type
  showCreateDialog.value = true
  // 关闭切换面板
  popoverVisible.value = false
}

// 处理表单提交
async function handleCreateSpaceSubmit(values: { name: string, description: string }) {
  const newSpace = await spaceStore.createSpace({
    name: values.name,
    description: values.description,
    type: createSpaceType.value,
  })

  if (newSpace) {
    // 使用通用的操作成功消息，组合"创建"+"成功"
    ElMessage.success(t('common.messages.operation_success', { operation: t('common.actions.create') }))
  }
  else {
    // 使用通用的操作失败消息，组合"创建"+"失败"
    ElMessage.error(t('common.messages.operation_failed', { operation: t('common.actions.create') }))
  }

  showCreateDialog.value = false
}

// 切换空间
function handleSpaceSwitch(space: Space) {
  spaceStore.setCurrentSpace(space)
  // 关闭切换面板
  popoverVisible.value = false
}

// 获取空间的缩略显示文本
function getSpaceAbbr(space?: Space | null): string {
  if (!space)
    return ''

  // 根据空间类型返回对应的国际化文本
  if (space.type === 'team') {
    return t('space.abbr.team')
  }
  else {
    return t('space.abbr.personal')
  }
}

// 使用useAsyncData进行服务端数据预加载
const { data: _spaces } = await useAsyncData('spaces', async () => {
  try {
    // 确保在服务端渲染时就获取空间数据
    await spaceStore.loadSpaces()
    return spaceStore.spaceList
  }
  catch (error) {
    console.error('Failed to load spaces during SSR:', error)
    return []
  }
})

// 在客户端执行额外操作
onMounted(() => {
  // 如果服务端没有成功获取数据，在客户端再次尝试
  if (!spaceStore.hasSpaces) {
    spaceStore.loadSpaces()
  }
})
</script>

<template>
  <ElPopover
    v-model:visible="popoverVisible"
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
          {{ getSpaceAbbr(spaceStore.currentSpace) }}
        </div>
        <template v-if="!isCollapsed">
          <span m="l-21px" flex-1 whitespace-nowrap>{{ spaceStore.currentSpace?.name || '' }}</span>
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
          v-for="space in spaceStore.spaceList"
          :key="space.id"
          class="space-item"
          :class="{ active: spaceStore.currentSpace?.id === space.id }"
          @click="handleSpaceSwitch(space)"
        >
          <div text="10px white" h-36px w-36px flex-center flex-shrink-0 rounded-5px bg-primary px-4px text-center>
            {{ getSpaceAbbr(space) }}
          </div>
          <span ml-12px flex-1>{{ space.name }}</span>
          <div
            v-if="spaceStore.currentSpace?.id === space.id"
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
