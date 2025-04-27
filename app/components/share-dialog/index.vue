<script setup lang="ts">
import { Download, Edit, Share } from '@element-plus/icons-vue'

// 定义props
interface Props {
  fileName: string // 文件名，将作为弹窗标题
  modelValue: boolean // v-model绑定值，控制弹窗显示/隐藏
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const { isMobileDevice } = useDeviceDetection()

// 控制弹窗显示/隐藏
const dialogVisible = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

// 当前激活的标签页
const activeTab = ref('invite')
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="fileName"
    width="700px"
    class="share-dialog"
    :fullscreen="isMobileDevice"
  >
    <!-- a标签页 -->
    <el-tabs v-model="activeTab">
      <!-- 邀请协作 -->
      <el-tab-pane name="invite">
        <template #label>
          <el-icon><Share /></el-icon>
          <span>{{ $t('knowledge_base.share_dialog.invite_tab') }}</span>
        </template>
        <InviteCollaboration />
      </el-tab-pane>

      <!-- 下载权限 -->
      <el-tab-pane name="download">
        <template #label>
          <el-icon><Download /></el-icon>
          <span>{{ $t('knowledge_base.share_dialog.download_tab') }}</span>
        </template>
        <DownloadPermission />
      </el-tab-pane>

      <!-- 批注权限 -->
      <el-tab-pane name="annotation">
        <template #label>
          <el-icon><Edit /></el-icon>
          <span>{{ $t('knowledge_base.share_dialog.annotation_tab') }}</span>
        </template>
        <AnnotationPermission />
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<style lang="scss" scoped>
.share-dialog {
  :deep(.el-tabs__item) {
    display: flex;
    align-items: center;

    .el-icon {
      margin-right: 4px;
    }
  }
}
</style>
