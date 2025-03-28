<script setup lang="ts">
import { SvgoAiChat, SvgoFolder2 } from '#components'

const route = useRoute()
const { t } = useI18n()

// 改为计算属性，依赖 locale 变化自动更新
const menuList = computed(() => [
  {
    name: t('sidebar.knowledge_base'),
    icon: SvgoFolder2,
    path: '/knowledge-base',
  },
  {
    name: t('sidebar.ai_assistant'),
    icon: SvgoAiChat,
    path: '/agents',
  },
])

// 计算当前应该激活的菜单项
const activeMenu = computed(() => {
  return menuList.value.find(item => route.path.includes(item.path))?.path ?? ''
})
</script>

<template>
  <div class="side-bar bg-[#edeff3]" w-242px flex flex-col dark:bg-black>
    <!-- logo -->
    <!-- <div flex gap-2 h-69px items-center p="l-13px">
      <div i-carbon:logo-kubernetes text="primary 48px" />
      <span text="primary font-bold 28px">清研</span>
    </div> -->

    <img src="@/assets/img/logo.png" alt="logo" m="t-5px l-13px" h-64px w-134px>

    <div flex flex-1 flex-col p="t-13px r-16px b-13px l-15px">
      <!-- 空间切换 -->
      <div m="l-4px b-12px t-10px" h-35px flex cursor-pointer items-center>
        <div text="white 10px" h-36px w-36px flex-center rounded-5px bg-primary px-4px text-center>
          {{ $t('sidebar.digital_space') }}
        </div>
        <span m="l-21px" flex-1>{{ $t('sidebar.personal_space') }}</span>
        <div i-carbon:chevron-right h-20px w-20px />
      </div>

      <el-menu flex-1 pt-19px !b-0 :default-active="activeMenu">
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
