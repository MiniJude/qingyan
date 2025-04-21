<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { onClickOutside } from '@vueuse/core'

const emit = defineEmits<{
  (e: 'search', value: string): void
  (e: 'focusChange', isFocused: boolean): void
}>()

const searchValue = defineModel<string>({ required: false, default: '' })
const isSearchFocused = ref(false)
const isSearchHovered = ref(false)
const searchRef = ref<HTMLElement | null>(null)

// 当搜索值变化时触发搜索事件
watch(searchValue, (newValue) => {
  emit('search', newValue)
})

// 监听聚焦状态变化并发出focusChange事件
watch(isSearchFocused, (newValue) => {
  emit('focusChange', newValue)
})

// 处理回车键搜索
function handleKeyUp(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    searchRef.value?.blur()
  }
}

// 使用VueUse的onClickOutside监听点击外部事件
onClickOutside(searchRef, (event) => {
  // 检查点击的元素是否在搜索结果面板内
  const clickedElement = event.target as HTMLElement
  const isClickInSearchResult = clickedElement.closest('.search-result-panel') !== null

  // 如果点击的不是搜索结果面板，才设置失焦
  if (!isClickInSearchResult) {
    isSearchFocused.value = false
  }
})

// 处理鼠标移入事件
function handleMouseEnter() {
  isSearchHovered.value = true
}

// 处理鼠标移出事件
function handleMouseLeave() {
  if (!isSearchFocused.value) {
    isSearchHovered.value = false
  }
}

// 计算搜索框样式类
const searchBarClass = computed(() => {
  return {
    'search-bar': true,
    'search-bar-hovered': isSearchHovered.value && !isSearchFocused.value,
    'search-bar-focused': isSearchFocused.value,
  }
})

// 处理聚焦事件
function handleFocus() {
  isSearchFocused.value = true
  isSearchHovered.value = false
}
</script>

<template>
  <div
    :class="searchBarClass"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <el-input
      ref="searchRef"
      v-model="searchValue"
      class="search-input"
      :placeholder="$t('common.search.placeholder')"
      @focus="handleFocus"
      @keyup="handleKeyUp"
    >
      <template #prefix>
        <el-icon :size="isSearchFocused ? 24 : 20" color="var(--el-color-primary)">
          <Search />
        </el-icon>
      </template>
    </el-input>
  </div>
</template>

<style lang="scss" scoped>
.search-bar {
  transition: all 0.3s ease;
  position: relative;
  width: 260px;
  position: absolute;
  right: 220px;
  @media (max-width: 768px) {
    right: 120px;
    width: 50px;
  }

  .search-input {
    :deep(.el-input__wrapper) {
      border-radius: 50px;
      height: 36px;
      transition: all 0.3s ease;
      box-shadow: 0 0 0 1px var(--el-border-color) inset;
      @media (max-width: 768px) {
        box-shadow: 0 0 0 1px transparent inset;
      }

      &:hover,
      &:focus {
        box-shadow: 0 0 0 1px var(--el-color-primary) inset;
      }
    }

    :deep(.el-input__inner) {
      font-size: 14px;
      transition: all 0.3s ease;
    }
  }

  // Hover状态：略微向左移动并变宽
  &.search-bar-hovered {
    width: 320px;
    margin-right: 60px;

    .search-input {
      :deep(.el-input__wrapper) {
        box-shadow: 0 0 0 1px var(--el-color-primary) inset;
      }
    }
  }

  // 聚焦状态：完全居中且明显加宽
  &.search-bar-focused {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 700px;
    z-index: 100;
    margin-right: 0;

    @media (max-width: 768px) {
      width: 100%;
    }

    .search-input {
      :deep(.el-input__wrapper) {
        border-radius: 16px;
        height: 48px;
        box-shadow: 0 0 0 2px var(--el-color-primary) inset;
        border-radius: 24px;
      }

      :deep(.el-input__inner) {
        height: 48px;
        font-size: 16px;
        padding-left: 20px;
      }
    }
  }
}
</style>
