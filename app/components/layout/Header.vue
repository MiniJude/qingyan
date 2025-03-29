<script lang="ts" setup>
const searchValue = ref('')

const { currentMenu } = useMenu()
const { locale, setLocale } = useI18n()

function toggleLanguage() {
  setLocale(locale.value === 'en' ? 'zh-CN' : 'en')
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
      <img src="@/assets/img/avatar.png" alt="avatar" h-36px w-36px cursor-pointer rounded-full>
    </div>
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
