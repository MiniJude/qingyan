<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { ref } from 'vue'

definePageMeta({
  layout: 'sys',
  title: '输入手机号',
})

const form = ref({
  phone: '',
  code: '',
})

const rules = ref({
  phone: [
    { message: '请输入手机号', trigger: 'blur' },
  ],
  code: [
    { message: '请输入验证码', trigger: 'blur' },
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
  <div w-450px p="t-48px b-40px r-65px l-65px">
    <el-form ref="formRef" class="w-320px" :model="form" :rules="rules" label-width="100px" label-position="top">
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone">
          <template #suffix>
            <SvgoPhone text-tprimary />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="code">
        <div flex="~ gap-15px" w-full>
          <el-input v-model="form.code" class="flex-1" />
          <el-button type="primary" class="!h-45px !w-119px">
            获取验证码
          </el-button>
        </div>
      </el-form-item>
      <el-form-item class="!mt-45px">
        <el-button type="primary" class="mx-auto block !h-40px !w-102px">
          完成
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-form-item) {
  margin-bottom: 0;
  margin-top: 20px;

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
  }
}
</style>
