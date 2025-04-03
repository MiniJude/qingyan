<script setup lang="ts">
import type { FlowDialog } from '#components'
import Logon from '@/components/sys/Logon.vue'
import SysPasswordSetting from '@/components/sys/PasswordSetting.vue'
import PhoneCheck from '@/components/sys/PhoneCheck.vue'
import UsernameEmailCheck from '@/components/sys/UsernameEmailCheck.vue'

// 不设置layout
definePageMeta({
  layout: false,
})

// 修改密码的表单
const passwordModificationForm = ref({
  phone: '',
  vcode: '',
  password: '',
  password2: '',
})

// 登录流程
const logonDialogRef = ref<InstanceType<typeof FlowDialog>>()
const logonDialogVisible = ref(false)
const logonSteps = ref<FlowStepItem[]>([
  { component: shallowRef(Logon), title: '登录', props: { onOpenRegisterDialog, onForgotPassword }, showFooter: false },
  { component: shallowRef(PhoneCheck), title: '手机验证', props: { form: passwordModificationForm, type: 'changePassword' } },
  { component: shallowRef(SysPasswordSetting), title: '密码修改', props: { form: passwordModificationForm, onChangePasswordSuccess, type: 'change' } },
])

// 注册流程
const registerForm = ref({
  invite_code: '',
  phone: '',
  vcode: '',
  username: '',
  email: '',
  password: '',
  password2: '',
})
const registerDialogVisible = ref(false)
const registerSteps = ref<FlowStepItem[]>([
  { component: shallowRef(PhoneCheck), title: '手机验证', props: { form: registerForm, type: 'register' } },
  { component: shallowRef(UsernameEmailCheck), title: '输入用户名', props: { form: registerForm } },
  { component: shallowRef(SysPasswordSetting), title: '密码设置', props: { form: registerForm, onRegisterSuccess, type: 'set' } },
])

// 给登录流程提供的事件
function onOpenRegisterDialog() {
  registerDialogVisible.value = true
}

function onForgotPassword() {
  logonDialogRef.value?.goToStep(1)
}

function onChangePasswordSuccess() {
  logonDialogRef.value?.goToStep(1)
}

// 给注册流程提供的事件
function onRegisterSuccess() {
  registerDialogVisible.value = false
}
</script>

<template>
  <div relative h-full flex-center>
    <div absolute right-20px top-20px>
      <el-button @click="logonDialogVisible = true">
        登录
      </el-button>
      <el-button>注册</el-button>
    </div>

    <!-- 登录流程 -->
    <FlowDialog ref="logonDialogRef" v-model:model-value="logonDialogVisible" :steps="logonSteps" />

    <!-- 注册流程 -->
    <FlowDialog v-model:model-value="registerDialogVisible" :steps="registerSteps" />
  </div>
</template>
