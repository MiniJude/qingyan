<script setup lang="ts">
import { useI18n } from 'vue-i18n'

interface Props {
  /** 当前头像url */
  modelValue: string
  /** 头像尺寸 */
  size?: number
  /** 头像是否已变更 */
  hasChanged?: boolean
  /** 原始头像地址，用于撤销 */
  originalAvatar?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 90,
  hasChanged: false,
  originalAvatar: '',
})

const emit = defineEmits(['update:modelValue', 'cancel'])
const { t } = useI18n()

// 文件输入引用
const fileInput = ref<HTMLInputElement | null>(null)

// 打开文件选择
function openFileSelect() {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

// 处理文件选择
function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) {
    return
  }

  // 检查文件类型
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
  if (!allowedTypes.includes(file.type)) {
    ElMessage.error(t('common.messages.format_error', { item: t('header.user_profile.avatar') }))
    return
  }

  // 检查文件大小 (5MB = 5 * 1024 * 1024 bytes)
  if (file.size > 5 * 1024 * 1024) {
    ElMessage.error(t('common.messages.size_error', { item: t('header.user_profile.avatar'), size: '5MB' }))
    return
  }

  // 预览图片
  const reader = new FileReader()
  reader.onload = (e) => {
    if (e.target?.result) {
      emit('update:modelValue', e.target.result as string)
      ElMessage.success(t('common.messages.upload_success', { item: t('header.user_profile.avatar') }))
    }
  }
  reader.readAsDataURL(file)

  // 重置文件输入，以便同一文件可以再次选择
  target.value = ''
}

// 撤销头像上传
function cancelUpload() {
  emit('cancel')
}
</script>

<template>
  <div class="flex items-center">
    <div class="avatar-container relative cursor-pointer rounded-full" :style="{ width: `${props.size}px`, height: `${props.size}px` }">
      <img :src="modelValue" alt="avatar" class="h-full w-full rounded-full object-cover">
      <div class="avatar-overlay absolute left-0 top-0 h-full w-full flex flex-col items-center justify-center rounded-full bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 hover:opacity-100" @click="openFileSelect">
        <div class="text-24px text-white">
          +
        </div>
        <span class="text-12px text-white">{{ $t('header.user_profile.click_to_change_avatar') }}</span>
      </div>
      <!-- 隐藏的文件输入 -->
      <input
        ref="fileInput"
        type="file"
        accept="image/jpeg,image/png,image/jpg"
        class="hidden"
        @change="handleFileChange"
      >
    </div>

    <div class="ml-4">
      <template v-if="hasChanged">
        <div>
          <el-button type="text" class="text-primary" @click="cancelUpload">
            {{ $t('common.actions.cancel') }}
          </el-button>
        </div>
        <div class="mt-1 text-xs text-gray-500">
          {{ $t('header.user_profile.save_to_apply') }}
        </div>
      </template>
      <template v-else>
        <div class="text-disabled">
          <div>{{ $t('header.user_profile.avatar_format_type') }}</div>
          <div>{{ $t('header.user_profile.avatar_format_size') }}</div>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
