<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { onClickOutside, useDebounce } from '@vueuse/core'
import { computed, nextTick, ref, watchEffect } from 'vue'

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'search', value: string): void
}>()

const searchValue = ref('')
const isSearchFocused = ref(false)
const isSearchHovered = ref(false)
const searchRef = ref<HTMLElement | null>(null)

// 使用VueUse的useDebounce实现防抖搜索
const debouncedSearchValue = useDebounce(searchValue, 500)

// 监听debouncedSearchValue变化并发出search事件
watchEffect(() => {
  if (debouncedSearchValue.value) {
    emit('search', debouncedSearchValue.value)
  }
})

// 处理回车键搜索
function handleKeyUp(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    searchRef.value?.blur()
  }
}

// 使用VueUse的onClickOutside监听点击外部事件
onClickOutside(searchRef, () => {
  isSearchFocused.value = false
})

// 处理失焦事件
function handleBlur() {
  isSearchFocused.value = false
}

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
  nextTick(() => {
    // 确保搜索框处于焦点状态
    searchRef.value?.querySelector('input')?.focus()
  })
}
</script>

<template>
  <ClientOnly>
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
        @blur="handleBlur"
        @keyup="handleKeyUp"
      >
        <template #prefix>
          <el-icon :size="isSearchFocused ? 24 : 20" color="var(--el-color-primary)">
            <Search />
          </el-icon>
        </template>
      </el-input>
    </div>
  </ClientOnly>
</template>

<style lang="scss" scoped>
.search-bar {
  transition: all 0.3s ease;
  position: relative;
  width: 260px;
  margin-left: auto;
  margin-right: 100px;

  .search-input {
    :deep(.el-input__wrapper) {
      border-radius: 50px;
      height: 36px;
      transition: all 0.3s ease;
      box-shadow: 0 0 0 1px var(--el-border-color) inset;

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
    width: 600px;
    z-index: 100;
    margin-right: 0;

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
