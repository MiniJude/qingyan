<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'

interface Props {
  type: 'personal' | 'team'
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'submit', values: { name: string, description: string }): void
}>()

const { t } = useI18n()

const formRef = ref<FormInstance>()
const form = reactive({
  name: '',
  description: '',
})

// 表单验证规则
const rules = reactive<FormRules>({
  name: [
    { required: true, message: t('space.form.name_required'), trigger: 'blur' },
    { min: 2, max: 50, message: t('space.form.name_length'), trigger: 'blur' },
  ],
  description: [
    { max: 50, message: t('space.form.description_length'), trigger: 'blur' },
  ],
})

// 提交表单
async function handleSubmit() {
  if (!formRef.value)
    return

  await formRef.value.validate((valid) => {
    if (valid) {
      emit('submit', {
        name: form.name,
        description: form.description,
      })
    }
  })
}

defineExpose({
  handleSubmit,
})
</script>

<template>
  <div class="create-space-form">
    <div mb-24px text-16px font-500>
      {{ props.type === 'personal' ? t('space.create_dialog.personal') : t('space.create_dialog.team') }}
    </div>
    <div mb-24px text-14px color-gray-500>
      {{ props.type === 'personal'
        ? t('space.create_dialog.personal_desc')
        : t('space.create_dialog.team_desc')
      }}
    </div>

    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
    >
      <el-form-item
        :label="t('space.form.name')"
        prop="name"
      >
        <el-input
          v-model="form.name"
          :placeholder="t('space.form.name_placeholder')"
          maxlength="50"
          show-word-limit
        />
      </el-form-item>

      <el-form-item
        :label="t('space.form.description')"
        prop="description"
      >
        <el-input
          v-model="form.description"
          type="textarea"
          :placeholder="t('space.form.description_placeholder')"
          maxlength="50"
          show-word-limit
          :rows="3"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.create-space-form {
  padding: 24px;
}
</style>
