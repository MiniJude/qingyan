<script setup lang="ts">
import en from 'element-plus/es/locale/lang/en'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

const timeValue = ref('')
const { locale } = useI18n()

const currentLocale = computed(() => {
  return locale.value === 'en' ? en : zhCn
})
</script>

<template>
  <el-config-provider :locale="currentLocale">
    <el-date-picker
      v-model="timeValue"
      type="date"
      :placeholder="locale === 'en' ? 'Select date' : '请选择日期'"
    />
  </el-config-provider>
</template>
