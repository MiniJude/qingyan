<script setup lang="ts">
import { SvgoAiChat, SvgoFolder2 } from '#components'

const route = useRoute()
const { t } = useI18n()

const localePath = useLocalePath()

// 侧边栏折叠状态
const isCollapsed = ref(false)

// 切换侧边栏折叠状态
function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value
}

// 改为计算属性，依赖 locale 变化自动更新
const menuList = computed<{
  name: string
  icon: Component
  path: any
}[]>(() => [
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
  <div
    class="side-bar bg-board"
    :class="[isCollapsed ? 'w-80px' : 'w-242px']"
    relative flex flex-col dark:bg-black
  >
    <div class="flex items-center overflow-hidden">
      <div
        class="logo"
        :class="isCollapsed ? 'logo-collapsed' : 'logo-expanded'"
      />

      <!-- 展开/收起按钮 -->
      <div
        class="collapse-btn bg-white dark:bg-gray-300"
        :class="isCollapsed ? 'right-[-12px] top-20px' : 'right-3 top-20px'"
        @click="toggleSidebar"
      >
        <div
          i-carbon:chevron-left
          h-20px
          w-20px
          :class="{ 'rotate-180': isCollapsed }"
          class="text-primary transition-transform duration-300"
        />
      </div>
    </div>

    <div flex flex-1 flex-col p="t-13px r-16px b-13px l-15px">
      <!-- 空间切换 -->
      <SpaceSwitcher :is-collapsed="isCollapsed" />

      <el-menu
        class="flex-1 pt-19px !b-0"
        :default-active="activeMenu"
        :collapse="isCollapsed"
        :collapse-transition="false"
      >
        <NuxtLink v-for="item in menuList" :key="item.path" :to="localePath(item.path)">
          <el-menu-item :index="item.path">
            <component :is="item.icon" text="20px" />
            <template #title>
              <span :class="{ 'ml-30px': !isCollapsed }">
                {{ item.name }}
              </span>
            </template>
          </el-menu-item>
        </NuxtLink>
      </el-menu>

      <el-divider class="!mb-12px !mt-12px" />
      <StorageUsageBox :is-collapsed="isCollapsed" />
    </div>
  </div>
</template>

<style scoped>
.side-bar {
  transition: width 0.3s ease;
}

.collapse-btn {
  position: absolute;
  cursor: pointer;
  border-radius: 9999px;
  padding: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 10;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.side-bar:hover .collapse-btn {
  opacity: 1;
}

.logo {
  margin-top: 5px;
  margin-left: 14px;
  height: 64px;
  transition: all 0.3s ease;
  background-repeat: no-repeat;
  background-position: left center;
  background-image: url('@/assets/img/logo.png');
  background-size: cover;
}

.logo-expanded {
  width: 134px;
}

.logo-collapsed {
  width: 48px;
}
</style>
