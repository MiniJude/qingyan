<script setup lang="ts">
import FolderIcon from '@/assets/svg/folder.svg?component'
import TemplateLibraryDialog from '@/components/TemplateLibraryDialog.vue'
import Dashboard from './components/Dashboard.vue'

const folderList = ref([
  {
    name: '文件夹1',
  },
  {
    name: '文件夹2',
  },
  {
    name: '文件夹3',
  },
  {
    name: '文件夹4',
  },
  {
    name: '未分类',
  },
])

// 模板库对话框
const templateLibraryDialog = ref(false)
function openTemplateLibrary() {
  templateLibraryDialog.value = true
}
</script>

<template>
  <div h-full flex flex-col pb-18px>
    <div class="btn-group" mr-54px mt-28px flex justify-end gap-12px>
      <el-button plain size="large" @click="openTemplateLibrary">
        <template #icon>
          <SvgoTxt />
        </template>
        {{ $t('knowledge_base.index.template_library') }}
      </el-button>
      <el-button plain size="large">
        <template #icon>
          <SvgoFolder2 />
        </template>
        {{ $t('knowledge_base.index.auto_classify') }}
      </el-button>
      <el-dropdown>
        <el-button plain size="large">
          {{ $t('knowledge_base.index.upload') }}
          <div ml-8px h-16px w-16px flex-center>
            <SvgoArrowBottomFilled text-6px />
          </div>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>{{ $t('knowledge_base.index.document') }}</el-dropdown-item>
            <el-dropdown-item>{{ $t('knowledge_base.index.spreadsheet') }}</el-dropdown-item>
            <el-dropdown-item>{{ $t('knowledge_base.index.image') }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-dropdown>
        <el-button type="primary" size="large">
          {{ $t('knowledge_base.index.create_new') }}
          <div ml-8px h-16px w-16px flex-center>
            <SvgoArrowBottomFilled text-6px />
          </div>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>{{ $t('knowledge_base.index.folder') }}</el-dropdown-item>
            <el-dropdown-item>{{ $t('knowledge_base.index.document') }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <Dashboard />
    <!-- 文件夹 -->
    <div pl-37px pr-53px>
      <div mb-8px text-16px text-tprimary font-bold>
        {{ $t('knowledge_base.index.folders') }}
      </div>
      <div p-8px class="folder-container bg-[#f7f7f7] dark:bg-black">
        <div v-for="item in folderList" :key="item.name" class="folder-item" p="y-20px l-20px r-11px" flex items-center justify-between rounded-4px bg-white dark:bg-overlay>
          <div flex items-center gap-13px>
            <FolderIcon h-19px w-19px style="color: #FFC300;" />
            <div text-tprimary>
              {{ item.name }}
            </div>
          </div>
          <SvgoMore cursor-pointer text-20px text-tregular />
        </div>
      </div>
    </div>
    <!-- 知识空间 -->
    <div mt-16px min-h-0 flex flex-1 flex-col pl-37px pr-53px>
      <div mb-16px text-16px text-tprimary font-bold>
        {{ $t('knowledge_base.index.knowledge_space') }}
      </div>
      <JSwitch
        h-36px :columns="[
          { label: $t('knowledge_base.index.my_personal') },
          { label: $t('knowledge_base.index.shared_with_me') },
        ]" :item-width="83"
      />
      <FolderTable class="mt-16px min-h-0 flex-1" />
    </div>

    <TemplateLibraryDialog v-model="templateLibraryDialog" />
  </div>
</template>

<style scoped lang="scss">
.btn-group {
  .el-button {
    margin-left: 0;
  }
}

.folder-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  padding: 8px;
  border-radius: 4px;
  .folder-item {
    height: 60px;
    border-radius: 4px;
    border: 1px solid var(--el-border-color);
    display: flex;
  }
}
</style>
