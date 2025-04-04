<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { InfoFilled } from '@element-plus/icons-vue'

const { t } = useI18n()

// 表单数据
const formData = ref({
  // 默认大模型
  defaultModelType: '智谱(智谱AI)',
  defaultModelApiUrl: 'https://open.bigmodel.cn/api/paas/v4/',
  defaultModelApiKey: '',
  defaultModelVersion: 'glm-4-plus',

  // 魔法文档智能对话大模型
  docModelType: '智谱(智谱AI)',
  docModelApiUrl: 'https://open.bigmodel.cn/api/paas/v4/',
  docModelApiKey: '',
  docModelVersion: 'glm-4-plus',
})

// 表单ref
const formRef = ref<FormInstance>()

// 模型选项
const modelOptions = [
  {
    label: '智谱(智谱AI)',
    value: '智谱(智谱AI)',
  },
]

// 模型版本选项
const modelVersionOptions = [
  {
    label: 'glm-4-plus',
    value: 'glm-4-plus',
  },
]

// 表单验证规则
const rules = reactive<FormRules>({
  defaultModelType: [
    { required: true, message: t('common.validation.required', { field: t('space.model.model_type') }), trigger: 'change' },
  ],
  defaultModelApiUrl: [
    { required: true, message: t('common.validation.required', { field: t('space.model.api_url') }), trigger: 'blur' },
  ],
  defaultModelApiKey: [
    { required: true, message: t('common.validation.required', { field: t('space.model.api_key') }), trigger: 'blur' },
  ],
  defaultModelVersion: [
    { required: true, message: t('common.validation.required', { field: t('space.model.model_version') }), trigger: 'change' },
  ],
  docModelType: [
    { required: true, message: t('common.validation.required', { field: t('space.model.model_type') }), trigger: 'change' },
  ],
  docModelApiUrl: [
    { required: true, message: t('common.validation.required', { field: t('space.model.api_url') }), trigger: 'blur' },
  ],
  docModelApiKey: [
    { required: true, message: t('common.validation.required', { field: t('space.model.api_key') }), trigger: 'blur' },
  ],
  docModelVersion: [
    { required: true, message: t('common.validation.required', { field: t('space.model.model_version') }), trigger: 'change' },
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
    <!-- 设置表单 -->
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      class="p-20px"
    >
      <!-- 默认大模型配置 -->
      <div class="model-section mb-30px">
        <h3 class="mb-15px flex items-center text-18px font-bold">
          <span>{{ $t('space.model.default_model_title') }}</span>
          <el-tooltip :content="$t('space.model.default_model_tip')" placement="top">
            <el-icon :size="18" class="ml-5px">
              <InfoFilled />
            </el-icon>
          </el-tooltip>
        </h3>

        <!-- 模型选择 -->
        <el-form-item prop="defaultModelType">
          <el-select v-model="formData.defaultModelType" :placeholder="$t('space.model.model_type_placeholder')" class="w-full">
            <el-option
              v-for="option in modelOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>

        <!-- API地址 -->
        <el-form-item prop="defaultModelApiUrl">
          <el-input
            v-model="formData.defaultModelApiUrl"
            :placeholder="$t('space.model.api_url_placeholder')"
          />
        </el-form-item>

        <!-- API密钥 -->
        <el-form-item prop="defaultModelApiKey">
          <el-input
            v-model="formData.defaultModelApiKey"
          />
        </el-form-item>

        <!-- 模型版本 -->
        <el-form-item prop="defaultModelVersion">
          <el-select v-model="formData.defaultModelVersion" :placeholder="$t('space.model.model_version_placeholder')" class="w-full">
            <el-option
              v-for="option in modelVersionOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>

        <!-- 修改按钮 -->
        <el-button type="primary" @click="saveSettings">
          {{ $t('common.actions.save') }}
        </el-button>
      </div>

      <!-- 分割线 -->
      <el-divider />

      <!-- 魔法文档智能对话大模型 -->
      <div class="model-section mb-30px">
        <h3 class="mb-15px flex items-center text-18px font-bold">
          <span>{{ $t('space.model.doc_model_title') }}</span>
          <el-tooltip :content="$t('space.model.doc_model_tip')" placement="top">
            <el-icon :size="18" class="ml-5px">
              <InfoFilled />
            </el-icon>
          </el-tooltip>
        </h3>

        <!-- 模型选择 -->
        <el-form-item prop="docModelType">
          <el-select v-model="formData.docModelType" :placeholder="$t('space.model.model_type_placeholder')" class="w-full">
            <el-option
              v-for="option in modelOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>

        <!-- API地址 -->
        <el-form-item prop="docModelApiUrl">
          <el-input
            v-model="formData.docModelApiUrl"
            :placeholder="$t('space.model.api_url_placeholder')"
          />
        </el-form-item>

        <!-- API密钥 -->
        <el-form-item prop="docModelApiKey">
          <el-input
            v-model="formData.docModelApiKey"
          />
        </el-form-item>

        <!-- 模型版本 -->
        <el-form-item prop="docModelVersion">
          <el-select v-model="formData.docModelVersion" :placeholder="$t('space.model.model_version_placeholder')" class="w-full">
            <el-option
              v-for="option in modelVersionOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>

        <!-- 修改按钮 -->
        <el-button type="primary" @click="saveSettings">
          {{ $t('common.actions.save') }}
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.space-model-panel {
  :deep(.el-form-item) {
    margin-bottom: 16px;
  }

  :deep(.el-select) {
    width: 100%;
  }

  .model-section {
    padding: 10px 0;
  }
}
</style>
