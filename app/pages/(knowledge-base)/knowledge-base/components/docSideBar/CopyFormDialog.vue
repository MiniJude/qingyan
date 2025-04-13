<script setup lang="ts">
import DocTree from '~/components/DocTree.vue'
import { personalData } from '~/mock/knowledge-base'

const { t } = useI18n()

// 创建副本
const visible = ref(false)
const form = ref({
  folderId: '',
})

const spaceList = ref([
  { label: t('knowledge_base.copy_dialog.personal_kb'), value: '1' },
  { label: t('knowledge_base.copy_dialog.team_kb'), value: '2' },
])

defineExpose({
  open() {
    visible.value = true
  },
})
</script>

<template>
  <el-dialog v-model="visible" :title="$t('knowledge_base.copy_dialog.title')" width="860" :show-close="false" align-center>
    <el-form :model="form" size="large" class="flex items-center justify-between">
      <el-form-item :label="$t('knowledge_base.copy_dialog.select_kb')" label-width="140px" label-position="left" class="!mb-0">
        <el-select v-model="form.folderId" :placeholder="$t('knowledge_base.copy_dialog.please_select')" class="!w-322px">
          <el-option v-for="item in spaceList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <div>
        <el-button plain size="large" class="!px-32px" @click="visible = false">
          {{ $t('knowledge_base.copy_dialog.cancel') }}
        </el-button>
        <el-button type="primary" size="large" class="!px-32px">
          {{ $t('knowledge_base.copy_dialog.confirm') }}
        </el-button>
      </div>
    </el-form>

    <div class="pure-doc-tree-container" p="t-18px r-44px b-24px l-25px" mt-36px h-410px w-full overflow-y-auto rounded-4px>
      <DocTree :data="personalData" :show-checkbox="false" />
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
.pure-doc-tree-container {
  border: 1px solid var(--app-border-regular);
}
</style>
