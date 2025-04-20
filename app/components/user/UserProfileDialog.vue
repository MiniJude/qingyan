<script setup lang="ts">
import Avatar from '@/assets/img/avatar.png?url'
import { useUserStore } from '~/stores/user'
import AccountSettingsPanel from './AccountSettingsPanel.vue'
import PersonalInfoPanel from './PersonalInfoPanel.vue'
import WechatAssistantPanel from './WechatAssistantPanel.vue'

const dialogVisible = defineModel<boolean>('modelValue')
const { t } = useI18n()
const userStore = useUserStore()

// 从Pinia store获取用户信息
const userInfo = computed(() => {
  if (userStore.userInfo) {
    return {
      avatar: userStore.userInfo.avatar,
      username: userStore.userInfo.username || 'User',
      bio: userStore.userInfo.bio || '',
      phone: userStore.userInfo.phone || '',
      email: userStore.userInfo.email || '',
      password: '********', // 密码始终显示为掩码
    }
  }
  // 如果没有用户信息，使用默认值
  return {
    avatar: Avatar,
    username: 'User',
    bio: '',
    phone: '',
    email: '',
    password: '********',
  }
})

// 当前选中的左侧菜单
const currentMenu = ref('personal-info')

// 修复类型相关问题
interface MenuItem {
  key: string
  icon: string
  name: string
}

// 左侧菜单列表
const menuList = computed<MenuItem[]>(() => [
  {
    key: 'personal-info',
    icon: 'i-carbon:user-profile',
    name: t('header.user_profile.personal_info'),
    component: shallowRef(PersonalInfoPanel),
    props: {
      userInfo: userInfo.value,
    },
  },
  {
    key: 'account-settings',
    icon: 'i-carbon:settings',
    name: t('header.user_profile.account_settings'),
    component: shallowRef(AccountSettingsPanel),
    props: {
      accountInfo: {
        phone: userInfo.value.phone,
        email: userInfo.value.email,
        password: userInfo.value.password,
      },
    },
  },
  {
    key: 'wechat-assistant',
    icon: 'i-carbon:logo-wechat',
    name: t('header.user_profile.wechat_assistant'),
    component: shallowRef(WechatAssistantPanel),
  },
])
</script>

<template>
  <el-dialog
    v-model="dialogVisible" width="800" class="user-profile-dialog" :close-on-click-modal="false" append-to-body
    :title="$t('header.user_center')"
  >
    <MenuSplitContent
      v-model="currentMenu"
      :menu-list="menuList"
      content-height="600px"
    />
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
