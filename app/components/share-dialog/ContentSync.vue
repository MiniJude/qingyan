<script setup lang="ts">
import { InfoFilled } from '@element-plus/icons-vue'
// 获取应用上下文（用于ElMessage）
const { appContext } = getCurrentInstance()!
const { t } = useI18n()
const spaceStore = useSpaceStore()

// 同步空间列表 - 存储已同步的空间ID
const syncedSpaceIds = ref<string[]>([])

// 多选选择的空间ID列表
const selectedSpaceIds = ref<string[]>([])
const selectVisible = ref(false)

// 当选择面板关闭时处理添加空间
function handleSelectClose() {
  if (selectedSpaceIds.value.length > 0) {
    // 添加新选择的空间到同步列表
    syncedSpaceIds.value = [...selectedSpaceIds.value]
    ElMessage.success({
      message: t('knowledge_base.share_dialog.sync.space_added'),
      duration: 2000,
    }, appContext)
  }
}

// 初始化数据
onMounted(async () => {
  // 确保加载空间列表
  if (!spaceStore.hasSpaces) {
    await spaceStore.loadSpaces()
  }
})
</script>

<template>
  <div class="content-sync">
    <!-- 说明文字 -->
    <div class="mb-24px">
      <p class="mb-8px flex items-center text-14px text-gray-700">
        <el-icon class="mr-8px">
          <InfoFilled />
        </el-icon>
        <span>
          {{ $t('knowledge_base.share_dialog.sync.sync_desc') }}
        </span>
      </p>
      <p class="flex items-center text-14px text-gray-700">
        <el-icon class="mr-8px">
          <InfoFilled />
        </el-icon>
        <span>
          {{ $t('knowledge_base.share_dialog.sync.cancel_sync_desc') }}
        </span>
      </p>
    </div>

    <!-- 添加同步空间 - 使用el-select多选 -->
    <div class="mb-24px">
      <h3 class="mb-16px text-16px font-medium">
        {{ $t('knowledge_base.share_dialog.sync.select_space') }}
      </h3>

      <!-- 多选下拉框选择空间 -->
      <el-select
        v-model="selectedSpaceIds"
        v-model:visible="selectVisible"
        multiple
        filterable
        collapse-tags
        collapse-tags-tooltip
        :max-collapse-tags="5"
        class="w-full"
        :placeholder="$t('knowledge_base.share_dialog.sync.search_space')"
        @visible-change="visible => !visible && handleSelectClose()"
      >
        <el-option
          v-for="space in spaceStore.spaceList"
          :key="space.id"
          :label="space.name"
          :value="space.id"
        >
          <div class="flex items-center">
            <div
              class="mr-8px h-24px w-24px flex items-center justify-center rounded-4px bg-primary"
            >
              <span class="text-12px text-white font-light">
                {{ space.type === 'team' ? t('space.abbr.team') : t('space.abbr.personal') }}
              </span>
            </div>
            <span>{{ space.name }}</span>
          </div>
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content-sync {
  padding: 16px 0;

  :deep(.el-select) {
    width: 100%;
  }

  :deep(.el-select-dropdown__item) {
    height: 40px;
    line-height: 40px;
  }
}
</style>
