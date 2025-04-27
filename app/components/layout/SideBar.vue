<script setup lang="ts">
// 定义emit事件
const emit = defineEmits<{
  (e: 'closeDrawer'): void
}>()
const route = useRoute()
const spaceStore = useSpaceStore()
const { isMobileDevice } = useDeviceDetection()
const { menu: menuList } = useMenu()

// 侧边栏折叠状态
const isCollapsed = ref(false)

// 切换侧边栏折叠状态
function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value
}

// 计算当前应该激活的菜单项
const activeMenu = computed(() => {
  // 获取当前路径的最后一部分，例如从/group/1/knowledge-base中提取knowledge-base
  const pathSegments = route.path.split('/')
  const lastSegment = pathSegments[pathSegments.length - 1]

  return menuList.value.find(item =>
    item.path.replace('/', '') === lastSegment
    || route.path.includes(item.path.replace('/', '')),
  )?.path.replace('/', '') ?? ''
})

// 生成带有当前空间ID的菜单路径
function getMenuPath(path: string): string {
  // 获取当前空间ID，如果不存在则使用默认值1
  const currentSpaceId = spaceStore.currentSpace?.id || '1'
  // 组合完整路径
  return `/group/${currentSpaceId}/${path.replace('/', '')}`
}

// 点击菜单项的处理函数
function handleMenuClick() {
  // 发出关闭抽屉的事件
  emit('closeDrawer')
}
</script>

<template>
  <div
    class="side-bar bg-board lt-md:h-full lt-md:w-full"
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
        v-if="!isMobileDevice"
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
        <NuxtLink
          v-for="item in menuList"
          :key="item.path"
          :to="getMenuPath(item.path)"
          @click="handleMenuClick"
        >
          <el-menu-item :index="item.path.replace('/', '')">
            <component :is="item.iconUrl" class="w-20px text-20px" />
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

<style lang="scss" scoped>
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
