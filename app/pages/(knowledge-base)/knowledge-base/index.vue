<script setup lang="ts">
import FolderIcon from '@/assets/svg/folder.svg?component'
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
</script>

<template>
  <div pb-18px flex flex-col h-full>
    <div class="btn-group" mr-54px mt-28px flex gap-12px justify-end>
      <el-button plain size="large">
        <template #icon>
          <SvgoTxt />
        </template>
        模板库
      </el-button>
      <el-button plain size="large">
        <template #icon>
          <SvgoFolder2 />
        </template>
        自动分类
      </el-button>
      <el-dropdown>
        <el-button plain size="large">
          上传
          <div ml-8px flex-center h-16px w-16px>
            <SvgoArrowBottomFilled text-6px />
          </div>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>文档</el-dropdown-item>
            <el-dropdown-item>表格</el-dropdown-item>
            <el-dropdown-item>图片</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-dropdown>
        <el-button type="primary" size="large">
          新建
          <div ml-8px flex-center h-16px w-16px>
            <SvgoArrowBottomFilled text-6px />
          </div>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>文件夹</el-dropdown-item>
            <el-dropdown-item>文档</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <Dashboard />
    <!-- 文件夹 -->
    <div pl-37px pr-53px>
      <div text-16px text-tprimary font-bold mb-8px>
        文件夹
      </div>
      <div p-8px class="folder-container">
        <div v-for="item in folderList" :key="item.name" class="folder-item" p="y-20px l-20px r-11px" rounded-4px flex items-center justify-between>
          <div flex gap-13px items-center>
            <FolderIcon h-19px w-19px style="color: #FFC300;" />
            <div text-tprimary>
              {{ item.name }}
            </div>
          </div>
          <SvgoMore text-20px text-tregular cursor-pointer />
        </div>
      </div>
    </div>
    <!-- 知识空间 -->
    <div mt-16px pl-37px pr-53px flex flex-1 flex-col min-h-0>
      <div text-16px text-tprimary font-bold mb-16px>
        知识空间
      </div>
      <JSwitch h-36px :columns="[{ label: '我个人的' }, { label: '邀请协作的' }]" :item-width="83" />
      <FolderTable class="mt-16px flex-1 min-h-0" />
    </div>
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
  background-color: #edeff3;
  .folder-item {
    background-color: #fff;
    height: 60px;
    border-radius: 4px;
    background: #ffffff;
    border: 1px solid var(--el-border-color);
    display: flex;
  }
}
</style>
