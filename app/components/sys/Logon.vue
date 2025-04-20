<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { User } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { HOME_ROUTE } from '~/constants'
import { createValidationRules } from '~/utils/validate'

const props = defineProps<{
  onOpenRegisterDialog: () => void
  onForgotPassword: () => void
}>()

const { t } = useI18n()
const localePath = useLocalePath()

const form = ref({
  phone: '',
  password: '',
})

// 获取表单验证规则
const { passwordRules } = createValidationRules()

const rules = ref({
  phone: [{ required: true, message: t('common.validation.required', { field: t('header.user_profile.phone') }), trigger: 'blur' }],
  password: passwordRules,
})

const formRef = ref<FormInstance>()

async function submit() {
  await formRef.value?.validate()

  try {
    await useLogin(form.value.phone, form.value.password)
    ElMessage.success(t('login.success'))

    // 获取默认空间id
    const defaultSpaceId = await Promise.resolve('1')

    // 导航到首页，路径中包含空间ID
    // 路由中间件会自动获取空间信息并存储到store中
    navigateTo(localePath(`/group/${defaultSpaceId}${HOME_ROUTE}` as I18nRoutePath))
  }
  catch (error) {
    console.error(error)
    throw new Error('登录失败')
  }
}

defineExpose({
  submit,
})
</script>

<template>
  <div>
    <div p="r-60px" flex="~ gap-5px" items-center md:w-650px lt-md:flex-col lt-md:pr-0>
      <div flex="~ col items-center" mb-10px w-265px self-end lt-md:hidden>
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
        ref="formRef" class="w-320px pb-20px pt-83px lt-md:w-auto lt-md:px-10px" :model="form" :rules="rules" label-width="100px"
        label-position="top"
      >
        <el-form-item :label="`${$t('login.phone.phone')}/${$t('header.user_profile.username')}`" prop="phone">
          <el-input v-model="form.phone" autocomplete="off">
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
          <span cursor-pointer hover-text-primary @click="props.onOpenRegisterDialog">{{ $t('login.no_account_register') }}</span>
          <span cursor-pointer hover-text-primary @click="props.onForgotPassword">{{ $t('login.forgot_password') }}</span>
        </div>
      </el-form>
    </div>
    <div class="text-center !py-30px">
      <el-button type="primary" class="mx-auto block !h-40px !w-102px" @click="submit">
        {{ $t('login.login_button') }}
      </el-button>
    </div>
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
