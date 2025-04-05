<script setup lang="ts">
import { ArrowDown, Search } from '@element-plus/icons-vue'
import SearchResult from '~/components/layout/SearchResult.vue'

definePageMeta({
  layout: false,
})

const route = useRoute() as any
const { type } = route.params
const queryParam = route.query.q as string || ''
const localePath = useLocalePath()

// 搜索类型选项
const searchTypes = [
  { value: 'group', label: '数字空间', icon: 'i-carbon:collaborate' },
  { value: 'code', label: 'Git', icon: 'i-carbon:code' },
  { value: 'article', label: '文章', icon: 'i-carbon:document' },
  { value: 'cloud', label: '云文档', icon: 'i-carbon:document' },
  { value: 'ai', label: 'AI文档', icon: 'i-carbon:machine-learning' },
  { value: 'discussion', label: '讨论', icon: 'i-carbon:chat' },
  { value: 'meeting', label: '会议室', icon: 'i-carbon:video-chat' },
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
  return option || sortOptions[0]
})

// 日期格式化
function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

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

  if (type === 'group') {
    let url = `/api/search/group/?search_type=group&order_by=${orderBy.value}`
    if (hasQuery) {
      url += `&q=${encodeURIComponent(searchValue.value)}`
    }
    url += `&pageNo=${currentPage.value}&pageSize=${pageSize.value}`
    return url
  }
  else if (type === 'code') {
    let url = `/api/search/code/?search_type=code&order_by=${orderBy.value}`
    if (hasQuery) {
      url += `&q=${encodeURIComponent(searchValue.value)}`
    }
    // 添加语言标签参数
    if (currentLang.value) {
      url += `&tag=${encodeURIComponent(currentLang.value)}`
    }
    url += `&pageNo=${currentPage.value}&pageSize=${pageSize.value}`
    return url
  }

  // 默认返回group接口
  let url = `/api/search/group/?search_type=group&order_by=${orderBy.value}`
  if (hasQuery) {
    url += `&q=${encodeURIComponent(searchValue.value)}`
  }
  url += `&pageNo=${currentPage.value}&pageSize=${pageSize.value}`
  return url
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
            <div :class="currentTypeItem.icon" />
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
                  <div :class="item.icon" />
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
            <span>{{ currentSortOption.label }}</span>
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

    <div class="search-results">
      <el-skeleton v-if="loading" :rows="5" animated />

      <div v-else-if="searchResults.length === 0" class="no-result">
        未找到相关结果
      </div>

      <!-- Git代码搜索结果 -->
      <div v-else-if="type === 'code'" class="code-result-list">
        <div v-for="item in searchResults" :key="item.id" class="code-item">
          <div class="code-icon">
            <div class="i-carbon:code" />
          </div>
          <div class="code-content">
            <h3 class="code-title">
              {{ item.title }}
            </h3>
            <p class="code-desc">
              {{ item.content }}
            </p>
            <div class="code-meta">
              <div class="meta-left">
                <div class="meta-item">
                  <div class="i-carbon:view" />
                  <span>{{ item.like }}</span>
                </div>
                <div class="meta-item">
                  <div class="i-carbon:star" />
                  <span>{{ item.favor }}</span>
                </div>
              </div>
              <div class="meta-user">
                <img :src="item.avatar || '/static/images/default-avatar.png'" class="user-avatar">
                <span>{{ item.username }}</span>
                <span class="date">{{ formatDate(item.create_datetime) }}</span>
              </div>
            </div>
          </div>
          <div v-if="item.score > 0" class="code-score">
            {{ item.score }}
          </div>
        </div>
      </div>

      <!-- 数字空间搜索结果 -->
      <div v-else-if="type === 'group'" class="group-result-list">
        <div v-for="item in searchResults" :key="item.id" class="group-item">
          <div class="group-content">
            <h3 class="group-title">
              {{ item.title }}
            </h3>
            <p class="group-desc">
              {{ item.content }}
            </p>
          </div>
        </div>
      </div>

      <!-- 分页 -->
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
  </div>
</template>

<style scoped>
.search-page {
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: var(--el-bg-color);
}

.search-header {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-bottom: 24px;
  position: relative; /* 添加相对定位，使SearchResult可以相对于它定位 */
}

.search-container {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 600px;
}

.search-input {
  flex: 1;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 25px;
  padding-left: 5px;
  padding-right: 6px;
  box-shadow: none;
  border: 1px solid var(--app-border-regular);
}

.search-input :deep(.el-input__inner) {
  height: 48px;
  font-size: 18px;
}

.search-filter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
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
}

.type-selector i {
  margin-right: 5px;
}

.type-selector span {
  margin: 0 5px;
  flex: 1;
}

.language-tabs {
  display: flex;
  margin-top: 15px;
  margin-bottom: 10px;
  overflow-x: auto;
  white-space: nowrap;
}

.tab {
  padding: 5px 12px;
  border-radius: 4px;
  margin-right: 10px;
  cursor: pointer;
  font-size: 14px;
}

.tab.active {
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
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
}

.filter-dropdown i {
  margin-left: 5px;
}

.search-results {
  min-height: 300px;
}

.no-result {
  text-align: center;
  color: var(--el-text-color-secondary);
  padding: 40px 0;
  font-size: 16px;
}

.code-result-list,
.group-result-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.code-item,
.group-item {
  display: flex;
  padding: 16px;
  border-radius: 8px;
  background-color: var(--el-bg-color-overlay);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
}

.code-item:hover,
.group-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.1);
}

.code-icon {
  margin-right: 16px;
  font-size: 24px;
  color: var(--el-color-primary);
}

.code-content,
.group-content {
  flex: 1;
}

.code-title,
.group-title {
  margin: 0 0 10px;
  font-size: 18px;
  color: var(--el-color-primary);
}

.code-desc,
.group-desc {
  margin: 0 0 16px;
  color: var(--el-text-color-primary);
  line-height: 1.6;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.code-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.meta-left {
  display: flex;
  gap: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.meta-user {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.date {
  margin-left: 8px;
  color: var(--el-text-color-secondary);
}

.code-score {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--el-color-success-light-9);
  color: var(--el-color-success);
  font-weight: bold;
  margin-left: 16px;
}

.pagination {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

:deep(.active-dropdown-item) {
  color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
}

:deep(.el-dropdown-menu__item i) {
  margin-right: 5px;
  font-size: 16px;
}

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
}

:deep(.el-dropdown-menu__item .flex) {
  display: flex;
  align-items: center;
}

:deep(.el-dropdown-menu__item:hover) {
  background-color: var(--el-color-primary-light-9);
}

:deep(.el-dropdown-menu__item.active-dropdown-item:hover) {
  background-color: var(--el-color-primary-light-8);
}

:deep(.el-dropdown-menu__item i.i-carbon\\:collaborate) {
  color: #7954e2;
}

:deep(.el-dropdown-menu__item i.i-carbon\\:code) {
  color: #fa8c16;
}

:deep(.el-dropdown-menu__item i.i-carbon\\:document) {
  color: #52c41a;
}

:deep(.el-dropdown-menu__item i.i-carbon\\:cloud-document) {
  color: #1890ff;
}

:deep(.el-dropdown-menu__item i.i-carbon\\:machine-learning) {
  color: #722ed1;
}

:deep(.el-dropdown-menu__item i.i-carbon\\:chat) {
  color: #13c2c2;
}

:deep(.el-dropdown-menu__item i.i-carbon\\:video-chat) {
  color: #eb2f96;
}
</style>
