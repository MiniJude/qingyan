<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import Avatar from '@/assets/img/avatar.png?url'
import { InfoFilled } from '@element-plus/icons-vue'
import AvatarUploader from '../user/AvatarUploader.vue'

const { t } = useI18n()

// 表单数据
const formData = reactive({
  name: '个人空间',
  description: '',
  publicSpace: false,
  publicApply: false,
  domain: 'TceEXYRqBC',
  logo: Avatar,
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

// 保存设置
async function saveSettings() {
  if (!formRef.value)
    return

  try {
    await formRef.value.validate()
    // TODO: 调用API保存设置
    ElMessage.success(t('space.settings.save_success'))
  }
  catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 头像上传相关
const logoChanged = ref(false)
const originalLogo = ref('/placeholder-logo.png')

// 处理LOGO上传后撤销
function handleCancelLogoUpload() {
  formData.logo = originalLogo.value
  logoChanged.value = false
}

// 处理LOGO更新
function handleLogoUpdate(newLogo: string) {
  if (!logoChanged.value) {
    originalLogo.value = formData.logo
    logoChanged.value = true
  }
  formData.logo = newLogo
}
</script>

<template>
  <div class="space-settings-panel">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-position="top"
      class="setting-form"
    >
      <!-- 空间公开设置 -->
      <el-form-item :label="$t('space.settings.public.title')">
        <div flex items-center gap-2>
          <el-switch v-model="formData.publicSpace" />
          <el-tooltip
            class="box-item"
            effect="dark"
            :content="$t('space.settings.public.description')"
            placement="right"
          >
            <el-icon :size="20">
              <InfoFilled />
            </el-icon>
          </el-tooltip>
          <div>
            <span mr-8px text-tdisabled>{{ $t('space.settings.public.status') }}：</span>
            <span text-tprimary>{{ formData.publicSpace ? $t('space.settings.public.public') : $t('space.settings.public.private') }}</span>
          </div>
        </div>
      </el-form-item>

      <!-- 公开申请加入设置 -->
      <el-form-item :label="$t('space.settings.public_apply.title')">
        <div flex items-center gap-2>
          <el-switch v-model="formData.publicApply" />
          <el-tooltip
            class="box-item"
            effect="dark"
            :content="$t('space.settings.public_apply.description')"
            placement="right"
          >
            <el-icon :size="20">
              <InfoFilled />
            </el-icon>
          </el-tooltip>
          <div>
            <span mr-8px text-tdisabled>{{ $t('space.settings.public_apply.status') }}：</span>
            <span text-tprimary>{{ formData.publicApply ? $t('space.settings.public_apply.on') : $t('space.settings.public_apply.off') }}</span>
          </div>
        </div>
      </el-form-item>

      <!-- 空间LOGO -->
      <el-form-item :label="$t('space.settings.domain.title')">
        <AvatarUploader
          v-model="formData.logo"
          :has-changed="logoChanged"
          :original-avatar="originalLogo"
          @cancel="handleCancelLogoUpload"
          @update:model-value="handleLogoUpdate"
        />
      </el-form-item>

      <!-- 空间名称 -->
      <el-form-item :label="$t('space.settings.domain.name')" prop="name">
        <el-input v-model="formData.name" :placeholder="$t('space.settings.name_placeholder')" />
      </el-form-item>

      <!-- 空间域名 -->
      <el-form-item :label="$t('space.settings.domain.domain')">
        <el-input v-model="formData.domain" disabled />
      </el-form-item>

      <!-- 空间描述 -->
      <el-form-item :label="$t('space.settings.space_description')" prop="description">
        <el-input
          v-model="formData.description"
          type="textarea"
          :rows="4"
          :placeholder="$t('space.settings.description_placeholder')"
        />
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
  padding: 20px;
}

.setting-form {
  :deep(.el-form-item__label) {
    font-size: 16px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    padding-bottom: 5px;
  }

  :deep(.el-form-item) {
    margin-bottom: 25px;
    padding-bottom: 25px;
    border-bottom: 1px solid var(--el-border-color-light);

    &:last-of-type {
      border-bottom: none;
      margin-bottom: 0;
    }
  }
}
</style>
