<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { useIntervalFn } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import { computed, ref, watch } from 'vue'
import { PHONE_ENCRYPT_PREFIX } from '~/constants'
import { createValidationRules } from '~/utils/validate'

// 定义组件的props
interface Props {
  visible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
})

// 定义事件
const emit = defineEmits(['close', 'update:visible'])

const { t } = useI18n()

// 使用计算属性处理v-model
const dialogVisible = computed({
  get: () => props.visible,
  set: val => emit('update:visible', val),
})

// 注册表单数据
const registerForm = ref({
  phone: '',
  vcode: '',
})

// 从集中化验证规则中获取需要的规则
const { phoneRules, vcodeRules } = createValidationRules()

// 注册表单验证规则
const registerRules = {
  phone: phoneRules,
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

// 监听弹框显示状态，重置表单
watch(() => props.visible, (val) => {
  if (val) {
    // 弹框显示时重置表单和状态
    registerForm.value = {
      phone: '',
      vcode: '',
    }
    isVcodeSent.value = false
    countdown.value = 0
    pause()
  }
})

// 关闭弹框
function closeDialog() {
  emit('update:visible', false)
  emit('close')
}

// 获取验证码
async function getVerificationCode() {
  try {
    // 验证手机号
    await registerFormRef.value?.validateField('phone')

    // 对手机号进行base64编码
    const encodedPhone = btoa(registerForm.value.phone)
    const phoneWithPrefix = `${PHONE_ENCRYPT_PREFIX}${encodedPhone}`

    // 发送验证码请求
    await $api(`/copy/?url=https://www.writebug.com/api/v3/member/vcode/?phone=${encodeURIComponent(phoneWithPrefix)}`)
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

// 监听验证码输入
async function handleVcodeInput() {
  // 当验证码已发送且达到6位时自动校验
  if (isVcodeSent.value && registerForm.value.vcode.length === 6) {
    await submitRegister()
  }
}

// 提交注册表单
async function submitRegister() {
  try {
    await registerFormRef.value?.validate()
    // 校验成功，这里添加注册逻辑
    ElMessage.success(t('login.register_success'))
    closeDialog()
  }
  catch (error) {
    // 校验失败
    console.error('表单验证失败', error)
  }
}
</script>

<template>
  <!-- 注册弹框 -->
  <el-dialog
    v-model="dialogVisible"
    :title="$t('login.register')"
    width="400px"
    :close-on-click-modal="false"
    append-to-body
    align-center
    destroy-on-close
    @close="closeDialog"
  >
    <el-form
      ref="registerFormRef"
      :model="registerForm"
      :rules="registerRules"
      label-width="100px"
      label-position="top"
      size="large"
    >
      <el-form-item :label="$t('login.phone.phone')" prop="phone">
        <el-input
          v-model="registerForm.phone"
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
            v-model="registerForm.vcode"
            class="flex-1"
            maxlength="6"
            @input="handleVcodeInput"
          />
          <el-button
            type="primary"
            min-w-20
            :disabled="countdown > 0"
            @click="getVerificationCode"
          >
            {{ countdown > 0 ? `${countdown}s` : (isVcodeSent ? $t('login.phone.resend_vcode') : $t('login.phone.get_vcode')) }}
          </el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
