<script lang="ts" setup>
const searchValue = ref('')

const { currentMenu } = useMenu()
const { locale, setLocale } = useI18n()

// 个人中心弹框可见性
const userProfileDialogVisible = ref(false)

// 打开个人中心弹框
function openUserProfile() {
  userProfileDialogVisible.value = true
}

function toggleLanguage() {
  setLocale(locale.value === 'en' ? 'zh-CN' : 'en')
}

// 退出登录
function logout() {
  // 可以在这里添加实际的登出逻辑，如清除token等
  // 例如：清除token，重定向到登录页
  // localStorage.removeItem('token')
}
</script>

<template>
  <div class="header" p="l-24px r-53px" h-64px flex items-center justify-between>
    <div flex items-center>
      <component :is="currentMenu?.iconUrl" h-30px w-30px text-primary />
      <span ml-8px>{{ currentMenu?.name }}</span>
    </div>
    <el-input v-model="searchValue" class="search-input ml-auto mr-100px h-36px !w-260px !rounded-50px">
      <template #prefix>
        <SvgoSearch text="20px primary" />
      </template>
    </el-input>
    <div flex items-center gap-12px>
      <el-button link w-32px @click="toggleLanguage">
        {{ locale === 'en' ? '中' : 'EN' }}
      </el-button>
      <DarkToggle />
      <SvgoNotice class="icon-notice" text="24px" cursor-pointer />
      <el-dropdown trigger="click">
        <img src="@/assets/img/avatar.png" alt="avatar" h-36px w-36px cursor-pointer rounded-full>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <div class="flex items-center gap-2 text-tprimary dark:text-white" @click="openUserProfile">
                <div i-carbon:user class="h-16px w-16px" />
                {{ $t('header.user_center') }}
              </div>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <div class="flex items-center gap-2 text-tprimary dark:text-white" @click="logout">
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
</template>

<style lang="scss" scoped>
.header {
  border-bottom: 1px solid var(--el-border-color);

  :deep(.search-input) {
    .el-input__wrapper {
      border-radius: 20px;
    }
  }

  .icon-notice {
    color: #4e5969;
  }
}
</style>
