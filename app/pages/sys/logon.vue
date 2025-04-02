<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { User } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import RegisterDialog from '~/components/RegisterDialog.vue'
import { createValidationRules } from '~/utils/validate'

definePageMeta({
  layout: 'sys',
})

const { t } = useI18n()

const { login } = useAuth()

// 注册弹框显示状态
const registerDialogVisible = ref(false)

// 打开注册弹框
function openRegisterDialog() {
  registerDialogVisible.value = true
}

const form = ref({
  email: '',
  password: '',
})

// 获取表单验证规则
const { emailRules, passwordRules } = createValidationRules()

const rules = ref({
  email: emailRules,
  password: passwordRules,
})

const formRef = ref<FormInstance>()

function handleSubmit() {
  formRef.value?.validate(async (valid) => {
    if (!valid) {
      return
    }

    try {
      await login(form.value.email, form.value.password)
      ElMessage.success(t('login.success'))
      navigateTo('/')
    }
    catch (error) {
      console.error(error)
    }
  })
}
</script>

<template>
  <div>
    <div p="r-60px" flex="~ gap-5px" w-650px items-center>
      <div flex="~ col items-center" w-265px>
        <img src="@/assets/img/qrcode.png" alt="wechat" w-145px>
        <div mt-15px w-145px flex items-center pl-7px>
          <img src="@/assets/img/wechat.png" alt="wechat" w-21px>
          <span text="12px tprimary" ml-27px whitespace-nowrap>{{ $t('login.wechat_title') }}</span>
        </div>
        <p mt-5px text="12px tprimary" opacity-80>
          {{ $t('login.wechat_desc') }}
        </p>
      </div>
      <el-form
        ref="formRef" class="w-320px pb-40px pt-83px" :model="form" :rules="rules" label-width="100px"
        label-position="top"
      >
        <el-form-item :label="$t('login.email')" prop="email">
          <el-input v-model="form.email" autocomplete="off">
            <template #suffix>
              <el-icon>
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('login.password')" prop="password">
          <el-input v-model="form.password" type="password" show-password />
        </el-form-item>
        <div flex="~ justify-between" text="12px tprimary" opacity-90>
          <span cursor-pointer hover-text-primary @click="openRegisterDialog">{{ $t('login.no_account_register') }}</span>
          <span cursor-pointer>{{ $t('login.forgot_password') }}</span>
        </div>
        <el-form-item class="!mb-0 !mt-30px">
          <el-button type="primary" class="mx-auto block !h-40px !w-102px" @click="handleSubmit">
            {{ $t('login.next_step') }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 注册弹框组件 -->
    <RegisterDialog v-model:visible="registerDialogVisible" />
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-input) {
  input:-webkit-autofill {
    background-color: white !important;
    color: black !important;
    transition: background-color 5000s ease-in-out 0s;
  }
}

:deep(.el-form-item) {
  margin-bottom: 20px;

  .el-form-item__label {
    margin-bottom: 10px;
  }

  .el-input {
    .el-input__wrapper {
      // background-color: #c9cdd4;
      padding-top: 0;
      padding-bottom: 0;
    }

    .el-input__inner {
      height: 45px;
      line-height: 45px;
    }

    .el-input__suffix {
      .el-input__suffix-inner {
        .el-icon {
          color: var(--colors-tprimary);
          font-size: 18px;
        }
      }
    }
  }
}
</style>
