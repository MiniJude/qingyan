<script setup lang="ts">
import { SvgoAiChat, SvgoFolder2 } from '#components'

const route = useRoute()

const menuList = [
  {
    name: '知识库',
    icon: SvgoFolder2,
    path: '/knowledge-base',
  },
  {
    name: 'AI 助手',
    icon: SvgoAiChat,
    path: '/ai-assistant',
  },
]

// 计算当前应该激活的菜单项
const activeMenu = computed(() => {
  return menuList.find(item => route.path.includes(item.path))?.path ?? ''
})
</script>

<template>
  <div class="side-bar" flex flex-col w-242px>
    <!-- logo -->
    <!-- <div flex gap-2 h-69px items-center p="l-13px">
      <div i-carbon:logo-kubernetes text="primary 48px" />
      <span text="primary font-bold 28px">清研</span>
    </div> -->

    <img src="@/assets/img/logo.png" alt="logo" m="t-5px l-13px" h-64px w-134px>

    <div flex flex-1 flex-col p="t-13px r-16px b-13px l-15px">
      <!-- 空间切换 -->
      <div m="l-4px b-12px t-10px" flex h-35px cursor-pointer items-center>
        <div text="white 10px" rounded-5px bg-primary flex-center h-36px w-36px>
          数智<br>空间
        </div>
        <span m="l-21px" flex-1>个人空间</span>
        <div i-carbon:chevron-right h-20px w-20px />
      </div>

      <el-menu pt-19px flex-1 !b-0 :default-active="activeMenu">
        <NuxtLink v-for="item in menuList" :key="item.path" :to="item.path">
          <el-menu-item :index="item.path">
            <component :is="item.icon" text="20px" />
            <span ml-30px>
              {{ item.name }}
            </span>
          </el-menu-item>
        </NuxtLink>
      </el-menu>

      <el-divider !mb-12px !mt-12px />
      <LayoutStorageUsageBox />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.side-bar {
  background-color: #edeff3;
}
</style>
