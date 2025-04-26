<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { useClipboard } from '@vueuse/core'
import { getCurrentInstance } from 'vue'

const { appContext } = getCurrentInstance()!

const { t } = useI18n()

// 邀请成员相关
const inviteUrl = ref('https://www.writebug.com/group/TceEXYRqBC/join/?share-user=Jude')
const enableSpaceConfirm = ref(true)
const showPassword = ref(false)
const invitePassword = ref('')

// 使用VueUse的剪贴板功能
const { copy, copied, isSupported } = useClipboard()

// 成员类型定义
interface Member {
  id: number
  username: string
  nickname: string
  role: string
  status: string
}

// 成员列表
const members = ref<Member[]>([
  {
    id: 1,
    username: 'Jude',
    nickname: '',
    role: 'admin',
    status: 'active',
  },
  {
    id: 2,
    username: 'TestUser',
    nickname: '',
    role: 'member',
    status: 'active',
  },
])

// 成员搜索相关
const searchQuery = ref('')
const filteredMembers = computed(() => {
  if (!searchQuery.value)
    return members.value

  const query = searchQuery.value.toLowerCase()
  return members.value.filter(member =>
    member.username.toLowerCase().includes(query)
    || (member.nickname && member.nickname.toLowerCase().includes(query)),
  )
})

// 角色选项
const roleOptions = [
  {
    label: t('common.roles.admin'),
    value: 'admin',
  },
  {
    label: t('common.roles.member'),
    value: 'member',
  },
]

// 添加成员对话框
const addMemberDialogVisible = ref(false)
const addMemberFormRef = ref<FormInstance>()
const addMemberForm = ref({
  email: '',
  role: 'member',
})

// 添加成员表单验证规则
const addMemberRules = reactive<FormRules>({
  email: [
    { required: true, message: t('common.validation.required', { field: t('common.user.email') }), trigger: 'blur' },
    { type: 'email', message: t('common.validation.format_error', { field: t('common.user.email') }), trigger: 'blur' },
  ],
  role: [
    { required: true, message: t('common.validation.required', { field: t('common.roles.label') }), trigger: 'change' },
  ],
})

// 复制邀请链接
async function copyInviteLink() {
  await copy(inviteUrl.value)

  if (copied.value) {
    ElMessage.success({
      message: t('common.messages.operation_success', { operation: t('common.actions.copy') }),
      duration: 2000,
    }, appContext)
  }
  else if (!isSupported.value) {
    ElMessage.error({
      message: t('common.messages.operation_failed', { operation: t('common.actions.copy') }),
      duration: 2000,
    }, appContext)
  }
}

// 提交添加成员表单
async function submitAddMember() {
  if (!addMemberFormRef.value)
    return

  try {
    await addMemberFormRef.value.validate()
    // TODO: 调用API添加成员
    ElMessage.success(t('common.user.add_success'))
    addMemberDialogVisible.value = false
  }
  catch (error) {
    console.error('Form validation failed:', error)
  }
}

// 移除成员
async function removeMember(member: Member) {
  try {
    await ElMessageBox.confirm(
      t('common.user.remove_confirm', { name: member.username }),
      t('common.actions.warning'),
      {
        confirmButtonText: t('common.actions.confirm'),
        cancelButtonText: t('common.actions.cancel'),
        type: 'warning',
      },
      appContext,
    )
    // TODO: 调用API移除成员
    const index = members.value.findIndex(m => m.id === member.id)
    if (index !== -1)
      members.value.splice(index, 1)
    ElMessage.success(t('common.user.remove_success'))
  }
  catch (error) {
    if (error !== 'cancel')
      console.error('Remove member failed:', error)
  }
}

// 设置加入密码
function setJoinPassword() {
  // TODO: 调用API设置加入密码
  ElMessage.success(t('common.messages.operation_success', { operation: t('common.actions.save') }))
}
</script>

<template>
  <div class="space-member-panel">
    <!-- 邀请成员区域 -->
    <div class="border-b border-gray-200 p-20px">
      <h3 class="mb-12px text-16px font-normal">
        {{ $t('space.member.invite_title') }}
      </h3>
      <div class="mb-10px text-sm text-gray-400">
        {{ $t('space.member.invite_description') }}
      </div>
      <div class="mb-16px flex items-center">
        <el-input
          v-model="inviteUrl"
          class="mr-12px flex-1"
          readonly
        />
        <el-button type="primary" @click="copyInviteLink">
          {{ $t('common.actions.copy') }}
        </el-button>
      </div>

      <!-- 开启空间邀请确认 -->
      <div class="mb-16px flex items-center">
        <span class="mr-12px">{{ $t('space.member.enable_confirm') }}</span>
        <el-switch v-model="enableSpaceConfirm" class="mr-10px" />
        <span class="text-sm text-gray-400">{{ $t('space.member.enable_confirm_description') }}</span>
      </div>

      <!-- 加入密码设置 -->
      <div class="mb-10px flex items-center">
        <span class="mr-12px">{{ $t('space.member.set_password') }}</span>
        <el-switch v-model="showPassword" class="mr-10px" />
        <span class="text-sm text-gray-400">{{ $t('space.member.set_password_description') }}</span>
      </div>
      <transition name="el-fade-in-linear">
        <div v-if="showPassword" class="flex items-center">
          <el-input
            v-model="invitePassword"
            class="mr-12px flex-1"
            :placeholder="$t('common.settings.password_placeholder')"
            show-password
          />
          <el-button type="primary" @click="setJoinPassword">
            {{ $t('common.actions.save') }}
          </el-button>
        </div>
      </transition>
    </div>

    <!-- 移除空间昵称设置区域 -->

    <!-- 成员(1/不限) -->
    <div class="flex items-center justify-between bg-gray-50 px-20px py-12px">
      <span class="text-primary font-bold">{{ $t('space.member.members_count', { count: members.length }) }}</span>

      <!-- 搜索成员输入框 -->
      <div class="w-300px lt-md:w-50%">
        <el-input
          v-model="searchQuery"
          :placeholder="$t('space.member.search_placeholder')"
          :prefix-icon="Search"
          clearable
        />
      </div>
    </div>

    <!-- 成员列表表头 - 改为3列 -->
    <div class="grid grid-cols-3 border-b border-gray-200 px-20px py-12px font-medium">
      <div class="pl-20px">
        {{ $t('space.member.member_label') }}
      </div>
      <div class="pl-20px">
        {{ $t('common.roles.label') }}
      </div>
      <div class="pl-20px">
        {{ $t('common.actions.operations') }}
      </div>
    </div>

    <!-- 成员列表内容 - 改为3列 -->
    <div v-for="member in filteredMembers" :key="member.id" class="grid grid-cols-3 border-b border-gray-200 px-20px py-16px">
      <div class="flex items-center">
        <el-avatar :size="28" class="mr-8px">
          {{ member.username.charAt(0).toUpperCase() }}
        </el-avatar>
        <span>{{ member.username }}</span>
      </div>
      <div class="flex items-center px-20px">
        <!-- 直接显示角色名称，不支持修改 -->
        <span>
          {{ roleOptions.find(option => option.value === member.role)?.label || member.role }}
        </span>
      </div>
      <div class="flex items-center px-20px">
        <el-button
          v-if="member.role !== 'admin'"
          type="danger"
          link
          @click="removeMember(member)"
        >
          {{ $t('common.actions.remove') }}
        </el-button>
      </div>
    </div>

    <!-- 添加成员对话框 -->
    <el-dialog
      v-model="addMemberDialogVisible"
      :title="$t('common.user.add_member')"
      width="500px"
    >
      <el-form
        ref="addMemberFormRef"
        :model="addMemberForm"
        :rules="addMemberRules"
        label-width="100px"
      >
        <el-form-item :label="$t('common.user.email')" prop="email">
          <el-input
            v-model="addMemberForm.email"
            :placeholder="$t('common.user.email_placeholder')"
          />
        </el-form-item>
        <el-form-item :label="$t('common.roles.label')" prop="role">
          <el-select v-model="addMemberForm.role">
            <el-option
              v-for="option in roleOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addMemberDialogVisible = false">
          {{ $t('common.actions.cancel') }}
        </el-button>
        <el-button type="primary" @click="submitAddMember">
          {{ $t('common.actions.confirm') }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.space-member-panel {
  :deep(.el-avatar) {
    background-color: var(--el-color-primary);
  }
}
</style>
