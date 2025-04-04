<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'

const { t } = useI18n()

// 表单数据
const formData = ref({
  name: '我的空间',
  description: '这是一个示例空间',
  visibility: 'private',
})

// 表单ref
const formRef = ref<FormInstance>()

// 表单验证规则
const rules = reactive<FormRules>({
  name: [
    { required: true, message: t('common.validation.required', { field: t('space.settings.name') }), trigger: 'blur' },
    { min: 2, max: 20, message: t('space.settings.name_length'), trigger: 'blur' },
  ],
  description: [
    { max: 200, message: t('space.settings.description_length'), trigger: 'blur' },
  ],
})

// 可见性选项
const visibilityOptions = [
  {
    label: t('space.settings.visibility.private'),
    value: 'private',
  },
  {
    label: t('space.settings.visibility.public'),
    value: 'public',
  },
]

// 保存设置
async function saveSettings() {
  if (!formRef.value)
    return

  try {
    await formRef.value.validate()
    // TODO: 调用API保存设置
    ElMessage.success(t('common.messages.update_success', { item: t('space.settings.title') }))
  }
  catch (error) {
    console.error('Form validation failed:', error)
  }
}
</script>

<template>
  <div class="space-settings-panel">
    <!-- 头部标题和描述 -->
    <div class="mb-20px p-20px">
      <h2 class="mb-10px text-24px font-bold">
        {{ $t('space.settings.title') }}
      </h2>
      <p class="text-gray-500">
        {{ $t('space.settings.description') }}
      </p>
    </div>

    <!-- 设置表单 -->
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="100px"
      class="p-20px"
    >
      <!-- 空间名称 -->
      <el-form-item :label="$t('space.settings.name')" prop="name">
        <el-input
          v-model="formData.name"
          :placeholder="$t('space.settings.name_placeholder')"
        />
      </el-form-item>

      <!-- 空间描述 -->
      <el-form-item :label="$t('space.settings.description')" prop="description">
        <el-input
          v-model="formData.description"
          type="textarea"
          :rows="4"
          :placeholder="$t('space.settings.description_placeholder')"
        />
      </el-form-item>

      <!-- 可见性设置 -->
      <el-form-item :label="$t('space.settings.visibility.label')" prop="visibility">
        <el-radio-group v-model="formData.visibility">
          <el-radio
            v-for="option in visibilityOptions"
            :key="option.value"
            :label="option.value"
          >
            {{ option.label }}
          </el-radio>
        </el-radio-group>
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
.space-settings-panel {
  :deep(.el-form-item) {
    margin-bottom: 20px;
  }
}
</style>
