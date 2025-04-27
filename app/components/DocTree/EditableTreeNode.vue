<script setup lang="ts">
import { Document, Folder } from '@element-plus/icons-vue'
import EditableText from '../EditableText.vue'

interface Props {
  node: FileTreeType
  isEditable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isEditable: true,
})

const emit = defineEmits<{
  (e: 'rename', node: FileTreeType, newName: string): void
}>()

// 节点名称
const nodeName = ref(props.node.label)

// 处理重命名
function handleRename(newName: string) {
  if (newName !== props.node.label) {
    emit('rename', props.node, newName)
  }
}
</script>

<template>
  <div class="editable-node-container">
    <div class="flex items-center">
      <!-- 节点图标 -->
      <el-icon class="mr-2" :size="16">
        <Folder v-if="node.type === 'folder'" />
        <Document v-else />
      </el-icon>

      <!-- 可编辑名称 -->
      <EditableText
        v-model="nodeName"
        :disabled="!isEditable"
        :item-type="node.type === 'folder' ? 'folder' : 'file'"
        @update:model-value="handleRename"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.editable-node-container {
  width: 100%;
  padding: 4px 0;
}
</style>
