<script setup lang="ts">
import CircleDoc from '@/assets/svg/circle-doc.svg?skipsvgo'
import DocTree from './docTree/index.vue'

const docTreeRef = useTemplateRef<InstanceType<typeof DocTree>>('docTreeRef')

/** 是否显示底部按钮组 */
const isBtnGroupShow = computed(() => {
  return docTreeRef.value?.data.some(item => item.showCheckbox)
})

const allCheckedKeys = computed(() => {
  return docTreeRef.value?.data.map(item => item.checkedKeys).flat() ?? []
})
</script>

<template>
  <div class="doc-side-bar" p="t-28px r-16px b-18px l-16px" bg-white h-full w-263px flex="~ col">
    <el-button type="primary" class="mb-24px w-full !text-18px !px-9px !h-44px !justify-start">
      <template #icon>
        <CircleDoc />
      </template>
      <span text-16px ml-8px>全部文档</span>
    </el-button>

    <div flex="~ col 1">
      <DocTree ref="docTreeRef" />
      <div mt-40px flex gap-10px cursor-pointer items-center>
        <SvgoTrash />
        <span text-tprimary>回收站</span>
      </div>
    </div>

    <div v-if="isBtnGroupShow" class="btn-group" mt-16px flex justify-between>
      <el-button plain :disabled="!allCheckedKeys.length">
        创建副本
      </el-button>
      <el-button plain :disabled="!allCheckedKeys.length">
        移动到
      </el-button>
      <el-button plain :disabled="!allCheckedKeys.length">
        删除
      </el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.doc-side-bar {
  border-right: 1px solid var(--el-border-color);
  .btn-group {
    .el-button {
      margin: 0;
    }
  }
}
</style>
