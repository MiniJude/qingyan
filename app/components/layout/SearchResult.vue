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
    // 使用项目封装的API工具发起请求，并在URL前拼接'/copy/?url='
    const data = await $api<SearchResult>(`/copy/?url=https://www.writebug.com/api/v3/search/hot/?q=${encodeURIComponent(query)}&search_type=1&domain=`)
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
          <!-- 总搜索结果提示 -->
          <div class="search-total">
            共找到 {{ searchResults.total }} 条结果
          </div>

          <!-- 数字空间结果 -->
          <div v-if="searchResults.group && searchResults.group.total > 0" class="search-result-item">
            <div class="item-icon">
              <div class="icon-space">
                空
              </div>
            </div>
            <div class="item-content">
              <div class="item-title">
                {{ searchResults.group.title }}
              </div>
            </div>
            <div class="item-link">
              共{{ searchResults.group.total }}条结果
            </div>
          </div>

          <!-- 代码结果 -->
          <div v-if="searchResults.code && searchResults.code.total > 0" class="search-result-item">
            <div class="item-icon">
              <div class="icon-git">
                码
              </div>
            </div>
            <div class="item-content">
              <div class="item-title">
                {{ searchResults.code.title }}
              </div>
            </div>
            <div class="item-link">
              共{{ searchResults.code.total }}条结果
            </div>
          </div>

          <!-- 文章结果 -->
          <div v-if="searchResults.article && searchResults.article.total > 0" class="search-result-item">
            <div class="item-icon">
              <div class="icon-doc">
                文
              </div>
            </div>
            <div class="item-content">
              <div class="item-title">
                {{ searchResults.article.title }}
              </div>
            </div>
            <div class="item-link">
              共{{ searchResults.article.total }}条结果
            </div>
          </div>

          <!-- 文档结果 -->
          <div v-if="searchResults.document && searchResults.document.total > 0" class="search-result-item">
            <div class="item-icon">
              <div class="icon-file">
                档
              </div>
            </div>
            <div class="item-content">
              <div class="item-title">
                {{ searchResults.document.title }}
              </div>
            </div>
            <div class="item-link">
              共{{ searchResults.document.total }}条结果
            </div>
          </div>

          <!-- 讨论结果 -->
          <div v-if="searchResults.question && searchResults.question.total > 0" class="search-result-item">
            <div class="item-icon">
              <div class="icon-question">
                讨
              </div>
            </div>
            <div class="item-content">
              <div class="item-title">
                {{ searchResults.question.title }}
              </div>
            </div>
            <div class="item-link">
              共{{ searchResults.question.total }}条结果
            </div>
          </div>

          <!-- 任务看板结果 -->
          <div v-if="searchResults.kanban && searchResults.kanban.total > 0" class="search-result-item">
            <div class="item-icon">
              <div class="icon-kanban">
                任
              </div>
            </div>
            <div class="item-content">
              <div class="item-title">
                {{ searchResults.kanban.title }}
              </div>
            </div>
            <div class="item-link">
              共{{ searchResults.kanban.total }}条结果
            </div>
          </div>

          <!-- 用户结果 -->
          <div v-if="searchResults.user && searchResults.user.total > 0" class="search-result-item">
            <div class="item-icon">
              <div class="icon-user">
                人
              </div>
            </div>
            <div class="item-content">
              <div class="item-title">
                {{ searchResults.user.title }}
              </div>
            </div>
            <div class="item-link">
              共{{ searchResults.user.total }}条结果
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
  left: 50%;
  transform: translateX(-50%);
  right: auto;
  max-height: 500px;
  min-height: 100px;
  height: auto;
  width: 700px;
  background-color: white;
  z-index: 99;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  overflow: hidden;
  transform-origin: top center;
}

.search-result-container {
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
  max-height: calc(500px - 32px);
}

.search-tabs {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }
}

.search-tab {
  background: none;
  border: none;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  color: #999;

  &.active {
    color: var(--el-color-primary);
    font-weight: 500;
    position: relative;

    &:after {
      content: '';
      position: absolute;
      bottom: -9px;
      left: 0;
      right: 0;
      height: 2px;
      background-color: var(--el-color-primary);
    }
  }
}

.search-result-content {
  flex: 1;
  overflow-y: auto;
  max-height: 400px;
}

.search-result-item {
  display: flex;
  align-items: center;
  padding: 12px 8px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  position: relative;

  &:hover {
    background-color: #f9f9f9;
  }

  .item-icon {
    width: 32px;
    height: 32px;
    margin-right: 12px;
    display: flex;
    align-items: center;
    justify-content: center;

    .icon-space,
    .icon-git,
    .icon-doc,
    .icon-file,
    .icon-question,
    .icon-kanban,
    .icon-user {
      width: 24px;
      height: 24px;
      background-color: #f0f0f0;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: #666;
    }
  }

  .item-content {
    flex: 1;

    .item-title {
      font-size: 14px;
      color: #333;
    }
  }

  .item-link {
    font-size: 12px;
    color: #999;
    margin-left: 10px;
    white-space: nowrap;

    &::after {
      content: '>';
      margin-left: 4px;
    }
  }
}

// 过渡效果
.search-result-enter-active {
  animation: search-result-in 0.5s ease-out;
}

.search-result-leave-active {
  animation: search-result-out 0.5s ease-in;
}

@keyframes search-result-in {
  0% {
    opacity: 0;
    clip-path: inset(0 0 100% 0);
  }
  100% {
    opacity: 1;
    clip-path: inset(0 0 0 0);
  }
}

@keyframes search-result-out {
  0% {
    opacity: 1;
    clip-path: inset(0 0 0 0);
  }
  100% {
    opacity: 0;
    clip-path: inset(0 0 100% 0);
  }
}

// 添加新的样式
.search-total {
  font-size: 12px;
  color: #666;
  margin-bottom: 16px;
  padding-left: 4px;
}

.search-loading {
  padding: 20px 0;
}

.no-results {
  text-align: center;
  color: #999;
  padding: 40px 0;
  font-size: 14px;
}

// 加载面板样式
.loading-panel {
  min-height: 200px;
  height: auto;
}

// 调整图标样式
.icon-space {
  background-color: #e6f7ff;
  color: #1890ff;
}
.icon-git {
  background-color: #fff2e8;
  color: #fa8c16;
}
.icon-doc {
  background-color: #f6ffed;
  color: #52c41a;
}
.icon-file {
  background-color: #e6fffb;
  color: #13c2c2;
}
.icon-question {
  background-color: #f9f0ff;
  color: #722ed1;
}
.icon-kanban {
  background-color: #fcf4f6;
  color: #eb2f96;
}
.icon-user {
  background-color: #f0f5ff;
  color: #2f54eb;
}
</style>
