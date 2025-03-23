<script setup lang="ts">
import { localData } from '~/mock/knowledge-base'
import PureDocTree from './docTree/Tree.vue'
// 创建副本
const visible = ref(false)
const form = ref({
  folderId: '',
})

const spaceList = ref([
  { label: '个人知识库', value: '1' },
  { label: '团队知识库', value: '2' },
])

defineExpose({
  open() {
    visible.value = true
  },
})
</script>

<template>
  <el-dialog v-model="visible" title="创建副本" width="860" :show-close="false" align-center>
    <el-form :model="form" size="large" class="flex items-center justify-between">
      <el-form-item label="选择知识库" label-width="140px" label-position="left" class="!mb-0">
        <el-select v-model="form.folderId" placeholder="请选择" class="!w-322px">
          <el-option v-for="item in spaceList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <div>
        <el-button plain size="large" class="!px-32px" @click="visible = false">
          取消
        </el-button>
        <el-button type="primary" size="large" class="!px-32px">
          确认
        </el-button>
      </div>
    </el-form>

    <div class="pure-doc-tree-container" p="t-18px r-44px b-24px l-25px" mt-36px rounded-4px h-410px w-full overflow-y-auto>
      <PureDocTree :data="addUidToNodes(localData)" :show-checkbox="false" />
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
.pure-doc-tree-container {
  border: 1px solid var(--el-border-color);
}
</style>
