<script setup lang="ts">
import { ArrowDown, Search } from '@element-plus/icons-vue'

definePageMeta({
  layout: false,
})

const route = useRoute() as any
const { type } = route.params
const queryParam = route.query.q as string || ''
const localePath = useLocalePath()

// 搜索类型选项
const searchTypes = [
  { value: 'group', label: '数字空间' },
  { value: 'code', label: 'Git' },
  { value: 'article', label: '文章' },
  { value: 'document', label: '云文档' },
  { value: 'ai-doc', label: 'AI文档' },
  { value: 'question', label: '讨论' },
  { value: 'meeting', label: '会议室' },
  { value: 'kanban', label: '任务看板' },
]

const currentTypeItem = computed(() => {
  return searchTypes.find(item => item.value === type)!
})

// 切换搜索类型
function handleChangeSearchType(typeValue: string) {
  if (typeValue !== type) {
    // 保留查询参数
    const query = route.query.q ? { q: route.query.q } : {}
    navigateTo({
      path: localePath(`/search/${typeValue}` as any),
      query,
    })
  }
}

// 定义接口响应类型
interface SearchResultItem {
  id: string
  title: string
  content: string
  username: string
  group: string
  create_datetime: string
  image: string
  avatar: string
  score: number
  like: number
  favor: number
  download: number
  tags?: { id: string, title: string }[]
  [key: string]: any
}

interface ResData {
  items: SearchResultItem[]
  total: number
  langTopList?: { name: string, rank: number }[]
  extra: any
}

// 排序选项
const sortOptions = [
  { value: 'match_desc', label: '按关键词匹配程度' },
  { value: 'date_desc', label: '按创建日期' },
]

const searchValue = ref(queryParam)
const isSearchFocused = ref(false)
const loading = ref(false)
const searchResults = ref<SearchResultItem[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const langTopList = ref<{ name: string, rank: number }[]>([])
const orderBy = ref('match_desc') // 默认排序方式
const currentLang = ref('') // 当前选中的语言标签，空字符串表示"全部"

// 处理排序方式变更
function handleSortChange(sortValue: string) {
  if (orderBy.value !== sortValue) {
    orderBy.value = sortValue
    currentPage.value = 1 // 切换排序时重置为第一页
    searchData()
  }
}

// 获取当前选中的排序选项
const currentSortOption = computed(() => {
  const option = sortOptions.find(option => option.value === orderBy.value)
  // 确保不返回undefined
  return option || sortOptions[0]
})

// 处理语言标签点击
function handleLangChange(lang: string) {
  if (currentLang.value !== lang) {
    currentLang.value = lang
    currentPage.value = 1 // 切换语言时重置为第一页
    searchData()
  }
}

// 监听type变化，重置当前语言
watch(() => type, () => {
  currentLang.value = ''
})

// 根据type获取接口URL
function getApiUrl() {
  const hasQuery = searchValue.value.trim() !== ''
  const baseParams = `&pageNo=${currentPage.value}&pageSize=${pageSize.value}`

  // 构建共用的查询参数
  const queryParams = hasQuery ? `&q=${encodeURIComponent(searchValue.value)}` : ''

  // 根据不同类型构建URL
  const urlMap = {
    'group': `/api/search/group/?search_type=group&order_by=${orderBy.value}${queryParams}${baseParams}`,
    'code': `/api/search/code/?search_type=code&order_by=${orderBy.value}${queryParams}${currentLang.value ? `&tag=${encodeURIComponent(currentLang.value)}` : ''}${baseParams}`,
    'article': `/api/search/article/?search_type=article&order_by=${orderBy.value}${queryParams}${baseParams}`,
    'document': `/api/search/document/?search_type=document&order_by=${orderBy.value}${queryParams}${baseParams}`,
    'ai-doc': `/api/search/ai_doc/?search_type=ai-doc&order_by=${orderBy.value}${queryParams}${baseParams}`,
    'question': `/api/search/question/?search_type=question&order_by=${orderBy.value}${queryParams}${baseParams}`,
    'meeting': `/api/search/meeting/?search_type=meeting&order_by=${orderBy.value}${queryParams}${baseParams}`,
    'kanban': `/api/search/kanban/?search_type=kanban&order_by=${orderBy.value}${queryParams}${baseParams}`,
  }

  // 返回对应类型的URL，如果类型不存在则返回group的URL
  return urlMap[type as keyof typeof urlMap] || urlMap.group
}

// 搜索方法 - 只在点击搜索按钮时调用
async function searchData() {
  loading.value = true
  try {
    const apiUrl = getApiUrl()
    // $api 直接返回 response.data
    const data = await $api<ResData>(apiUrl)
    searchResults.value = data.items || []
    total.value = data.total || 0

    // 保存语言列表
    langTopList.value = data.langTopList || []

    // 更新URL查询参数
    if (searchValue.value.trim()) {
      await navigateTo({
        path: route.path,
        query: { q: searchValue.value },
      })
    }
    else if (route.query.q) {
      // 如果搜索框为空但URL有q参数，则移除q参数
      await navigateTo({
        path: route.path,
      })
    }
  }
  catch (error) {
    console.error('搜索失败:', error)
    searchResults.value = []
    total.value = 0
    langTopList.value = []
  }
  finally {
    loading.value = false
  }
}

// 分页改变事件
function handlePageChange(page: number) {
  currentPage.value = page
  searchData()
}

// 处理搜索框获得焦点
function handleFocus() {
  isSearchFocused.value = true
}

// 处理搜索框失去焦点
function handleBlur() {
  isSearchFocused.value = false
}

// 让搜索框获得焦点
function focusSearchInput() {
  const inputEl = document.querySelector('.search-input input')
  if (inputEl) {
    (inputEl as HTMLElement).focus()
  }
}

// 在页面加载时，无论是否有q参数都执行搜索
onMounted(() => {
  searchData()
})

// 监听路由查询参数变化
watch(() => route.query, (newQuery, oldQuery) => {
  // 如果q参数发生变化
  if (newQuery.q !== oldQuery.q) {
    // 更新搜索输入框的值
    if (newQuery.q !== searchValue.value) {
      searchValue.value = newQuery.q as string || ''
    }
    // 重置分页到第一页
    currentPage.value = 1
  }
  // 重新执行搜索
  searchData()
}, { deep: true })
</script>

<template>
  <div class="search-page">
    <div class="search-header">
      <div class="search-container">
        <el-input
          v-model="searchValue"
          class="search-input"
          :placeholder="$t('common.search.placeholder')"
          @focus="handleFocus"
          @blur="handleBlur"
        >
          <template #prefix>
            <el-icon color="#606266" class="!ml-2" size="24px">
              <Search />
            </el-icon>
          </template>
          <template #suffix>
            <el-button round type="primary" class="w-70px !h-36px" @click="focusSearchInput">
              搜索
            </el-button>
          </template>
        </el-input>
      </div>

      <!-- 搜索下拉结果面板，放在search-header内部以便正确定位 -->
      <SearchResult
        :visible="isSearchFocused"
        :search-value="searchValue"
        width="600px"
        class="mt-2"
      />
    </div>

    <!-- 搜索类型选择 -->
    <div class="search-filter">
      <div class="filter-left">
        <el-dropdown trigger="click" @command="handleChangeSearchType">
          <div class="type-selector">
            <span>{{ currentTypeItem.label }}</span>
            <el-icon class="el-icon--right">
              <ArrowDown />
            </el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="item in searchTypes"
                :key="item.value"
                :command="item.value"
                :class="{ 'active-dropdown-item': item.value === type }"
              >
                <div class="flex items-center">
                  <span class="ml-2">{{ item.label }}</span>
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <!-- 语言选择标签栏 -->
      <div v-if="type === 'code'" class="language-tabs">
        <div
          v-if="langTopList.length > 0"
          class="tab"
          :class="{ active: currentLang === '' }"
          @click="handleLangChange('')"
        >
          全部
        </div>
        <div
          v-for="lang in langTopList"
          :key="lang.name"
          class="tab"
          :class="{ active: currentLang === lang.name }"
          @click="handleLangChange(lang.name)"
        >
          {{ lang.name }}
        </div>
      </div>

      <div class="filter-right">
        <el-dropdown trigger="click" @command="handleSortChange">
          <div class="filter-dropdown">
            <span>{{ currentSortOption?.label || '按关键词匹配程度' }}</span>
            <el-icon><ArrowDown /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="option in sortOptions"
                :key="option.value"
                :command="option.value"
                :class="{ 'active-dropdown-item': option.value === orderBy }"
              >
                {{ option.label }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <div class="search-content">
      <div class="search-results">
        <el-skeleton v-if="loading" :rows="5" animated />

        <div v-else-if="searchResults.length === 0" class="no-result">
          未找到相关结果
        </div>

        <!-- 数字空间搜索结果 -->
        <div v-else-if="type === 'group'" class="result-list group-result-list">
          <GroupCard
            v-for="item in searchResults"
            :key="item.id"
            :data="item"
          />
        </div>

        <!-- Git代码搜索结果 -->
        <div v-else-if="type === 'code'" class="result-list code-result-list">
          <CodeCard
            v-for="item in searchResults"
            :key="item.id"
            :data="item"
          />
        </div>

        <!-- 文章搜索结果 -->
        <div v-else-if="type === 'article'" class="result-list article-result-list">
          <ArticleCard
            v-for="item in searchResults"
            :key="item.id"
            :data="item"
          />
        </div>

        <!-- 文档搜索结果 -->
        <div v-else-if="type === 'document'" class="result-list document-result-list">
          <DocumentCard
            v-for="item in searchResults"
            :key="item.id"
            :data="item"
          />
        </div>

        <!-- 讨论搜索结果 -->
        <div v-else-if="type === 'question'" class="result-list question-result-list">
          <QuestionCard
            v-for="item in searchResults"
            :key="item.id"
            :data="item"
          />
        </div>

        <!-- 任务看板搜索结果 -->
        <div v-else-if="type === 'kanban'" class="result-list kanban-result-list">
          <KanbanCard
            v-for="item in searchResults"
            :key="item.id"
            :data="item"
          />
        </div>
      </div>
    </div>

    <!-- 分页 - 移到搜索内容外部 -->
    <div v-if="!loading && total > 0" class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        background
        :page-size="pageSize"
        :total="total"
        layout="prev, pager, next"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 30px 0;
  max-width: 1200px;
  margin: 0 auto;
  background-color: var(--el-bg-color);
}

.search-header {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-bottom: 24px;
  position: relative;
}

.search-container {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 600px;
}

.search-input {
  flex: 1;

  :deep(.el-input__wrapper) {
    border-radius: 25px;
    padding-left: 5px;
    padding-right: 6px;
    box-shadow: none;
    border: 1px solid var(--app-border-regular);
  }

  :deep(.el-input__inner) {
    height: 48px;
    font-size: 18px;
  }
}

.search-filter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  padding: 0 20px;
}

.filter-left {
  display: flex;
  align-items: center;
}

.type-selector {
  display: flex;
  align-items: center;
  background-color: var(--el-fill-color-light);
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  min-width: 100px;
  justify-content: space-between;

  i {
    margin-right: 5px;
  }

  span {
    margin: 0 5px;
    flex: 1;
  }
}

.language-tabs {
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
}

.tab {
  padding: 5px 12px;
  border-radius: 4px;
  margin-right: 10px;
  cursor: pointer;
  font-size: 14px;

  &.active {
    background-color: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
  }
}

.filter-right {
  display: flex;
  align-items: center;
}

.filter-dropdown {
  display: flex;
  align-items: center;
  background-color: var(--el-fill-color-light);
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;

  i {
    margin-left: 5px;
  }
}

.search-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0; /* 确保flex子元素不会超出父元素 */
}

.search-results {
  flex: 1;
  min-height: 0;
  padding: 20px;
  padding-bottom: 0;
  overflow-y: auto;
}

.no-result {
  text-align: center;
  color: var(--el-text-color-secondary);
  padding: 40px 0;
  font-size: 16px;
}

.result-list {
  padding-right: 10px; /* 为滚动条预留空间 */
  padding-bottom: 12px;
  padding-top: 12px;
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));

  &.group-result-list {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
  &.code-result-list {
    grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  }
  &.article-result-list {
    grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  }
  &.document-result-list {
    grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  }
  &.question-result-list {
    grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  }
  &.kanban-result-list {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

/* 选择器修复 */
:deep(.active-dropdown-item) {
  color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
}

/* 拆分嵌套选择器，避免在:deep后使用&符号 */
:deep(.el-dropdown-menu) {
  border-radius: 8px;
  padding: 4px 0;
  min-width: 120px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

:deep(.el-dropdown-menu__item) {
  line-height: 36px;
  font-size: 14px;
  padding: 0 16px;

  &:hover {
    background-color: var(--el-color-primary-light-9);
  }

  &.active-dropdown-item:hover {
    background-color: var(--el-color-primary-light-8);
  }
}

:deep(.el-dropdown-menu__item i) {
  margin-right: 5px;
  font-size: 16px;
}

:deep(.el-dropdown-menu__item .flex) {
  display: flex;
  align-items: center;
}
</style>
