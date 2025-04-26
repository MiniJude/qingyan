<script setup lang="ts">
import type { Component, ShallowRef } from 'vue'
import { Switch } from '@element-plus/icons-vue'

interface MenuItem {
  /** 菜单唯一标识 */
  key: string
  /** 菜单图标 */
  icon: string
  /** 菜单名称 */
  name: string
  /** 菜单描述 */
  description?: string
  /** 菜单禁用状态 */
  disabled?: boolean
  /** 对应的面板组件 */
  component?: ShallowRef<Component>
  /** 面板组件的 props */
  props?: Record<string, any>
}

interface Props {
  /** 左侧菜单列表 */
  menuList: MenuItem[]
  /** 当前选中的菜单项 key，可以使用 v-model 进行双向绑定 */
  modelValue: string
  /** 内容高度 */
  contentHeight?: string | number
  /** 菜单宽度 */
  labelWidth?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  contentHeight: '600px',
  labelWidth: '160px',
})
const { isMobileDevice } = useDeviceDetection()
// 当前选中的菜单
const activeMenu = defineModel<string>('modelValue')

// 移动端菜单展示状态
const showMobileMenu = ref(false)

// 切换菜单
function switchMenu(key: string) {
  activeMenu.value = key
  if (isMobileDevice.value) {
    showMobileMenu.value = false
  }
}

// 切换移动端菜单显示状态
function toggleMobileMenu() {
  showMobileMenu.value = !showMobileMenu.value
}

// 内容高度
const contentHeightStyle = computed(() => {
  return typeof props.contentHeight === 'number'
    ? `${props.contentHeight}px`
    : props.contentHeight
})

// 菜单宽度
const labelWidthStyle = computed(() => {
  const width = typeof props.labelWidth === 'number'
    ? `${props.labelWidth}px`
    : props.labelWidth
  const defaultWidth = isMobileDevice.value ? '200px' : '160px'
  return width || defaultWidth
})

// 当前活动菜单
const currentActiveMenu = computed(() => {
  const menu = props.menuList.find(item => item.key === activeMenu.value)
  return menu
})
</script>

<template>
  <div class="menu-split-content relative flex" :style="{ height: contentHeightStyle }">
    <!-- 移动端蒙层 -->
    <div
      v-if="isMobileDevice && showMobileMenu"
      class="fixed inset-0 z-20 bg-black bg-opacity-40"
      @click="showMobileMenu = false"
    />

    <!-- 左侧菜单 -->
    <div
      class="z-30 flex flex-col gap-10px overflow-auto rounded-4px bg-white p-12px"
      :class="[
        { 'fixed left-0 top-0 bottom-0 w-200px transition-transform': isMobileDevice },
        isMobileDevice && !showMobileMenu ? '-translate-x-full' : 'translate-x-0',
      ]"
      :style="{ width: labelWidthStyle }"
    >
      <div
        v-for="menu in menuList" :key="menu.key"
        class="menu-btn hover:menu-btn-hover"
        :class="{ 'menu-btn-active': activeMenu === menu.key }"
        @click="switchMenu(menu.key)"
      >
        <div class="flex items-center gap-3">
          <div v-if="menu.icon" class="h-20px w-20px shrink-0" :class="[menu.icon]" />
          <span>{{ menu.name }}</span>
        </div>
      </div>
    </div>

    <!-- 竖分割线 -->
    <el-divider v-if="!isMobileDevice" direction="vertical" class="!h-full" />

    <!-- 右侧内容 -->
    <div class="flex-1 overflow-y-auto">
      <!-- 头部标题和描述 -->
      <div class="ml-20px">
        <div class="flex items-center text-20px font-bold lt-md:gap-8px">
          <!-- 移动端菜单切换按钮 -->
          <el-icon v-if="isMobileDevice" class="flex-center p-4px" size="24px" @click="toggleMobileMenu">
            <Switch class="text-primary" />
          </el-icon>
          {{ currentActiveMenu?.name }}
        </div>
        <div v-if="currentActiveMenu?.description" class="mt-8px text-tdisabled">
          {{ currentActiveMenu?.description }}
        </div>
        <el-divider class="!my-12px" />
      </div>
      <slot :active-menu="activeMenu">
        <component
          :is="currentActiveMenu?.component?.value"
          v-if="currentActiveMenu?.component"
          v-bind="currentActiveMenu?.props"
        />
        <div v-else>
          <ComingSoon />
        </div>
      </slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
