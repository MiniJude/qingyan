import type { FormItemRule } from 'element-plus'
import { useI18n } from 'vue-i18n'

/**
 * 检查手机号是否有效（通过后端API验证）
 * @param phone 手机号
 * @returns 验证结果
 */
async function checkPhone(phone: string, type: 'register' | 'changePassword') {
  const url = `/api/member/${type === 'register' ? 'register' : 'changePassword'}/checkPhone/`
  await $api(url, {
    method: 'POST',
    body: { phone },
  })
}

/**
 * 创建带有国际化的表单验证规则
 */
export function createValidationRules() {
  const { t } = useI18n()

  // 邮箱验证规则
  const emailRules: FormItemRule[] = [
    { required: true, message: t('common.validation.required', { field: t('header.user_profile.email') }), trigger: 'blur' },
    {
      pattern: /^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i,
      message: t('common.validation.format_error', { field: t('header.user_profile.email') }),
      trigger: 'blur',
    },
  ]

  // 密码验证规则
  const passwordRules: FormItemRule[] = [
    { required: true, message: t('common.validation.required', { field: t('header.user_profile.password') }), trigger: 'blur' },
    {
      min: 6,
      max: 16,
      message: t('login.password_length'),
      trigger: 'blur',
    },
  ]

  // 确认密码验证规则
  const createPassword2Rules = (form: any): FormItemRule[] => [
    { required: true, message: t('common.validation.required', { field: t('header.user_profile.confirm_password') }), trigger: 'blur' },
    {
      min: 6,
      max: 16,
      message: t('login.password_length'),
      trigger: 'blur',
    },
    {
      validator: (rule, value, callback) => {
        if (value !== form.password) {
          callback(new Error(t('common.validation.password_not_match')))
        }
        else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ]

  // 手机号验证规则
  const phonePattern = /^1[3-9]\d{9}$/
  const createPhoneRules = (type: 'register' | 'changePassword' = 'register'): FormItemRule[] => [
    { required: true, message: t('login.phone.phone_required'), trigger: 'blur' },
    {
      pattern: phonePattern,
      message: t('login.phone.phone_format_error'),
      trigger: 'blur',
    },
    // 异步验证手机号
    {
      validator: (rule, value, callback) => {
        // 如果手机号不是11位或者不符合正则，不进行API验证
        if (!value || value.length !== 11 || !phonePattern.test(value)) {
          callback()
          return
        }

        // 进行API验证
        checkPhone(value, type).then(() => {
          callback()
        }).catch((error) => {
          if (error.message) {
            callback(new Error(error.message))
          }
          else {
            callback(new Error(t('login.phone.phone_not_available')))
          }
        })
      },
      trigger: ['blur', 'change'],
    },
  ]

  // 验证码验证规则
  const vcodeRules: FormItemRule[] = [
    { required: true, message: t('login.phone.vcode_required'), trigger: 'blur' },
  ]

  return {
    emailRules,
    passwordRules,
    createPassword2Rules,
    createPhoneRules,
    vcodeRules,
  }
}
