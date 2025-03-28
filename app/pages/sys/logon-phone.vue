<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { ref } from 'vue'

definePageMeta({
  layout: 'sys',
  title: 'login.phone.title',
})

const { t } = useI18n()

const form = ref({
  phone: '',
  code: '',
})

const rules = ref({
  phone: [
    { message: t('login.phone.phone_required'), trigger: 'blur' },
  ],
  code: [
    { message: t('login.phone.code_required'), trigger: 'blur' },
  ],
})

const formRef = ref<FormInstance>()

function handleSubmit() {
  formRef.value?.validate((valid) => {
    if (valid) {
      console.warn('Form submitted')
    }
  })
}
</script>

<template>
  <div w-450px p="t-48px b-40px r-65px l-65px">
    <el-form ref="formRef" class="w-320px" :model="form" :rules="rules" label-width="100px" label-position="top">
      <el-form-item :label="$t('login.phone.phone')" prop="phone">
        <el-input v-model="form.phone">
          <template #suffix>
            <SvgoPhone text-tprimary />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('login.phone.code')" prop="code">
        <div flex="~ gap-15px" w-full>
          <el-input v-model="form.code" class="flex-1" />
          <el-button type="primary" class="!h-45px !w-119px">
            {{ $t('login.phone.get_code') }}
          </el-button>
        </div>
      </el-form-item>
      <el-form-item class="!mt-45px">
        <el-button type="primary" class="mx-auto block !h-40px !w-102px" @click="handleSubmit">
          {{ $t('login.phone.finish') }}
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
