<script lang="ts" setup>
import SearchBar from './SearchBar.vue'
import SearchResult from './SearchResult.vue'

const searchValue = ref('')
const isSearchFocused = ref(false)

const { currentMenu } = useMenu()
const { t, locale, setLocale } = useI18n()
const localePath = useLocalePath()
const user = useUser()

// 个人中心弹框可见性
const userProfileDialogVisible = ref(false)

// 打开个人中心弹框
function openUserProfile() {
  userProfileDialogVisible.value = true
}

// 切换语言
function toggleLanguage() {
  setLocale(locale.value === 'en' ? 'zh-CN' : 'en')
}

// 退出登录
async function handleLogout() {
  await useLogout()
  ElMessage.success(t('login.logout_success'))
  const path = localePath('/' as I18nRoutePath)
  await navigateTo(path)
}

// 处理搜索
function handleSearch(_value: string) {
  // TODO: 实现搜索逻辑
}

// 处理SearchBar的聚焦状态变化
function handleSearchFocusChange(isFocused: boolean) {
  isSearchFocused.value = isFocused
}
</script>

<template>
  <div class="header-wrapper">
    <div class="header" p="l-24px r-53px" h-64px flex items-center justify-between>
      <div flex items-center>
        <component :is="currentMenu?.iconUrl" h-30px w-30px text-primary />
        <span ml-8px>{{ currentMenu?.name }}</span>
      </div>

      <SearchBar
        v-model="searchValue"
        @search="handleSearch"
        @focus-change="handleSearchFocusChange"
      />

      <div flex items-center gap-12px>
        <el-button link w-32px @click="toggleLanguage">
          {{ locale === 'en' ? '中' : 'EN' }}
        </el-button>
        <!-- <DarkToggle /> -->
        <SvgoNotice class="icon-notice" text="24px" cursor-pointer />
        <el-dropdown trigger="click">
          <div>
            <ClientOnly>
              <img v-if="user?.avatar" :src="user?.avatar" alt="avatar" h-36px w-36px cursor-pointer rounded-full>
              <img v-else src="@/assets/img/avatar.png" alt="avatar" h-36px w-36px cursor-pointer rounded-full>
            </ClientOnly>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <div class="flex items-center gap-2 text-tprimary dark:text-white" @click="openUserProfile">
                  <div i-carbon:user class="h-16px w-16px" />
                  {{ $t('header.user_center') }}
                </div>
              </el-dropdown-item>
              <el-dropdown-item divided>
                <div class="flex items-center gap-2 text-tprimary dark:text-white" @click="handleLogout">
                  <div i-carbon:logout class="h-16px w-16px" />
                  {{ $t('header.logout') }}
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <!-- 个人中心弹框 -->
      <UserProfileDialog v-model="userProfileDialogVisible" />
    </div>

    <!-- 搜索结果面板 -->
    <SearchResult :visible="isSearchFocused" :search-value="searchValue" />
  </div>
</template>

<style lang="scss" scoped>
.header-wrapper {
  position: relative;
  z-index: 100;
}

.header {
  border-bottom: 1px solid var(--app-border-regular);
  position: relative;

  .icon-notice {
    color: #4e5969;
  }
}
</style>
