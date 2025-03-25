<script setup lang="ts">
import { Delete, Download, Edit, MoreFilled } from '@element-plus/icons-vue'
import { useElementSize } from '@vueuse/core'

// 定义文件类型
interface FileItem {
  id: string
  fileName: string
  owner: string
  updateTime: string
  fileType: FileType
}

// 模拟数据
const fileList = ref<FileItem[]>([
  { id: '1', fileName: '信息学一本通第五版', owner: 'VelvetStorm56', updateTime: '2024年11月1日', fileType: 'ppt' },
  { id: '2', fileName: '算法设计与分析-朱大铭', owner: 'VelvetStorm56', updateTime: '2024年11月1日', fileType: 'ppt' },
  { id: '3', fileName: '平衡树与题序音', owner: 'VelvetStorm56', updateTime: '2024年11月1日', fileType: 'doc' },
  { id: '4', fileName: '算法艺术与信息学竞赛', owner: 'VelvetStorm56', updateTime: '2024年11月1日', fileType: 'picture' },
  { id: '4', fileName: '算法艺术与信息学竞赛', owner: 'VelvetStorm56', updateTime: '2024年11月1日', fileType: 'picture' },
  { id: '4', fileName: '算法艺术与信息学竞赛', owner: 'VelvetStorm56', updateTime: '2024年11月1日', fileType: 'picture' },
  { id: '4', fileName: '算法艺术与信息学竞赛', owner: 'VelvetStorm56', updateTime: '2024年11月1日', fileType: 'picture' },
  { id: '4', fileName: '算法艺术与信息学竞赛', owner: 'VelvetStorm56', updateTime: '2024年11月1日', fileType: 'picture' },
])

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
    <!-- 文件列表 -->
    <el-table
      :data="fileList"
      style="width: 100%"
      :height="folderTableHeight > 0 ? folderTableHeight : undefined"
    >
      <el-table-column prop="fileName" label="文件名" label-class-name="text-tregular !font-normal">
        <template #default="{ row }">
          <div class="file-name-cell">
            <FileIcon :file-type="row.fileType" :size="20" />
            <span class="file-name" text-tprimary>{{ row.fileName }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="owner" label="所有者" label-class-name="text-tregular !font-normal">
        <template #default="{ row }">
          <span text-tregular>{{ row.owner }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="updateTime" label-class-name="text-tregular !font-normal" label="最近更新" width="220">
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
                    <span>编辑</span>
                  </el-dropdown-item>
                  <el-dropdown-item @click="handleFileAction('download', row)">
                    <el-icon><Download /></el-icon>
                    <span>下载</span>
                  </el-dropdown-item>
                  <el-dropdown-item divided @click="handleFileAction('delete', row)">
                    <el-icon><Delete /></el-icon>
                    <span>删除</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style lang="scss" scoped>
.folder-table {
  height: 100%;
  width: 100%;
  box-sizing: border-box;

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
