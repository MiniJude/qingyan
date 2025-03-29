<script setup lang="ts">
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
  avatar: '/assets/img/avatar.png',
  username: 'Jude',
  bio: '',
  phone: '15366061979',
  email: '1546985690@qq.com',
  password: '********',
})

// 当前选中的左侧菜单
const currentMenu = ref('account-settings')

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
    key: 'account-settings',
    icon: 'i-carbon:user',
    name: t('header.user_profile.account_settings'),
  },
  {
    key: 'wechat-assistant',
    icon: 'i-carbon:chat',
    name: t('header.user_profile.wechat_assistant'),
  },
])

// 获取当前菜单标题
function getCurrentMenuTitle() {
  const menu = menuList.value.find(item => item.key === currentMenu.value)
  return menu ? menu.name : ''
}

// 切换菜单
function switchMenu(key: string) {
  currentMenu.value = key
}

// 修改头像
function updateAvatar() {
  // 实现头像修改功能
  ElMessage.success('头像修改功能将在后续版本中实现')
}

// 修改用户名
function updateUsername() {
  // 实现用户名修改功能
  ElMessage.success('用户名已更新')
}

// 修改个人简介
function updateBio() {
  // 实现个人简介修改功能
  ElMessage.success('个人简介已更新')
}

// 修改手机号
function updatePhone() {
  // 实现手机号修改功能
  ElMessage.success('手机号已更新')
}

// 修改邮箱
function updateEmail() {
  // 实现邮箱修改功能
  ElMessage.success('邮箱已更新')
}

// 修改密码
function updatePassword() {
  // 实现密码修改功能
  ElMessage.success('密码修改功能将在后续版本中实现')
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    width="800"
    :show-close="true"
    class="user-profile-dialog"
    :close-on-click-modal="false"
  >
    <!-- 对话框内容区域 -->
    <div class="h-600px flex">
      <!-- 左侧菜单 -->
      <div class="w-256px bg-#f5f7fa">
        <div class="border-b border-#e6e6e6 border-solid p-20px text-lg font-bold">
          {{ $t('header.user_center') }}
        </div>
        <div
          v-for="menu in menuList"
          :key="menu.key"
          class="cursor-pointer p-16px px-20px transition-all duration-300"
          :class="{ 'text-primary bg-white border-l-3 border-solid border-primary': currentMenu === menu.key }"
          hover="bg-op-10 bg-primary"
          @click="switchMenu(menu.key)"
        >
          <div class="flex items-center gap-3">
            <div class="h-20px w-20px" :class="[menu.icon]" />
            <span>{{ menu.name }}</span>
          </div>
        </div>
      </div>

      <!-- 右侧内容 -->
      <div class="flex-1 overflow-y-auto bg-white">
        <div class="border-b border-#e6e6e6 border-solid p-20px text-lg font-bold">
          {{ getCurrentMenuTitle() }}
        </div>

        <!-- 账号设置 -->
        <div v-if="currentMenu === 'account-settings'">
          <!-- 头像 -->
          <div class="flex items-center p-20px">
            <div class="w-80px font-bold">
              {{ $t('header.user_profile.avatar') }}
            </div>
            <div class="flex flex-1 items-center justify-between">
              <img :src="userInfo.avatar" alt="avatar" class="mr-auto h-60px w-60px rounded-full object-cover">
              <div class="i-carbon:edit mr-1 h-16px w-16px cursor-pointer text-primary" @click="updateAvatar" />
            </div>
          </div>
          <div class="mx-20px h-1px bg-#e6e6e6" />

          <!-- 用户名 -->
          <div class="flex items-center p-20px">
            <div class="w-80px font-bold">
              {{ $t('header.user_profile.username') }}
            </div>
            <div class="flex flex-1 items-center justify-between">
              <el-input v-model="userInfo.username" :placeholder="$t('header.user_profile.username')" class="w-70%" />
              <div class="i-carbon:edit mr-1 h-16px w-16px cursor-pointer text-primary" @click="updateUsername" />
            </div>
          </div>
          <div class="mx-20px h-1px bg-#e6e6e6" />

          <!-- 个人简介 -->
          <div class="flex items-center p-20px">
            <div class="w-80px font-bold">
              {{ $t('header.user_profile.bio') }}
            </div>
            <div class="flex flex-1 items-center justify-between">
              <el-input
                v-model="userInfo.bio"
                type="textarea"
                :rows="4"
                :placeholder="$t('header.user_profile.bio_placeholder')"
                class="w-70%"
              />
              <div class="i-carbon:edit mr-1 h-16px w-16px cursor-pointer text-primary" @click="updateBio" />
            </div>
          </div>
          <div class="mx-20px h-1px bg-#e6e6e6" />

          <!-- 手机号 -->
          <div class="flex items-center p-20px">
            <div class="w-80px font-bold">
              {{ $t('header.user_profile.phone') }}
            </div>
            <div class="flex flex-1 items-center justify-between">
              <el-input v-model="userInfo.phone" :placeholder="$t('header.user_profile.phone')" class="w-70%" />
              <div class="i-carbon:edit mr-1 h-16px w-16px cursor-pointer text-primary" @click="updatePhone" />
            </div>
          </div>
          <div class="mx-20px h-1px bg-#e6e6e6" />

          <!-- 邮箱 -->
          <div class="flex items-center p-20px">
            <div class="w-80px font-bold">
              {{ $t('header.user_profile.email') }}
            </div>
            <div class="flex flex-1 items-center justify-between">
              <el-input v-model="userInfo.email" :placeholder="$t('header.user_profile.email')" class="w-70%" />
              <div class="i-carbon:edit mr-1 h-16px w-16px cursor-pointer text-primary" @click="updateEmail" />
            </div>
          </div>
          <div class="mx-20px h-1px bg-#e6e6e6" />

          <!-- 密码 -->
          <div class="flex items-center p-20px">
            <div class="w-80px font-bold">
              {{ $t('header.user_profile.password') }}
            </div>
            <div class="flex flex-1 items-center justify-between">
              <el-input v-model="userInfo.password" type="password" disabled class="w-70%" />
              <div class="i-carbon:edit mr-1 h-16px w-16px cursor-pointer text-primary" @click="updatePassword" />
            </div>
          </div>
        </div>

        <!-- 其他菜单内容 -->
        <div v-else class="h-full flex flex-col items-center justify-center text-#909399">
          <div class="i-carbon:rocket h-64px w-64px" />
          <div class="mt-4 text-xl">
            {{ $t('header.user_profile.coming_soon') }}
          </div>
        </div>
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
