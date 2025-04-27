<script setup lang="ts">
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import AgentList from './agents/components/AgentList.vue'

definePageMeta({
  middleware: ['auth', 'space-loader'],
})

// 获取设备类型
const { isMobileDevice } = useDeviceDetection()

// 侧边栏折叠状态
const isCollapsed = ref(isMobileDevice.value)

// 监听设备类型变化，自动调整抽屉状态
watch(isMobileDevice, (newValue) => {
  isCollapsed.value = newValue
})

// 切换抽屉显示/隐藏状态
function toggleDrawer() {
  isCollapsed.value = !isCollapsed.value
}
</script>

<template>
  <div class="agents-wrapper" h-full>
    <div class="agent-side-bar" :class="{ collapsed: isCollapsed }">
      <AgentList class="flex-shrink-0" />

      <!-- 移动端展开/收起按钮 -->
      <div
        v-if="isMobileDevice"
        class="drawer-toggle-btn"
        @click="toggleDrawer"
      >
        <el-icon size="20">
          <component :is="isCollapsed ? ArrowRight : ArrowLeft" />
        </el-icon>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="agent-content">
      <NuxtPage />
    </div>

    <!-- 移动端蒙层 -->
    <div
      v-if="isMobileDevice && !isCollapsed"
      class="mobile-overlay"
      @click="toggleDrawer"
    />
  </div>
</template>

<style scoped lang="scss">
.agents-wrapper {
  position: relative;
  display: flex;
  height: 100%;
}

.agent-side-bar {
  position: relative;
  height: 100%;
  transition: transform 0.3s ease;

  @media (max-width: 767px) {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    background-color: var(--el-bg-color);
    z-index: 1000;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

    &.collapsed {
      transform: translateX(-100%);
    }
  }

  .drawer-toggle-btn {
    position: absolute;
    top: 50%;
    right: -32px;
    width: 32px;
    height: 40px;
    background-color: var(--el-color-primary);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 0 4px 4px 0;
    z-index: 1000;
    transform: translateY(-50%);
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
    transition: right 0.3s ease;
  }
}

.agent-content {
  flex: 1;
  height: 100%;
  overflow: auto;
}

.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  backdrop-filter: blur(2px);
}
</style>
