<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { computed, getCurrentInstance, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// 获取应用上下文（用于ElMessage）
const { appContext } = getCurrentInstance()!
const { t } = useI18n()

// 空间选择弹窗
const spaceSelectVisible = ref(false)

// 同步空间列表
const syncedSpaces = ref([
  { id: '1', name: '测试团队空间', synced: true },
  { id: '2', name: '个人空间', synced: true },
])

// 可选择的空间列表
const availableSpaces = [
  { id: '1', name: '测试团队空间', avatar: '🤖' },
  { id: '2', name: '个人空间', avatar: '👤' },
  { id: '3', name: '测试个人空间', avatar: '👤' },
  { id: '4', name: '设计团队空间', avatar: '🎨' },
]

// 空间搜索关键词
const spaceSearchKeyword = ref('')

// 过滤后的空间列表
const filteredSpaces = computed(() => {
  if (!spaceSearchKeyword.value)
    return availableSpaces

  return availableSpaces.filter(space =>
    space.name.toLowerCase().includes(spaceSearchKeyword.value.toLowerCase()),
  )
})

// 切换空间同步状态
function toggleSync(spaceId: string) {
  const space = syncedSpaces.value.find(s => s.id === spaceId)
  if (space) {
    space.synced = !space.synced
    ElMessage.success({
      message: space.synced
        ? t('knowledge_base.share_dialog.sync.sync_enabled')
        : t('knowledge_base.share_dialog.sync.sync_disabled'),
      duration: 2000,
    }, appContext)
  }
}

// 选择空间
function selectSpace(space: { id: string, name: string, avatar: string }) {
  // 如果已经存在，则不重复添加
  if (!syncedSpaces.value.some(s => s.id === space.id)) {
    syncedSpaces.value.push({ id: space.id, name: space.name, synced: true })
    ElMessage.success({
      message: t('knowledge_base.share_dialog.sync.space_added'),
      duration: 2000,
    }, appContext)
  }
  spaceSelectVisible.value = false
}
</script>

<template>
  <div class="content-sync">
    <!-- 说明文字 -->
    <div class="mb-24px">
      <p class="mb-8px text-14px text-gray-700">
        {{ $t('knowledge_base.share_dialog.sync.sync_desc') }}
      </p>
      <p class="text-14px text-gray-700">
        {{ $t('knowledge_base.share_dialog.sync.cancel_sync_desc') }}
      </p>
    </div>

    <!-- 同步空间列表 -->
    <div class="synced-spaces mb-24px">
      <h3 class="mb-16px text-16px font-medium">
        {{ $t('knowledge_base.share_dialog.sync.synced_spaces') }}
      </h3>

      <div v-if="syncedSpaces.length > 0" class="space-list">
        <div
          v-for="space in syncedSpaces"
          :key="space.id"
          class="space-item mb-8px flex items-center justify-between rounded-4px bg-gray-50 p-12px"
        >
          <span class="text-14px">{{ space.name }}</span>
          <el-switch
            v-model="space.synced"
            :active-text="$t('knowledge_base.share_dialog.sync.synced')"
            :inactive-text="$t('knowledge_base.share_dialog.sync.not_synced')"
            @change="toggleSync(space.id)"
          />
        </div>
      </div>
      <el-empty v-else :description="$t('knowledge_base.share_dialog.sync.no_synced_spaces')" />
    </div>

    <!-- 添加同步空间 -->
    <div class="add-space">
      <el-button
        type="primary"
        plain
        @click="spaceSelectVisible = true"
      >
        {{ $t('knowledge_base.share_dialog.sync.select_space') }}
      </el-button>
    </div>

    <!-- 空间选择弹窗 -->
    <el-dialog
      v-model="spaceSelectVisible"
      :title="$t('knowledge_base.share_dialog.sync.space_selection')"
      width="500px"
    >
      <!-- 搜索框 -->
      <el-input
        v-model="spaceSearchKeyword"
        :placeholder="$t('knowledge_base.share_dialog.sync.search_space')"
        prefix-icon="el-icon-search"
        clearable
        class="mb-16px"
      />

      <!-- 空间列表 -->
      <div class="space-selection">
        <div
          v-for="space in filteredSpaces"
          :key="space.id"
          class="space-select-item mb-8px flex cursor-pointer items-center rounded-4px p-12px hover:bg-gray-50"
          @click="selectSpace(space)"
        >
          <div class="space-avatar mr-12px text-24px">
            {{ space.avatar }}
          </div>
          <span class="text-14px">{{ space.name }}</span>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="spaceSelectVisible = false">
            {{ $t('knowledge_base.share_dialog.sync.cancel') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.content-sync {
  padding: 16px 0;
}

.space-selection {
  max-height: 300px;
  overflow-y: auto;
}
</style>
