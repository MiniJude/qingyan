<script setup lang="ts">
import { useDebounce } from '@vueuse/core'
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  visible: boolean
  searchValue?: string
}>()

// 创建一个ref作为源值
const searchValueRef = computed(() => props.searchValue || '')

// 正确使用防抖处理
const debouncedSearchValue = useDebounce(searchValueRef, 500)

// 定义API响应的类型
interface SearchResultItem {
  title: string
  total: number
  score: number
}

interface SearchResult {
  q: string
  total: number
  question: SearchResultItem
  article: SearchResultItem
  user: SearchResultItem
  group: SearchResultItem
  document: SearchResultItem
  code: SearchResultItem
  kanban: SearchResultItem
  items: any[]
  extra: any
}

const searchResults = ref<SearchResult>({
  q: '',
  total: 0,
  question: { title: '', total: 0, score: 0 },
  article: { title: '', total: 0, score: 0 },
  user: { title: '', total: 0, score: 0 },
  group: { title: '', total: 0, score: 0 },
  document: { title: '', total: 0, score: 0 },
  code: { title: '', total: 0, score: 0 },
  kanban: { title: '', total: 0, score: 0 },
  items: [],
  extra: null,
})

const isLoading = ref(false)

// 监听searchValue的实时变化，立即更新加载状态
watch(() => props.searchValue, (newValue) => {
  if (newValue && newValue.trim()) {
    // 当有输入值且不为空时，立即设置为加载状态
    isLoading.value = true
  }
  else {
    // 当输入值为空时，重置结果
    resetSearchResults()
    isLoading.value = false
  }
}, { immediate: false }) // 不立即执行，避免初始化时产生不必要的加载状态

// 监听防抖后的searchValue变化，执行搜索
watch(debouncedSearchValue, async (newValue) => {
  if (newValue && newValue.trim()) {
    if (props.visible) {
      // 发送API请求，但不再设置isLoading = true（因为已经设置过了）
      await fetchSearchResults(newValue)
    }
  }
  else {
    // 清空上次结果
    resetSearchResults()
    isLoading.value = false
  }
}, { immediate: false }) // 修改为不立即执行，由用户输入触发

// 监听visible变化，当面板显示且有搜索值时执行搜索
watch(() => props.visible, async (newValue) => {
  if (newValue && props.searchValue && props.searchValue.trim()) {
    // 当面板变为可见且有搜索值时，立即设置为加载状态
    isLoading.value = true

    // 如果已经有防抖后的搜索值，直接使用该值执行搜索
    if (debouncedSearchValue.value && debouncedSearchValue.value.trim()) {
      await fetchSearchResults(debouncedSearchValue.value)
    }
    // 否则使用当前搜索值执行搜索
    else if (props.searchValue) {
      await fetchSearchResults(props.searchValue)
    }
  }
})

// 重置搜索结果
function resetSearchResults() {
  searchResults.value = {
    q: '',
    total: 0,
    question: { title: '', total: 0, score: 0 },
    article: { title: '', total: 0, score: 0 },
    user: { title: '', total: 0, score: 0 },
    group: { title: '', total: 0, score: 0 },
    document: { title: '', total: 0, score: 0 },
    code: { title: '', total: 0, score: 0 },
    kanban: { title: '', total: 0, score: 0 },
    items: [],
    extra: null,
  }
}

async function fetchSearchResults(query: string) {
  if (!query.trim())
    return

  try {
    // 使用项目封装的API工具发起请求，使用新的代理路径
    const data = await $api<SearchResult>(`/api/search/hot/?q=${encodeURIComponent(query)}&search_type=1&domain=`)
    searchResults.value = data
  }
  catch (error) {
    console.error('搜索失败:', error)
    resetSearchResults()
  }
  finally {
    isLoading.value = false
  }
}

// 防止点击搜索结果面板时触发外部点击事件
function handleResultPanelClick(event: MouseEvent) {
  // 阻止事件冒泡，防止触发onClickOutside
  event.stopPropagation()
}
</script>

<template>
  <Transition name="search-result">
    <!-- 有搜索关键词且不在加载状态时显示结果面板 -->
    <div
      v-if="visible && props.searchValue && props.searchValue.trim() && !isLoading"
      class="search-result-panel"
      @click="handleResultPanelClick"
      @mousedown="handleResultPanelClick"
    >
      <div class="search-result-container">
        <div class="search-tabs">
          <button class="search-tab active">
            全站搜索
          </button>
        </div>

        <!-- 有搜索结果时显示内容 -->
        <div v-if="searchResults.total > 0" class="search-result-content">
          <!-- 数字空间结果 -->
          <div v-if="searchResults.group && searchResults.group.total > 0" class="search-result-item">
            <div class="item-icon">
              <div class="i-carbon:collaborate" />
            </div>
            <div class="item-content">
              {{ searchResults.group.title }}
            </div>
            <div class="item-link">
              共{{ searchResults.group.total }}条结果
            </div>
          </div>

          <!-- 代码结果 -->
          <div v-if="searchResults.code && searchResults.code.total > 0" class="search-result-item">
            <div class="item-icon">
              <div class="i-carbon:code" />
            </div>
            <div class="item-content">
              {{ searchResults.code.title }}
            </div>
            <div class="item-link">
              共{{ searchResults.code.total }}条结果
            </div>
          </div>

          <!-- 文章结果 -->
          <div v-if="searchResults.article && searchResults.article.total > 0" class="search-result-item">
            <div class="item-icon">
              <div class="i-carbon:document" />
            </div>
            <div class="item-content">
              {{ searchResults.article.title }}
            </div>
            <div class="item-link">
              共{{ searchResults.article.total }}条结果
            </div>
          </div>

          <!-- 文档结果 -->
          <div v-if="searchResults.document && searchResults.document.total > 0" class="search-result-item">
            <div class="item-icon">
              <div class="i-carbon:document-pdf" />
            </div>
            <div class="item-content">
              {{ searchResults.document.title }}
            </div>
            <div class="item-link">
              共{{ searchResults.document.total }}条结果
            </div>
          </div>

          <!-- 讨论结果 -->
          <div v-if="searchResults.question && searchResults.question.total > 0" class="search-result-item">
            <div class="item-icon">
              <div class="i-carbon:chat" />
            </div>
            <div class="item-content">
              {{ searchResults.question.title }}
            </div>
            <div class="item-link">
              共{{ searchResults.question.total }}条结果
            </div>
          </div>

          <!-- 任务看板结果 -->
          <div v-if="searchResults.kanban && searchResults.kanban.total > 0" class="search-result-item">
            <div class="item-icon">
              <div class="i-carbon:task" />
            </div>
            <div class="item-content">
              {{ searchResults.kanban.title }}
            </div>
            <div class="item-link">
              共{{ searchResults.kanban.total }}条结果
            </div>
          </div>
        </div>

        <!-- 无搜索结果时显示提示 -->
        <div v-else class="no-results">
          未找到相关结果
        </div>
      </div>
    </div>

    <!-- 加载中状态显示 -->
    <div
      v-else-if="visible && props.searchValue && props.searchValue.trim() && isLoading"
      class="search-result-panel loading-panel"
      @click="handleResultPanelClick"
      @mousedown="handleResultPanelClick"
    >
      <div class="search-result-container">
        <div class="search-loading">
          <el-skeleton :rows="4" animated />
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.search-result-panel {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 400px;
  min-height: 100px;
  height: auto;
  width: 100%;
  max-width: 600px;
  background-color: white;
  z-index: 99;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  transform-origin: top center;
  margin-top: 8px;
}

.search-result-container {
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  max-height: 400px;
}

.search-tabs {
  display: flex;
  padding: 8px 12px;
  margin-bottom: 0;
  border-bottom: 1px solid #eee;
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }
}

.search-tab {
  background: none;
  border: none;
  padding: 4px 8px;
  font-size: 14px;
  cursor: pointer;
  color: #606266;

  &.active {
    color: var(--el-color-primary);
    font-weight: 500;
    position: relative;
  }
}

.search-result-content {
  flex: 1;
  overflow-y: auto;
  max-height: 350px;
}

.search-result-item {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  position: relative;

  &:hover {
    background-color: #f9f9f9;
  }

  .item-icon {
    width: 20px;
    height: 20px;
    margin-right: 10px;
    display: flex;
    align-items: center;
    justify-content: center;

    .icon-space {
      color: #1890ff;
    }

    .icon-git {
      color: #fa8c16;
    }

    .icon-doc {
      color: #52c41a;
    }

    .icon-file {
      color: #13c2c2;
    }

    .icon-question {
      color: #722ed1;
    }

    .icon-kanban {
      color: #eb2f96;
    }

    .icon-user {
      color: #2f54eb;
    }
  }

  .item-content {
    flex: 1;
    font-size: 14px;
    color: #303133;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .item-link {
    font-size: 12px;
    color: #909399;
    margin-left: 10px;
    white-space: nowrap;
    display: flex;
    align-items: center;
  }
}

// 过渡效果
.search-result-enter-active {
  animation: search-result-in 0.2s ease-out;
}

.search-result-leave-active {
  animation: search-result-out 0.2s ease-in;
}

@keyframes search-result-in {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes search-result-out {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-10px);
  }
}

.search-loading {
  padding: 20px 12px;
}

.no-results {
  text-align: center;
  color: #909399;
  padding: 20px 0;
  font-size: 14px;
}

// 加载面板样式
.loading-panel {
  min-height: 100px;
  max-height: 200px;
}
</style>
