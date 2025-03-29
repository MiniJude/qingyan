<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import Avatar from '@/assets/img/avatar.png?url'
import AccountSettingsPanel from './AccountSettingsPanel.vue'
import PersonalInfoPanel from './PersonalInfoPanel.vue'
import WechatAssistantPanel from './WechatAssistantPanel.vue'

// 接收弹框显示状态
interface Props {
  /** 弹框是否可见 */
  modelValue: boolean
}

const props = defineProps<Props>()

const emit = defineEmits(['update:modelValue'])
const { t } = useI18n()

// 用户信息
const userInfo = reactive({
  avatar: Avatar,
  username: 'Jude',
  bio: '',
  phone: '15366061979',
  email: '1546985690@qq.com',
  password: '********',
})

// 当前选中的左侧菜单
const currentMenu = ref('personal-info')

// 对话框可见性的计算属性
const dialogVisible = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})

// 修复类型相关问题
interface MenuItem {
  key: string
  icon: string
  name: string
}

// 左侧菜单列表
const menuList = computed((): MenuItem[] => [
  {
    key: 'personal-info',
    icon: 'i-carbon:user-profile',
    name: t('header.user_profile.personal_info'),
  },
  {
    key: 'account-settings',
    icon: 'i-carbon:settings',
    name: t('header.user_profile.account_settings'),
  },
  {
    key: 'wechat-assistant',
    icon: 'i-carbon:logo-wechat',
    name: t('header.user_profile.wechat_assistant'),
  },
])

// 切换菜单
function switchMenu(key: string) {
  currentMenu.value = key
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible" width="800" class="user-profile-dialog" :close-on-click-modal="false"
    :title="$t('header.user_center')"
  >
    <!-- 对话框内容区域 -->
    <div class="h-600px flex">
      <!-- 左侧菜单 -->
      <div class="w-160px flex flex-col gap-10px rounded-4px p-12px">
        <div
          v-for="menu in menuList" :key="menu.key"
          class="cursor-pointer rounded-4px p-16px px-20px text-tprimary transition-all duration-300"
          :class="{ 'text-white !bg-[var(--el-color-primary)]': currentMenu === menu.key }"
          hover="bg-[var(--el-color-primary-light-3)] !text-white" @click="switchMenu(menu.key)"
        >
          <div class="flex items-center gap-3">
            <div class="h-20px w-20px shrink-0" :class="[menu.icon]" />
            <span>{{ menu.name }}</span>
          </div>
        </div>
      </div>

      <!-- 竖分割线 -->
      <el-divider direction="vertical" class="!h-full" />

      <!-- 右侧内容 -->
      <div class="flex-1 overflow-y-auto">
        <!-- 个人资料 -->
        <PersonalInfoPanel v-if="currentMenu === 'personal-info'" :user-info="userInfo" />

        <!-- 账号设置 -->
        <AccountSettingsPanel
          v-else-if="currentMenu === 'account-settings'"
          :account-info="{ phone: userInfo.phone, email: userInfo.email, password: userInfo.password }"
        />

        <!-- 微信助手 -->
        <WechatAssistantPanel v-else />
      </div>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
.user-profile-dialog {
  :deep(.el-dialog__header) {
    display: none;
  }

  :deep(.el-dialog__body) {
    padding: 0;
  }
}
</style>
