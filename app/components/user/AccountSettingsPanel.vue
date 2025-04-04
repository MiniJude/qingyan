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
// 手机号修改对话框
const phoneDialogVisible = ref(false)
// 邮箱修改对话框
const emailDialogVisible = ref(false)

// 密码表单ref
const passwordFormRef = ref<FormInstance>()
// 手机号表单ref
const phoneFormRef = ref<FormInstance>()
// 邮箱表单ref
const emailFormRef = ref<FormInstance>()

// 密码表单数据
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// 手机号表单数据
const phoneForm = ref({
  newPhone: '',
})

// 邮箱表单数据
const emailForm = ref({
  newEmail: '',
})

// 密码表单验证规则
const passwordRules = reactive<FormRules>({
  currentPassword: [
    { required: true, message: t('common.validation.required', { field: t('header.user_profile.current_password') }), trigger: 'blur' },
  ],
  newPassword: [
    { required: true, message: t('common.validation.required', { field: t('header.user_profile.new_password') }), trigger: 'blur' },
    {
      pattern: /^[\w!@#$%^&*]{6,30}$/,
      message: t('common.validation.format_error', { field: t('header.user_profile.password') }),
      trigger: 'blur',
    },
  ],
  confirmPassword: [
    { required: true, message: t('common.validation.required', { field: t('header.user_profile.confirm_password') }), trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: (error?: Error) => void) => {
        if (value !== passwordForm.value.newPassword) {
          callback(new Error(t('common.validation.password_not_match')))
        }
        else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
})

// 手机号表单验证规则
const phoneRules = reactive<FormRules>({
  newPhone: [
    { required: true, message: t('common.validation.required', { field: t('header.user_profile.phone') }), trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: t('common.validation.format_error', { field: t('header.user_profile.phone') }), trigger: 'blur' },
  ],
})

// 邮箱表单验证规则
const emailRules = reactive<FormRules>({
  newEmail: [
    { required: true, message: t('common.validation.required', { field: t('header.user_profile.email') }), trigger: 'blur' },
    { pattern: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/, message: t('common.validation.format_error', { field: t('header.user_profile.email') }), trigger: 'blur' },
  ],
})

// 显示修改手机号对话框
function updatePhone() {
  phoneDialogVisible.value = true
  // 重置表单
  phoneForm.value = {
    newPhone: '',
  }
}

// 显示修改邮箱对话框
function updateEmail() {
  emailDialogVisible.value = true
  // 重置表单
  emailForm.value = {
    newEmail: '',
  }
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

// 提交手机号修改
async function submitPhoneChange() {
  if (!phoneFormRef.value)
    return

  try {
    await phoneFormRef.value.validate()

    // 这里添加手机号修改的API调用逻辑
    // await updateUserPhone(phoneForm.value.newPhone)

    // 更新本地显示的手机号
    formData.value.phone = phoneForm.value.newPhone

    // 显示成功消息
    ElMessage.success(t('common.messages.update_success', { item: t('header.user_profile.phone') }))

    // 关闭对话框
    phoneDialogVisible.value = false
  }
  catch (error) {
    // 表单验证失败
    console.error('Phone form validation failed', error)
  }
}

// 提交邮箱修改
async function submitEmailChange() {
  if (!emailFormRef.value)
    return

  try {
    await emailFormRef.value.validate()

    // 这里添加邮箱修改的API调用逻辑
    // await updateUserEmail(emailForm.value.newEmail)

    // 更新本地显示的邮箱
    formData.value.email = emailForm.value.newEmail

    // 显示成功消息
    ElMessage.success(t('common.messages.update_success', { item: t('header.user_profile.email') }))

    // 关闭对话框
    emailDialogVisible.value = false
  }
  catch (error) {
    // 表单验证失败
    console.error('Email form validation failed', error)
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
    ElMessage.success(t('common.messages.update_success', { item: t('header.user_profile.password') }))

    // 关闭对话框
    passwordDialogVisible.value = false
  }
  catch (error) {
    // 表单验证失败
    console.error('Password form validation failed', error)
  }
}

// 关闭对话框
function closeDialog(type: 'password' | 'phone' | 'email') {
  if (type === 'password') {
    passwordDialogVisible.value = false
  }
  else if (type === 'phone') {
    phoneDialogVisible.value = false
  }
  else if (type === 'email') {
    emailDialogVisible.value = false
  }
}
</script>

<template>
  <el-form class="account-settings-form" label-width="80px" label-position="left">
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

  <!-- 修改手机号对话框 -->
  <el-dialog
    v-model="phoneDialogVisible"
    :title="$t('header.user_profile.update_phone')"
    width="500px"
    :close-on-click-modal="false"
  >
    <el-form
      ref="phoneFormRef"
      :model="phoneForm"
      :rules="phoneRules"
      label-width="160px"
    >
      <el-form-item
        :label="$t('header.user_profile.new_phone')"
        prop="newPhone"
      >
        <el-input
          v-model="phoneForm.newPhone"
          :placeholder="$t('header.user_profile.enter_new_phone')"
        />
      </el-form-item>
    </el-form>

    <!-- 底部按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeDialog('phone')">
          {{ $t('common.actions.cancel') }}
        </el-button>
        <el-button type="primary" @click="submitPhoneChange">
          {{ $t('common.actions.confirm') }}
        </el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 修改邮箱对话框 -->
  <el-dialog
    v-model="emailDialogVisible"
    :title="$t('header.user_profile.update_email')"
    width="500px"
    :close-on-click-modal="false"
  >
    <el-form
      ref="emailFormRef"
      :model="emailForm"
      :rules="emailRules"
      label-width="160px"
    >
      <el-form-item
        :label="$t('header.user_profile.new_email')"
        prop="newEmail"
      >
        <el-input
          v-model="emailForm.newEmail"
          :placeholder="$t('header.user_profile.enter_new_email')"
        />
      </el-form-item>
    </el-form>

    <!-- 底部按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeDialog('email')">
          {{ $t('common.actions.cancel') }}
        </el-button>
        <el-button type="primary" @click="submitEmailChange">
          {{ $t('common.actions.confirm') }}
        </el-button>
      </div>
    </template>
  </el-dialog>

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
        <el-button @click="closeDialog('password')">
          {{ $t('common.actions.cancel') }}
        </el-button>
        <el-button type="primary" @click="submitPasswordChange">
          {{ $t('common.actions.confirm') }}
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
