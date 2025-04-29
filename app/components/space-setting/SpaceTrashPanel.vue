<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'

const { appContext } = getCurrentInstance()!
const { t } = useI18n()

// 回收站数据
const trashItems = ref([
  {
    id: '1',
    title: '微信图片_20250315105650.jpg',
    type: 'image',
    icon: 'i-carbon:document-image',
    deletedTime: '2025-04-19 09:28',
  },
  {
    id: '2',
    title: '微信图片_20250315105633.jpg',
    type: 'image',
    icon: 'i-carbon:document-image',
    deletedTime: '2025-03-30 15:25',
  },
  {
    id: '3',
    title: '微信图片_20241020121551.jpg',
    type: 'image',
    icon: 'i-carbon:document-image',
    deletedTime: '2025-03-30 15:25',
  },
  {
    id: '4',
    title: '康奈尔笔记',
    type: 'document',
    icon: 'i-carbon:document',
    deletedTime: '2025-03-30 10:56',
  },
  {
    id: '5',
    title: '项目计划文件夹',
    type: 'folder',
    icon: 'i-carbon:folder',
    deletedTime: '2025-03-25 14:30',
  },
])

// 过滤后的数据
const filteredTrashItems = ref([...trashItems.value])

// 搜索关键词
const searchKeyword = ref('')

// 搜索过滤处理
function handleSearch() {
  // 只根据searchKeyword过滤列表
  if (!searchKeyword.value) {
    // 如果没有搜索条件，显示所有数据
    filteredTrashItems.value = trashItems.value
    return
  }

  filteredTrashItems.value = trashItems.value.filter((item) => {
    const matchesKeyword = item.title.toLowerCase().includes(searchKeyword.value.toLowerCase())
    return matchesKeyword
  })
}

// 监听搜索关键词变化
watch(searchKeyword, handleSearch)

// 处理还原文件/文件夹
function handleRestore(item: any) {
  ElMessageBox.confirm(
    t('knowledge_base.trash_confirm_restore'),
    t('common.actions.warning'),
    {
      confirmButtonText: t('common.actions.confirm'),
      cancelButtonText: t('common.actions.cancel'),
      type: 'warning',
    },
    appContext,
  )
    .then(() => {
      // 实际项目中应调用API还原文件
      // 这里仅模拟功能
      ElMessage.success({
        message: t('knowledge_base.trash_restore_success'),
        duration: 2000,
      }, appContext)

      // 从列表中移除该项
      trashItems.value = trashItems.value.filter(i => i.id !== item.id)
      handleSearch() // 重新过滤
    })
    .catch(() => {
      // 用户取消操作
    })
}

// 处理彻底删除
function handleDelete(item: any) {
  ElMessageBox.confirm(
    t('knowledge_base.trash_confirm_delete'),
    t('common.actions.warning'),
    {
      confirmButtonText: t('common.actions.confirm'),
      cancelButtonText: t('common.actions.cancel'),
      type: 'warning',
    },
    appContext,
  )
    .then(() => {
      // 实际项目中应调用API彻底删除文件
      // 这里仅模拟功能
      ElMessage.success({
        message: t('knowledge_base.trash_delete_success'),
        duration: 2000,
      }, appContext)

      // 从列表中移除该项
      trashItems.value = trashItems.value.filter(i => i.id !== item.id)
      handleSearch() // 重新过滤
    })
    .catch(() => {
      // 用户取消操作
    })
}

// 获取文件类型对应的图标
function getFileIcon(type: string) {
  if (type === 'folder') {
    return 'i-carbon:folder'
  }
  else if (type === 'image') {
    return 'i-carbon:image'
  }
  else {
    return 'i-carbon:document'
  }
}
</script>

<template>
  <div class="space-trash-panel">
    <div class="search-description-section mb-24px flex items-center justify-between lt-md:flex-col lt-md:items-start lt-md:gap-4">
      <p class="text-14px text-tregular">
        {{ $t('knowledge_base.trash_description') }}
      </p>
      <div class="search-input w-64">
        <el-input
          v-model="searchKeyword"
          :placeholder="$t('common.search.placeholder')"
          clearable
          :prefix-icon="Search"
        />
      </div>
    </div>

    <el-table :data="filteredTrashItems" style="width: 100%" :empty-text="$t('knowledge_base.trash_empty')">
      <!-- 标题列 - 占用剩余空间 -->
      <el-table-column prop="title" :label="$t('knowledge_base.title')" min-width="200">
        <template #default="{ row }">
          <div class="flex items-center gap-8px">
            <i :class="getFileIcon(row.type)" class="shrink-0 text-18px" />
            <el-tooltip
              :content="row.title"
              :disabled="row.title.length < 20"
              placement="top"
            >
              <span class="truncate">{{ row.title }}</span>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>

      <!-- 删除时间列 - 固定宽度 -->
      <el-table-column prop="deletedTime" :label="$t('knowledge_base.delete_time')" />

      <!-- 操作列 - 固定宽度 -->
      <el-table-column :label="$t('knowledge_base.operations')" width="100" fixed="right">
        <template #default="{ row }">
          <div class="flex justify-end gap-8px">
            <el-button size="small" circle @click="handleRestore(row)">
              <i class="i-carbon:redo text-16px" />
            </el-button>
            <el-button size="small" circle @click="handleDelete(row)">
              <i class="i-carbon:trash-can text-16px" />
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style lang="scss" scoped>
.space-trash-panel {
  overflow-y: auto;
  @media (max-width: 768px) {
    padding: 0;
  }
}
</style>
