<script setup lang="ts">
import Logon from '@/components/sys/Logon.vue'
import PasswordModification from '@/components/sys/PasswordModification.vue'
import SysPasswordSetting from '@/components/sys/PasswordSetting.vue'
import PhoneCheck from '@/components/sys/PhoneCheck.vue'
import UsernameEmailCheck from '@/components/sys/UsernameEmailCheck.vue'

// 不设置layout
definePageMeta({
  layout: false,
})
// 登录流程
const logonDialogVisible = ref(false)
const logonSteps = ref<FlowStepItem[]>([
  { component: shallowRef(Logon), title: '登录', props: { onOpenRegisterDialog } },
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
  { component: shallowRef(PhoneCheck), title: '手机验证', props: { form: registerForm } },
  { component: shallowRef(UsernameEmailCheck), title: '输入用户名', props: { form: registerForm } },
  { component: shallowRef(SysPasswordSetting), title: '密码设置', props: { form: registerForm, onRegisterSuccess } },
])

// 密码修改流程
const passwordModificationDialogVisible = ref(false)
const passwordModificationSteps = ref<FlowStepItem[]>([
  { component: shallowRef(PhoneCheck), title: '手机验证' },
  { component: shallowRef(PasswordModification), title: '密码修改' },
])

// 给登录流程提供的事件
function onOpenRegisterDialog() {
  registerDialogVisible.value = true
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
    <FlowDialog v-model:model-value="logonDialogVisible" :steps="logonSteps" />

    <!-- 注册流程 -->
    <FlowDialog v-model:model-value="registerDialogVisible" :steps="registerSteps" />

    <!-- 密码修改流程 -->
    <FlowDialog v-model:model-value="passwordModificationDialogVisible" :steps="passwordModificationSteps" />
  </div>
</template>
