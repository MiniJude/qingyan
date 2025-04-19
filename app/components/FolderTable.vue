<script setup lang="ts">
import { FileFilterType, FileType } from '@/constants'
import { Delete, Download, Edit, MoreFilled, Share } from '@element-plus/icons-vue'
import { useElementSize } from '@vueuse/core'

// 定义文件类型
interface FileItem {
  id: string
  fileName: string
  owner: string
  updateTime: string
  fileType: FileType
}

// 定义组件的props
interface Props {
  type?: FileFilterType
}

const props = withDefaults(defineProps<Props>(), {
  type: FileFilterType.PERSONAL,
})

// 个人文件模拟数据
const personalFiles = ref<FileItem[]>([
  { id: '1', fileName: '信息学一本通第五版', owner: 'VelvetStorm56', updateTime: '2024年11月1日', fileType: FileType.PPT },
  { id: '2', fileName: '算法设计与分析-朱大铭', owner: 'VelvetStorm56', updateTime: '2024年11月1日', fileType: FileType.PPT },
  { id: '3', fileName: '平衡树与题序音', owner: 'VelvetStorm56', updateTime: '2024年11月1日', fileType: FileType.DOC },
  { id: '4', fileName: '算法艺术与信息学竞赛', owner: 'VelvetStorm56', updateTime: '2024年11月1日', fileType: FileType.PICTURE },
])

// 团队文件模拟数据
const teamFiles = ref<FileItem[]>([
  { id: '5', fileName: '团队项目计划书', owner: 'TeamLead', updateTime: '2024年11月5日', fileType: FileType.DOC },
  { id: '6', fileName: '团队周报汇总', owner: 'Manager', updateTime: '2024年11月4日', fileType: FileType.DOC },
  { id: '7', fileName: '产品设计规范', owner: 'Designer', updateTime: '2024年11月3日', fileType: FileType.PPT },
])

// 共享文件模拟数据
const sharedFiles = ref<FileItem[]>([
  { id: '8', fileName: '项目协作文档', owner: 'Collaborator1', updateTime: '2024年11月2日', fileType: FileType.DOC },
  { id: '9', fileName: '外部资源分享', owner: 'External', updateTime: '2024年10月30日', fileType: FileType.PICTURE },
  { id: '10', fileName: '合作伙伴提案', owner: 'Partner', updateTime: '2024年10月28日', fileType: FileType.PPT },
])

// 根据类型计算显示的文件列表
const fileList = computed(() => {
  switch (props.type) {
    case FileFilterType.PERSONAL:
      return personalFiles.value
    case FileFilterType.TEAM:
      return teamFiles.value
    case FileFilterType.SHARED:
      return sharedFiles.value
    default:
      return personalFiles.value
  }
})

// 分享弹窗相关
const shareDialogVisible = ref(false)
const currentFile = ref<FileItem | null>(null)

// 处理文件操作
function handleFileAction(action: string, file: FileItem) {
  switch (action) {
    case 'edit':
      console.warn('编辑文件:', file.fileName)
      break
    case 'delete':
      console.warn('删除文件:', file.fileName)
      break
    case 'download':
      console.warn('下载文件:', file.fileName)
      break
    case 'share':
      currentFile.value = file
      shareDialogVisible.value = true
      break
    default:
      break
  }
}

// 使用VueUse获取元素引用和尺寸
const folderTableRef = ref<HTMLElement | null>(null)
const { height: folderTableHeight } = useElementSize(folderTableRef)
</script>

<template>
  <div ref="folderTableRef" class="folder-table">
    <!-- 数据源标识 -->
    <div v-if="fileList.length > 0" class="data-source mb-8px" text-12px text-tregular>
      <span v-if="props.type === FileFilterType.PERSONAL" class="text-primary">
        <span class="mr-4px rounded-2px bg-blue-50 px-4px py-2px text-blue-500">
          {{ $t('knowledge_base.folder_table.data_source.personal') }}
        </span>
        {{ $t('knowledge_base.folder_table.data_source.files_count', { count: fileList.length }) }}
      </span>
      <span v-else-if="props.type === FileFilterType.TEAM" class="text-primary">
        <span class="mr-4px rounded-2px bg-green-50 px-4px py-2px text-green-500">
          {{ $t('knowledge_base.folder_table.data_source.team') }}
        </span>
        {{ $t('knowledge_base.folder_table.data_source.files_count', { count: fileList.length }) }}
      </span>
      <span v-else class="text-primary">
        <span class="mr-4px rounded-2px bg-orange-50 px-4px py-2px text-orange-500">
          {{ $t('knowledge_base.folder_table.data_source.shared') }}
        </span>
        {{ $t('knowledge_base.folder_table.data_source.files_count', { count: fileList.length }) }}
      </span>
    </div>
    <!-- 文件列表 -->
    <el-table
      class-name="flex-1 min-h-0"
      :data="fileList"
      style="width: 100%"
      :height="folderTableHeight > 0 ? folderTableHeight : undefined"
    >
      <template #empty>
        <div class="flex flex-col items-center justify-center py-24px empty-block">
          <el-empty :description="$t('common.no_data')" />
        </div>
      </template>

      <el-table-column prop="fileName" :label="$t('knowledge_base.folder_table.file_name')" label-class-name="text-tregular !font-normal">
        <template #default="{ row }">
          <div class="file-name-cell">
            <FileIcon :file-type="row.fileType" :size="20" />
            <span class="file-name" text-tprimary>{{ row.fileName }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="owner" :label="$t('knowledge_base.folder_table.owner')" label-class-name="text-tregular !font-normal">
        <template #default="{ row }">
          <span text-tregular>{{ row.owner }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="updateTime" label-class-name="text-tregular !font-normal" :label="$t('knowledge_base.folder_table.last_update')" width="220">
        <template #default="{ row }">
          <span text-tregular>{{ row.updateTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="" width="120">
        <template #default="{ row }">
          <div class="file-actions">
            <el-dropdown trigger="click">
              <el-icon><MoreFilled text-tregular /></el-icon>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handleFileAction('edit', row)">
                    <el-icon><Edit /></el-icon>
                    <span>{{ $t('knowledge_base.folder_table.edit') }}</span>
                  </el-dropdown-item>
                  <el-dropdown-item @click="handleFileAction('share', row)">
                    <el-icon><Share /></el-icon>
                    <span>{{ $t('knowledge_base.folder_table.share') }}</span>
                  </el-dropdown-item>
                  <el-dropdown-item @click="handleFileAction('download', row)">
                    <el-icon><Download /></el-icon>
                    <span>{{ $t('knowledge_base.folder_table.download') }}</span>
                  </el-dropdown-item>
                  <el-dropdown-item divided @click="handleFileAction('delete', row)">
                    <el-icon><Delete /></el-icon>
                    <span>{{ $t('knowledge_base.folder_table.delete') }}</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分享弹窗 -->
    <ShareDialog
      v-if="currentFile"
      v-model="shareDialogVisible"
      :file-name="currentFile.fileName"
    />
  </div>
</template>

<style lang="scss" scoped>
.folder-table {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  .file-name-cell {
    display: flex;
    align-items: center;
    gap: 8px;

    .file-name {
      font-weight: 500;
    }
  }

  .file-actions {
    display: flex;
    justify-content: center;
  }

  // 添加表头居中样式
  :deep(.el-table__header) {
    th {
      .cell {
        padding-left: 26px;
      }
    }
  }
}
</style>
