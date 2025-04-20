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
    <div class="search-description-section mb-24px flex items-center justify-between">
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

    <div class="trash-list">
      <div class="trash-list-header grid grid-cols-[3fr_1fr_1fr] rounded-t-4px bg-[#f7f7f7] p-16px text-14px text-tregular font-medium dark:bg-[#333]">
        <div>{{ $t('knowledge_base.title') }}</div>
        <div>{{ $t('knowledge_base.delete_time') }}</div>
        <div class="text-right">
          {{ $t('knowledge_base.operations') }}
        </div>
      </div>

      <div class="trash-list-body rounded-b-4px bg-white dark:bg-[#222]">
        <div v-if="filteredTrashItems.length === 0" class="p-40px text-center text-tregular">
          {{ $t('knowledge_base.trash_empty') }}
        </div>
        <div
          v-for="item in filteredTrashItems"
          :key="item.id"
          class="trash-item grid grid-cols-[3fr_1fr_1fr] border-b border-[#eee] p-16px dark:border-[#333] hover:bg-[#f9f9f9] dark:hover:bg-[#2a2a2a]"
        >
          <div class="flex items-center gap-8px">
            <i :class="getFileIcon(item.type)" class="text-18px" />
            <span class="truncate">{{ item.title }}</span>
          </div>
          <div class="text-tregular">
            {{ item.deletedTime }}
          </div>
          <div class="flex justify-end gap-8px">
            <el-button size="small" circle @click="handleRestore(item)">
              <i class="i-carbon:redo text-16px" />
            </el-button>
            <el-button size="small" circle @click="handleDelete(item)">
              <i class="i-carbon:trash-can text-16px" />
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.space-trash-panel {
  padding: 24px;
  overflow-y: auto;
}

.trash-list {
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}
</style>
