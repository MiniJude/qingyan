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
const registerDialogVisible = ref(false)
const registerSteps = ref<FlowStepItem[]>([
  { component: shallowRef(PhoneCheck), title: '手机验证' },
  { component: shallowRef(UsernameEmailCheck), title: '输入用户名' },
  { component: shallowRef(SysPasswordSetting), title: '密码设置' },
])

// 密码修改流程
const passwordModificationDialogVisible = ref(false)
const passwordModificationSteps = ref<FlowStepItem[]>([
  { component: shallowRef(PhoneCheck), title: '手机验证' },
  { component: shallowRef(PasswordModification), title: '密码修改' },
])
function openPasswordModificationDialog() {
  registerDialogVisible.value = false
  passwordModificationDialogVisible.value = true
}

// 给登录流程提供的事件
function onOpenRegisterDialog() {
  logonDialogVisible.value = false
  registerDialogVisible.value = true
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
    <FlowDialog v-model:model-value="logonDialogVisible" class="absolute-center z-0" :steps="logonSteps" />

    <!-- 注册流程 -->
    <FlowDialog v-model:model-value="registerDialogVisible" class="absolute-center z-1" :steps="registerSteps" />

    <!-- 密码修改流程 -->
    <FlowDialog v-model:model-value="passwordModificationDialogVisible" class="absolute-center z-2" :steps="passwordModificationSteps" />
  </div>
</template>
