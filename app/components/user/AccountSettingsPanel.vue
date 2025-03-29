<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { useI18n } from 'vue-i18n'

interface Props {
  /** 用户账号信息 */
  accountInfo: {
    phone: string
    email: string
    password: string
  }
}

const props = defineProps<Props>()
const { t } = useI18n()

// 表单数据
const formData = ref({
  phone: '',
  email: '',
  password: '',
})

// 为了避免直接修改props，初始化formData
onMounted(() => {
  formData.value = {
    phone: props.accountInfo.phone,
    email: props.accountInfo.email,
    password: props.accountInfo.password,
  }
})

// 密码修改对话框
const passwordDialogVisible = ref(false)

// 密码表单ref
const passwordFormRef = ref<FormInstance>()

// 密码表单数据
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// 密码表单验证规则
const passwordRules = reactive<FormRules>({
  currentPassword: [
    { required: true, message: t('header.user_profile.current_password_required'), trigger: 'blur' },
  ],
  newPassword: [
    { required: true, message: t('header.user_profile.new_password_required'), trigger: 'blur' },
    {
      pattern: /^[\w!@#$%^&*]{6,30}$/,
      message: t('header.user_profile.password_format_error'),
      trigger: 'blur',
    },
  ],
  confirmPassword: [
    { required: true, message: t('header.user_profile.confirm_password_required'), trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: (error?: Error) => void) => {
        if (value !== passwordForm.value.newPassword) {
          callback(new Error(t('header.user_profile.password_not_match')))
        }
        else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
})

// 修改手机号
function updatePhone() {
  // 这里可以添加验证逻辑
  ElMessageBox.prompt(t('header.user_profile.enter_new_phone'), t('header.user_profile.update_phone'), {
    confirmButtonText: t('knowledge_base.confirm'),
    cancelButtonText: t('knowledge_base.cancel'),
    inputPattern: /^1[3-9]\d{9}$/,
    inputErrorMessage: t('header.user_profile.phone_format_error'),
  })
    .then(({ value }) => {
      formData.value.phone = value
      ElMessage.success(t('header.user_profile.phone_update_success'))
    })
    .catch(() => {
      // 用户取消操作
    })
}

// 修改邮箱
function updateEmail() {
  // 这里可以添加验证逻辑
  ElMessageBox.prompt(t('header.user_profile.enter_new_email'), t('header.user_profile.update_email'), {
    confirmButtonText: t('knowledge_base.confirm'),
    cancelButtonText: t('knowledge_base.cancel'),
    inputPattern: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
    inputErrorMessage: t('header.user_profile.email_format_error'),
  })
    .then(({ value }) => {
      formData.value.email = value
      ElMessage.success(t('header.user_profile.email_update_success'))
    })
    .catch(() => {
      // 用户取消操作
    })
}

// 显示修改密码对话框
function updatePassword() {
  passwordDialogVisible.value = true
  // 重置表单
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  }
}

// 提交密码修改
async function submitPasswordChange() {
  if (!passwordFormRef.value)
    return

  try {
    await passwordFormRef.value.validate()

    // 这里添加密码修改的API调用逻辑
    // await updateUserPassword(passwordForm.value)

    // 更新本地显示的密码（实际环境可能需要显示为*）
    formData.value.password = '********'

    // 显示成功消息
    ElMessage.success(t('header.user_profile.password_update_success'))

    // 关闭对话框
    passwordDialogVisible.value = false
  }
  catch (error) {
    // 表单验证失败
    console.error('Password form validation failed', error)
  }
}

// 关闭密码对话框
function closePasswordDialog() {
  passwordDialogVisible.value = false
}
</script>

<template>
  <el-form class="account-settings-form" label-width="80px" label-position="left">
    <!-- 头部标题和描述 -->
    <div class="mb-20px">
      <h2 class="mb-10px text-24px font-bold">
        {{ $t('header.user_profile.account_settings') }}
      </h2>
    </div>
    <!-- 手机号 -->
    <el-form-item :label="$t('header.user_profile.phone')">
      <div class="flex flex-1 items-center justify-between">
        <div class="text-tdisabled">
          {{ formData.phone }}
        </div>
        <div class="i-carbon:edit edit-btn" @click="updatePhone" />
      </div>
    </el-form-item>

    <!-- 邮箱 -->
    <el-form-item :label="$t('header.user_profile.email')">
      <div class="flex flex-1 items-center justify-between">
        <div class="text-tdisabled">
          {{ formData.email }}
        </div>
        <div class="i-carbon:edit edit-btn" @click="updateEmail" />
      </div>
    </el-form-item>

    <!-- 密码 -->
    <el-form-item :label="$t('header.user_profile.password')">
      <div class="flex flex-1 items-center justify-between">
        <div class="text-tdisabled">
          {{ formData.password }}
        </div>
        <div class="i-carbon:edit edit-btn" @click="updatePassword" />
      </div>
    </el-form-item>
  </el-form>

  <!-- 修改密码对话框 -->
  <el-dialog
    v-model="passwordDialogVisible"
    :title="$t('header.user_profile.change_password')"
    width="500px"
    :close-on-click-modal="false"
  >
    <el-form
      ref="passwordFormRef"
      :model="passwordForm"
      :rules="passwordRules"
      label-width="160px"
    >
      <!-- a. 当前密码 -->
      <el-form-item
        :label="$t('header.user_profile.current_password')"
        prop="currentPassword"
      >
        <el-input
          v-model="passwordForm.currentPassword"
          type="password"
          :placeholder="$t('header.user_profile.enter_current_password')"
          show-password
        />
      </el-form-item>

      <!-- b. 新密码 -->
      <el-form-item
        :label="$t('header.user_profile.new_password')"
        prop="newPassword"
      >
        <el-input
          v-model="passwordForm.newPassword"
          type="password"
          :placeholder="$t('header.user_profile.password_format_tip')"
          show-password
        />
      </el-form-item>

      <!-- c. 确认新密码 -->
      <el-form-item
        :label="$t('header.user_profile.confirm_password')"
        prop="confirmPassword"
      >
        <el-input
          v-model="passwordForm.confirmPassword"
          type="password"
          :placeholder="$t('header.user_profile.enter_confirm_password')"
          show-password
        />
      </el-form-item>
    </el-form>

    <!-- 底部按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closePasswordDialog">
          {{ $t('knowledge_base.cancel') }}
        </el-button>
        <el-button type="primary" @click="submitPasswordChange">
          {{ $t('knowledge_base.confirm') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.account-settings-form {
  padding: 20px;

  :deep(.el-form-item) {
    margin-bottom: 0;
    padding: 20px 0;
    border-bottom: 1px solid #e6e6e6;
  }

  :deep(.el-form-item:last-child) {
    border-bottom: none;
  }
  .edit-btn {
    margin-left: 36px;
    margin-right: 10px;
    height: 16px;
    width: 16px;
    cursor: pointer;
    color: var(--el-color-primary);
  }
}
</style>
