import type { FormItemRule } from 'element-plus'

// 邮箱验证规则
export const emailRules: FormItemRule[] = [
  { required: true, message: '请输入邮箱', trigger: 'blur' },
  {
    pattern: /^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i,
    message: '请输入正确的邮箱格式',
    trigger: 'blur',
  },
]

// 密码验证规则
export const passwordRules: FormItemRule[] = [
  { required: true, message: '请输入密码', trigger: 'blur' },
  {
    min: 6,
    max: 16,
    message: '密码长度在6-16个字符之间',
    trigger: 'blur',
  },
]
