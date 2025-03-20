<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { ref } from 'vue'

definePageMeta({
  layout: 'sys',
})

const form = ref({
  username: '',
  password: '',
})

const rules = ref({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
  ],
})

const formRef = ref<FormInstance>()

function handleSubmit() {
  formRef.value?.validate((valid) => {
    if (valid) {
      console.log('submit!')
    }
  })
}
</script>

<template>
  <div>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名" />
      </el-form-item>
    </el-form>
  </div>
</template>
