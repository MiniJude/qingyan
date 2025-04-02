<script setup lang="ts">
import { ref } from 'vue'
import FlowDialog from '~/components/FlowDialog.vue'

// 定义步骤组件
const Step1 = {
  name: 'Step1',
  template: `
    <div class="p-8">
      <h3 class="text-lg font-bold mb-4">第一步：基本信息</h3>
      <el-form label-position="top">
        <el-form-item label="姓名">
          <el-input />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input />
        </el-form-item>
      </el-form>
    </div>
  `,
}

const Step2 = {
  name: 'Step2',
  template: `
    <div class="p-8">
      <h3 class="text-lg font-bold mb-4">第二步：详细信息</h3>
      <el-form label-position="top">
        <el-form-item label="地址">
          <el-input />
        </el-form-item>
        <el-form-item label="公司">
          <el-input />
        </el-form-item>
      </el-form>
    </div>
  `,
}

const Step3 = {
  name: 'Step3',
  template: `
    <div class="p-8">
      <h3 class="text-lg font-bold mb-4">第三步：完成</h3>
      <div class="text-center">
        <el-icon class="text-5xl text-green-500 mb-4">
          <el-icon-check />
        </el-icon>
        <p>恭喜您已完成全部步骤！</p>
      </div>
    </div>
  `,
}

// 流程步骤数组
const steps = [
  { component: Step1, title: '基本信息' },
  { component: Step2, title: '详细信息' },
  { component: Step3, title: '完成' },
]

// 当前步骤
const currentStep = ref(0)

// 显示弹框
const showDialog = ref(true)

// 关闭弹框
function closeDialog() {
  showDialog.value = false
}
</script>

<template>
  <div>
    <el-button @click="showDialog = true">
      打开流程弹框
    </el-button>
    <FlowDialog
      v-if="showDialog"
      v-model="currentStep"
      :steps="steps"
      @close="closeDialog"
    />
  </div>
</template>
