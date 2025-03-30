<script setup lang="ts">
import QRCode from '@/assets/img/qrcode-placeholder.png'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// 空间选择
const selectedSpace = ref('')
const spaces = [
  { value: 'space1', label: t('wechat_assistant.personal_space') },
  { value: 'space2', label: t('wechat_assistant.team_space') },
  { value: 'space3', label: t('wechat_assistant.project_space') },
]
</script>

<template>
  <div class="p-20px">
    <!-- 头部标题和描述 -->
    <div class="mb-20px">
      <h2 class="mb-10px text-24px font-bold">
        {{ $t('wechat_assistant.title') }}
      </h2>
      <p class="flex items-center text-gray-500">
        <i class="i-twemoji:backhand-index-pointing-right mr-2 text-warning" />
        {{ $t('wechat_assistant.description') }}
      </p>
    </div>

    <div class="my-20px h-1px bg-gray-200" />

    <!-- 第一步：绑定微信 -->
    <div class="mb-20px">
      <h3 class="mb-16px text-18px font-bold">
        {{ $t('wechat_assistant.step1_title') }}
      </h3>
      <p class="mb-20px text-gray-500">
        {{ $t('wechat_assistant.scan_bind_tip') }}
      </p>
      <div class="my-20px flex justify-center">
        <img :src="QRCode" alt="QR Code" class="h-200px w-200px border border-gray-200 rounded border-solid">
      </div>
    </div>

    <div class="my-20px h-1px bg-gray-200" />

    <!-- 第二步：添加微信助手 -->
    <div class="mb-20px">
      <h3 class="mb-16px text-18px font-bold">
        {{ $t('wechat_assistant.step2_title') }}
      </h3>
      <p class="mb-20px text-gray-500">
        {{ $t('wechat_assistant.scan_add_tip') }}
      </p>
      <div class="my-20px flex justify-center">
        <img :src="QRCode" alt="QR Code" class="h-200px w-200px border border-gray-200 rounded border-solid">
      </div>
    </div>

    <div class="my-20px h-1px bg-gray-200" />

    <!-- 第三步：选择数字空间 -->
    <div class="mb-20px">
      <h3 class="mb-16px text-18px font-bold">
        {{ $t('wechat_assistant.step3_title') }}
      </h3>
      <p class="mb-20px text-gray-500">
        {{ $t('wechat_assistant.select_space_tip') }}
      </p>

      <div class="mb-20px mt-4">
        <el-select v-model="selectedSpace" :placeholder="t('common.validation.required', { field: t('wechat_assistant.step3_title') })" class="w-320px">
          <el-option
            v-for="item in spaces"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>

      <div class="mt-6 text-center text-gray-500">
        <p class="flex justify-center gap-20px text-24px">
          <i class="i-carbon:chat text-primary" />
          <i class="i-carbon:image text-primary" />
          <i class="i-carbon:document text-primary" />
          <i class="i-carbon:video text-primary" />
          <i class="i-carbon:link text-primary" />
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* UnoCSS不支持的样式可以在这里补充 */
</style>
