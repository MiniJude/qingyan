<script lang="ts" setup>
import { useUserStore } from '~/stores/user'
import SearchBar from './SearchBar.vue'
import SearchResult from './SearchResult.vue'

const emit = defineEmits<{
  (e: 'openDrawer'): void
}>()
const searchValue = ref('')
const isSearchFocused = ref(false)

const { currentMenu } = useMenu()
const { t, locale, setLocale } = useI18n()
const localePath = useLocalePath()
const userStore = useUserStore()
const { isMobileDevice } = useDeviceDetection()
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

// 打开移动端菜单抽屉
function openMobileDrawer() {
  emit('openDrawer')
}
</script>

<template>
  <div class="header-wrapper">
    <div class="header lt-md:pl-8px lt-md:pr-8px" p="l-24px r-53px" h-64px flex items-center justify-between>
      <div flex items-center>
        <!-- 移动端菜单图标 -->
        <el-button v-if="isMobileDevice" link @click="openMobileDrawer">
          <div i-carbon:menu h-24px w-24px text-primary />
        </el-button>
        <component :is="currentMenu?.iconUrl" class="h-30px w-30px text-20px text-primary lt-md:hidden" />
        <span class="ml-8px shrink-0 lt-md:text-primary">{{ currentMenu?.name }}</span>
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
        <SvgoNotice class="icon-notice shrink-0" text="24px" cursor-pointer />
        <el-dropdown trigger="click">
          <div class="shrink-0">
            <ClientOnly>
              <img v-if="userStore.userInfo?.avatar" :src="userStore.userInfo.avatar" alt="avatar" h-36px w-36px cursor-pointer rounded-full>
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
    <SearchResult :visible="isSearchFocused" :search-value="searchValue" :width="isMobileDevice ? '100%' : '700px'" />
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
