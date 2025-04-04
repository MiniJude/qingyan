<script setup lang="ts">
import type { Component, ShallowRef } from 'vue'

interface MenuItem {
  /** 菜单唯一标识 */
  key: string
  /** 菜单图标 */
  icon: string
  /** 菜单名称 */
  name: string
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
}

const props = withDefaults(defineProps<Props>(), {
  contentHeight: '600px',
})

// 当前选中的菜单
const activeMenu = defineModel<string>('modelValue')

// 切换菜单
function switchMenu(key: string) {
  activeMenu.value = key
}

// 内容高度
const contentHeightStyle = computed(() => {
  return typeof props.contentHeight === 'number'
    ? `${props.contentHeight}px`
    : props.contentHeight
})

// 当前活动菜单
const currentActiveMenu = computed(() => {
  const menu = props.menuList.find(item => item.key === activeMenu.value)
  return menu
})
</script>

<template>
  <div class="menu-split-content flex" :style="{ height: contentHeightStyle }">
    <!-- 左侧菜单 -->
    <div class="w-160px flex flex-col gap-10px rounded-4px p-12px">
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
    <el-divider direction="vertical" class="!h-full" />

    <!-- 右侧内容 -->
    <div class="flex-1 overflow-y-auto">
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
