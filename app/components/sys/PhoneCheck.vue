<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { PHONE_ENCRYPT_PREFIX } from '~/constants'

const props = defineProps<{
  type: 'register' | 'changePassword'
}>()

defineSlots<{
  footer: () => any
}>()

const { t } = useI18n()

interface Form {
  phone: string
  vcode: string
}
const form = defineModel<Form>('form', { required: true })

// 从集中化验证规则中获取需要的规则
const { createPhoneRules, vcodeRules } = createValidationRules()

// 注册表单验证规则
const registerRules = {
  phone: createPhoneRules(props.type),
  vcode: vcodeRules,
}

// 注册表单引用
const registerFormRef = ref<FormInstance>()

// 验证码是否已发送
const isVcodeSent = ref(false)

// 倒计时相关
const countdown = ref(0)
const { pause, resume } = useIntervalFn(() => {
  if (countdown.value > 0) {
    countdown.value--
  }
  else {
    pause()
  }
}, 1000, { immediate: false })

// 开始倒计时
function startCountdown() {
  countdown.value = 60
  resume()
}

// 获取验证码
async function getVerificationCode() {
  try {
    // 验证手机号
    await registerFormRef.value?.validateField('phone')

    // 对手机号进行base64编码
    const encodedPhone = btoa(form.value.phone)
    const phoneWithPrefix = `${PHONE_ENCRYPT_PREFIX}${encodedPhone}`

    try {
      // 发送验证码请求
      await $api(`/api/member/vcode/?phone=${encodeURIComponent(phoneWithPrefix)}`)
      // 手机号验证通过后发送验证码
      ElMessage.success(t('login.phone.vcode_sent'))
      // 设置验证码已发送状态
      isVcodeSent.value = true
      // 开始倒计时
      startCountdown()
    }
    catch (error) {
      console.error('验证码发送失败', error)
      ElMessage.error(t('login.phone.vcode_sent_failed'))
    }
  }
  catch (error) {
    console.error('手机号验证失败', error)
  }
}

// 提交注册表单
async function submit() {
  await registerFormRef.value?.validate()

  try {
    // 校验成功，这里添加注册逻辑
    await $api(`/api/member/vcode/`, {
      method: 'POST',
      body: {
        phone: form.value.phone,
        vcode: form.value.vcode,
      },
    })
    ElMessage.success(t('login.register_success'))
  }
  catch (error) {
    console.error('注册失败', error)
    throw new Error('注册失败')
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
    class="px-40px pb-0 pt-80px"
  >
    <el-form-item :label="$t('login.phone.phone')" prop="phone">
      <el-input
        v-model="form.phone"
        maxlength="11"
      >
        <template #suffix>
          <SvgoPhone text-tprimary />
        </template>
      </el-input>
    </el-form-item>
    <el-form-item :label="$t('login.phone.vcode')" prop="vcode">
      <div flex="~ gap-15px" w-full>
        <el-input
          v-model="form.vcode"
          class="flex-1"
          maxlength="6"
        />
        <el-button
          type="primary"
          min-w-20
          :disabled="(countdown > 0) || (form.phone.length !== 11)"
          @click="getVerificationCode"
        >
          {{ countdown > 0 ? `${countdown}s` : (isVcodeSent ? $t('login.phone.resend_vcode') : $t('login.phone.get_vcode')) }}
        </el-button>
      </div>
    </el-form-item>
    <slot name="footer" />
  </el-form>
</template>
