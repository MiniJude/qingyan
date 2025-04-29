<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import _ from 'lodash'
import { isEqual } from 'lodash-es'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AvatarUploader from './AvatarUploader.vue'

interface Props {
  /** 用户信息 */
  userInfo: {
    avatar: string
    username: string
    bio: string
  }
}

const props = defineProps<Props>()
const { t } = useI18n()

// 表单ref
const formRef = ref<FormInstance>()

// 表单数据
const formData = ref({
  avatar: props.userInfo.avatar,
  username: props.userInfo.username,
  bio: props.userInfo.bio,
})

// 原始数据备份
const originalData = ref(_.cloneDeep(formData.value))

// 是否有变更
const isDifferent = ref(false)

// 使用lodash的isEqual实现深度比较
watch(
  formData,
  () => {
    isDifferent.value = !isEqual(formData.value, originalData.value)
  },
  { deep: true, immediate: true },
)

// 头像是否变更
const avatarChanged = computed(() =>
  formData.value.avatar !== originalData.value.avatar,
)

// 表单校验规则
const rules = ref<FormRules>({
  username: [
    { required: true, message: t('common.validation.required', { field: t('common.user.username') }), trigger: 'blur' },
    { min: 2, max: 20, message: t('header.user_profile.username_length'), trigger: 'blur' },
  ],
})

// 更新头像
function updateAvatar(value: string) {
  formData.value.avatar = value
}

// 撤销头像上传
function cancelAvatarUpload() {
  formData.value.avatar = originalData.value.avatar
}

// 保存表单
async function saveForm() {
  if (!formRef.value)
    return

  try {
    const valid = await formRef.value.validate()
    if (valid) {
      // TODO: 这里可以添加API请求，将数据保存到服务器
      // 例如: await saveUserProfile(formData.value)

      // 更新原始数据
      originalData.value = { ...formData.value }

      // 重置变更状态
      isDifferent.value = false

      // 显示成功提示
      ElMessage.success(t('common.messages.update_success', { item: t('header.user_profile.personal_info') }))

      // 如果需要通知父组件更新已完成，可以使用emit
      // emit('update-complete', formData.value)
    }
  }
  catch {
    ElMessage.error(t('header.user_profile.form_error'))
  }
}

// 计算属性，用于模拟双向绑定但避免直接修改prop
const avatar = computed({
  get: () => formData.value.avatar,
  set: value => updateAvatar(value),
})
</script>

<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="rules"
    label-width="80px"
  >
    <!-- 头像 -->
    <el-form-item>
      <div class="flex items-center">
        <AvatarUploader
          v-model="avatar"
          :has-changed="avatarChanged"
          :original-avatar="originalData.avatar"
          @cancel="cancelAvatarUpload"
        />
      </div>
    </el-form-item>

    <!-- 用户名 -->
    <el-form-item :label="$t('common.user.username')" prop="username">
      <el-input v-model="formData.username" :placeholder="$t('common.user.username')" />
    </el-form-item>

    <!-- 个人简介 -->
    <el-form-item :label="$t('common.user.bio')" prop="bio">
      <el-input
        v-model="formData.bio"
        type="textarea"
        :rows="4"
        :placeholder="$t('header.user_profile.bio_placeholder')"
      />
    </el-form-item>

    <!-- 保存按钮 -->
    <el-form-item>
      <el-button
        type="primary"
        :disabled="!isDifferent"
        @click="saveForm"
      >
        {{ $t('common.actions.save') }}
      </el-button>
    </el-form-item>
  </el-form>
</template>
