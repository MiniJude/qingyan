<script setup lang="ts">
import type { FormInstance } from 'element-plus'

const props = defineProps<{
  type: 'set' | 'change'
  onRegisterSuccess?: () => void
  onChangePasswordSuccess?: () => void
}>()

defineSlots<{
  footer: () => any
}>()
interface Form {
  password: string
  password2: string
  [k: string]: any
}
const form = defineModel<Form>('form', { required: true })

// 注册表单验证规则
const { passwordRules, createPassword2Rules } = createValidationRules()
const registerRules = {
  password: passwordRules,
  password2: createPassword2Rules(form.value),
}

// 注册表单引用
const registerFormRef = ref<FormInstance>()

// 提交注册表单
async function submit() {
  // 验证表单
  await registerFormRef.value?.validate()
  const url = `/api/member/${props.type === 'set' ? 'register' : 'changePassword'}/`
  await $api(url, {
    method: 'POST',
    body: form.value,
  })
  if (props.type === 'set') {
    props.onRegisterSuccess?.()
  }
  else {
    props.onChangePasswordSuccess?.()
  }
}

defineExpose({
  submit,
})
</script>

<template>
  <el-form
    ref="registerFormRef"
    :model="form"
    :rules="registerRules"
    label-width="100px"
    label-position="top"
    size="large"
    class="w-380px px-40px pb-0 pt-80px"
  >
    <el-form-item :label="$t('header.user_profile.password')" prop="password">
      <el-input
        v-model="form.password"
        maxlength="20"
        autocomplete="new-password"
        type="password"
        show-password
      />
    </el-form-item>
    <el-form-item :label="$t('header.user_profile.confirm_password')" prop="password2">
      <el-input
        v-model="form.password2"
        maxlength="20"
        autocomplete="new-password"
        type="password"
        show-password
      />
    </el-form-item>
    <slot name="footer" />
  </el-form>
</template>
