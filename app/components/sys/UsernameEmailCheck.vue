<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { ref } from 'vue'
import { createValidationRules } from '~/utils/validate'

const { t } = useI18n()

// 注册表单数据
const registerForm = ref({
  username: '',
  email: '',
})

// 从集中化验证规则中获取需要的规则
const { emailRules } = createValidationRules()

// 用户名验证规则
const usernameRules = [
  { required: true, message: t('common.validation.required', { field: t('header.user_profile.username') }), trigger: 'blur' },
  { min: 2, max: 20, message: t('header.user_profile.username_length'), trigger: 'blur' },
]

// 注册表单验证规则
const registerRules = {
  username: usernameRules,
  email: emailRules,
}

// 注册表单引用
const registerFormRef = ref<FormInstance>()

// 提交注册表单
async function submit() {
  // 验证表单
  await registerFormRef.value?.validate()

  // 这里添加注册逻辑（实际项目中应调用API）
  await $api(`/copy/?url=https://www.writebug.com/api/v3/member/register/checkAccount/`, {
    method: 'POST',
    body: {
      username: registerForm.value.username,
      email: registerForm.value.email,
    },
  })
}

defineExpose({
  submit,
})
</script>

<template>
  <el-form
    ref="registerFormRef"
    :model="registerForm"
    :rules="registerRules"
    label-width="100px"
    label-position="top"
    size="large"
    class="w-380px px-40px pb-0 pt-80px"
  >
    <el-form-item :label="$t('header.user_profile.username')" prop="username">
      <el-input
        v-model="registerForm.username"
        maxlength="20"
      >
        <template #suffix>
          <SvgoUser text-tprimary />
        </template>
      </el-input>
    </el-form-item>
    <el-form-item :label="$t('login.email')" prop="email">
      <el-input
        v-model="registerForm.email"
      >
        <template #suffix>
          <SvgoEmail text-tprimary />
        </template>
      </el-input>
    </el-form-item>
  </el-form>
</template>
