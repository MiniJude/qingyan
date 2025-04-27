<script setup lang="ts">
const { isMobileDevice } = useDeviceDetection()
const drawerVisible = ref(false)

// 打开抽屉菜单
function openDrawer() {
  drawerVisible.value = true
}

// 关闭抽屉菜单
function closeDrawer() {
  drawerVisible.value = false
}
</script>

<template>
  <main h-full w-full flex>
    <SideBar v-if="!isMobileDevice" />
    <div min-w-0 flex flex-1 flex-col>
      <Header @open-drawer="openDrawer" />
      <div min-h-0 flex-1 lt-md:overflow-y-auto>
        <slot />
      </div>
    </div>

    <!-- 移动端抽屉菜单 -->
    <el-drawer
      v-model="drawerVisible"
      size="280px"
      class="menu-drawer"
      :with-header="false"
      :show-close="false"
      direction="ltr"
      destroy-on-close
    >
      <SideBar @close-drawer="closeDrawer" />
    </el-drawer>
  </main>
</template>

<style lang="scss">
.menu-drawer {
  @media (max-width: 768px) {
    .el-drawer__body {
      padding: 0;
    }
  }
}
</style>
