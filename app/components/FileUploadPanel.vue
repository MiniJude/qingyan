<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

interface UploadFile {
  name: string
  percentage: number
  status: string
  raw: File
  uid: string
}

interface UploadFolder {
  label: string
  value: string
}

const props = defineProps<{
  /** 上传文件夹选项 */
  folders: UploadFolder[]
  /** 默认选中的文件夹 */
  defaultFolder?: string
}>()

// 选中的文件夹
const selectedFolder = ref(props.defaultFolder || (props.folders[0]?.value || ''))

// 文件上传列表
const fileList = ref<UploadFile[]>([])

// 处理文件选择
function handleFileChange(uploadFile: any, uploadFiles: any[]) {
  // 验证文件大小
  const isLessThan200MB = ((uploadFile.raw?.size || 0) / 1024 / 1024) < 200
  if (!isLessThan200MB) {
    ElMessage.warning(`文件 ${uploadFile.raw?.name || '未知文件'} 超过200MB大小限制`)
    // 从上传列表中移除该文件
    const index = uploadFiles.indexOf(uploadFile)
    if (index !== -1) {
      uploadFiles.splice(index, 1)
    }
    return
  }

  // 更新文件列表
  fileList.value = uploadFiles.map(file => ({
    name: file.name || '未知文件',
    percentage: 0,
    status: file.status || 'ready',
    raw: file.raw,
    uid: file.uid || `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
  }))

  // 收集有效文件
  const validFiles = uploadFiles.filter(file => file.status !== 'fail').map(file => file.raw)

  if (validFiles.length > 0) {
    const folderName = props.folders.find(f => f.value === selectedFolder.value)?.label || '默认文件夹'
    ElMessage.success(`已开始上传${validFiles.length}个文件到${folderName}`)
  }
}

// 处理上传进度
function handleProgress(event: any, file: any) {
  const fileUid = file?.uid
  if (!fileUid)
    return
  const index = fileList.value.findIndex(item => item.uid === fileUid)
  if (index !== -1 && fileList.value[index]) {
    fileList.value[index].percentage = Math.round(event?.percent || 0)
    fileList.value[index].status = 'uploading'
  }
}

// 处理上传成功
function handleSuccess(response: any, file: any) {
  const fileUid = file?.uid
  if (!fileUid)
    return

  const index = fileList.value.findIndex(item => item.uid === fileUid)
  if (index !== -1 && fileList.value[index]) {
    fileList.value[index].status = 'success'
    fileList.value[index].percentage = 100
  }
}

// 处理上传错误
function handleUploadError(err: any, file: any) {
  console.error('上传出错:', err)
  ElMessage.error('文件上传失败，请重试')

  const fileUid = file?.uid
  if (!fileUid)
    return

  const index = fileList.value.findIndex(item => item.uid === fileUid)
  if (index !== -1 && fileList.value[index]) {
    fileList.value[index].status = 'fail'
  }
}

// 获取状态文本
function getStatusText(status: string) {
  const statusMap: Record<string, string> = {
    ready: '准备上传',
    uploading: '上传中',
    success: '上传成功',
    fail: '上传失败',
  }
  return statusMap[status] || '准备上传'
}
</script>

<template>
  <div class="file-upload-panel">
    <h2 class="mb-20px text-18px font-bold">
      选择文件夹
    </h2>

    <div class="mb-20px max-w-580px w-full">
      <el-select v-model="selectedFolder" class="w-full">
        <el-option
          v-for="folder in folders"
          :key="folder.value"
          :label="folder.label"
          :value="folder.value"
        />
      </el-select>
    </div>

    <el-upload
      class="w-full"
      drag
      multiple
      action="/api/upload"
      :show-file-list="false"
      :data="{ folder: selectedFolder }"
      :auto-upload="true"
      :on-change="handleFileChange"
      :on-progress="handleProgress"
      :on-success="handleSuccess"
      :on-error="handleUploadError"
    >
      <div class="flex flex-col items-center justify-center">
        <i class="i-carbon:arrow-up upload-icon mb-20px text-60px text-gray-300" />
        <div class="mb-6px text-16px text-gray-500">
          将文件拖到此处，或<span class="cursor-pointer text-primary">点击上传</span>
        </div>
        <div class="mt-10px text-center text-14px text-gray-400">
          单个文件不超过200M
        </div>
      </div>
    </el-upload>

    <!-- 文件上传列表 -->
    <div v-if="fileList.length > 0" class="mt-20px border border-gray-200 rounded-8px">
      <div v-for="(file, index) in fileList" :key="index" class="border-b border-gray-200 px-12px py-10px last:border-none">
        <div class="mb-4px flex items-center justify-between">
          <span class="max-w-80% truncate text-14px">{{ file.name }}</span>
          <span class="text-14px" :class="file.status === 'success' ? 'text-success' : ''">
            {{ getStatusText(file.status) }}
          </span>
        </div>
        <el-progress
          v-if="file.status !== 'success'"
          :percentage="file.percentage"
          :stroke-width="5"
          :show-text="false"
          class="mb-0px"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-upload-dragger) {
  height: 360px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  border: 1px dashed var(--el-border-color);
  border-radius: 8px;
  transition: colors 0.3s;

  &:hover {
    border-color: var(--el-color-primary);
    .upload-icon {
      color: var(--el-color-primary);
    }
  }
}
</style>
