<script setup lang="ts">
import Avatar from '@/assets/img/avatar.png?url'
import AccountSettingsPanel from './AccountSettingsPanel.vue'
import PersonalInfoPanel from './PersonalInfoPanel.vue'
import WechatAssistantPanel from './WechatAssistantPanel.vue'

const dialogVisible = defineModel<boolean>('modelValue')

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
      userInfo,
    },
  },
  {
    key: 'account-settings',
    icon: 'i-carbon:settings',
    name: t('header.user_profile.account_settings'),
    component: shallowRef(AccountSettingsPanel),
    props: {
      accountInfo: {
        phone: userInfo.phone,
        email: userInfo.email,
        password: userInfo.password,
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
    v-model="dialogVisible" width="800" class="user-profile-dialog" :close-on-click-modal="false"
    :title="$t('header.user_center')"
  >
    <JMenuSplitContent
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
