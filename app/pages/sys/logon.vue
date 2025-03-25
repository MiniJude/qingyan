<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { User } from '@element-plus/icons-vue'
import { ref } from 'vue'

definePageMeta({
  layout: 'sys',
  title: '登录账户',
})

const form = ref({
  account: '',
  password: '',
})

const rules = ref({
  account: [
    { message: '请输入登录账户', trigger: 'blur' },
  ],
  password: [
    { message: '请输入登录密码', trigger: 'blur' },
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
  <div p="r-60px" flex="~ gap-5px" w-650px items-center>
    <div flex="~ col items-center" w-265px>
      <img src="@/assets/img/qrcode.png" alt="wechat" w-145px>
      <div mt-15px pl-7px flex w-145px items-center>
        <img src="@/assets/img/wechat.png" alt="wechat" w-21px>
        <span text="12px tprimary" ml-27px>清研智库</span>
      </div>
      <p mt-5px text="12px tprimary" opacity-80>
        获取最新资讯动态和精彩活动
      </p>
    </div>
    <el-form
      ref="formRef" class="pb-40px pt-83px w-320px" :model="form" :rules="rules" label-width="100px"
      label-position="top"
    >
      <el-form-item label="账号" prop="account">
        <el-input v-model="form.account" autocomplete="off">
          <template #suffix>
            <el-icon>
              <User />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password" show-password />
      </el-form-item>
      <p text="12px tprimary" text-right opacity-90 cursor-pointer>
        忘记密码
      </p>
      <el-form-item class="!mb-0 !mt-30px">
        <el-button type="primary" class="mx-auto block !h-40px !w-102px">
          下一步
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style></style>

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
