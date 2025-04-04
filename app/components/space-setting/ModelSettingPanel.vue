<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'

const { t } = useI18n()

// 表单数据
const formData = ref({
  defaultModel: 'gpt-4',
  temperature: 0.7,
  maxTokens: 2000,
  topP: 0.9,
  frequencyPenalty: 0,
  presencePenalty: 0,
})

// 表单ref
const formRef = ref<FormInstance>()

// 模型选项
const modelOptions = [
  {
    label: 'GPT-4',
    value: 'gpt-4',
  },
  {
    label: 'GPT-3.5-Turbo',
    value: 'gpt-3.5-turbo',
  },
]

// 表单验证规则
const rules = reactive<FormRules>({
  defaultModel: [
    { required: true, message: t('common.validation.required', { field: t('space.model.default_model') }), trigger: 'change' },
  ],
  temperature: [
    { required: true, message: t('common.validation.required', { field: t('space.model.temperature') }), trigger: 'blur' },
    { type: 'number', min: 0, max: 1, message: t('space.model.temperature_range'), trigger: 'blur' },
  ],
  maxTokens: [
    { required: true, message: t('common.validation.required', { field: t('space.model.max_tokens') }), trigger: 'blur' },
    { type: 'number', min: 1, max: 4096, message: t('space.model.max_tokens_range'), trigger: 'blur' },
  ],
  topP: [
    { required: true, message: t('common.validation.required', { field: t('space.model.top_p') }), trigger: 'blur' },
    { type: 'number', min: 0, max: 1, message: t('space.model.top_p_range'), trigger: 'blur' },
  ],
})

// 保存设置
async function saveSettings() {
  if (!formRef.value)
    return

  try {
    await formRef.value.validate()
    // TODO: 调用API保存设置
    ElMessage.success(t('common.messages.update_success', { item: t('space.model.title') }))
  }
  catch (error) {
    console.error('Form validation failed:', error)
  }
}
</script>

<template>
  <div class="space-model-panel">
    <!-- 头部标题和描述 -->
    <div class="mb-20px p-20px">
      <h2 class="mb-10px text-24px font-bold">
        {{ $t('space.model.title') }}
      </h2>
      <p class="text-gray-500">
        {{ $t('space.model.description') }}
      </p>
    </div>

    <!-- 设置表单 -->
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="160px"
      class="p-20px"
    >
      <!-- 默认模型 -->
      <el-form-item :label="$t('space.model.default_model')" prop="defaultModel">
        <el-select v-model="formData.defaultModel">
          <el-option
            v-for="option in modelOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>

      <!-- Temperature -->
      <el-form-item :label="$t('space.model.temperature')" prop="temperature">
        <el-slider
          v-model="formData.temperature"
          :min="0"
          :max="1"
          :step="0.1"
          show-input
        />
        <div class="mt-2 text-sm text-gray-500">
          {{ $t('space.model.temperature_tip') }}
        </div>
      </el-form-item>

      <!-- Max Tokens -->
      <el-form-item :label="$t('space.model.max_tokens')" prop="maxTokens">
        <el-input-number
          v-model="formData.maxTokens"
          :min="1"
          :max="4096"
          :step="100"
        />
        <div class="mt-2 text-sm text-gray-500">
          {{ $t('space.model.max_tokens_tip') }}
        </div>
      </el-form-item>

      <!-- Top P -->
      <el-form-item :label="$t('space.model.top_p')" prop="topP">
        <el-slider
          v-model="formData.topP"
          :min="0"
          :max="1"
          :step="0.1"
          show-input
        />
        <div class="mt-2 text-sm text-gray-500">
          {{ $t('space.model.top_p_tip') }}
        </div>
      </el-form-item>

      <!-- Frequency Penalty -->
      <el-form-item :label="$t('space.model.frequency_penalty')" prop="frequencyPenalty">
        <el-slider
          v-model="formData.frequencyPenalty"
          :min="-2"
          :max="2"
          :step="0.1"
          show-input
        />
        <div class="mt-2 text-sm text-gray-500">
          {{ $t('space.model.frequency_penalty_tip') }}
        </div>
      </el-form-item>

      <!-- Presence Penalty -->
      <el-form-item :label="$t('space.model.presence_penalty')" prop="presencePenalty">
        <el-slider
          v-model="formData.presencePenalty"
          :min="-2"
          :max="2"
          :step="0.1"
          show-input
        />
        <div class="mt-2 text-sm text-gray-500">
          {{ $t('space.model.presence_penalty_tip') }}
        </div>
      </el-form-item>

      <!-- 保存按钮 -->
      <el-form-item>
        <el-button type="primary" @click="saveSettings">
          {{ $t('common.actions.save') }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.space-model-panel {
  :deep(.el-form-item) {
    margin-bottom: 24px;
  }

  :deep(.el-slider) {
    width: 300px;
  }
}
</style>
