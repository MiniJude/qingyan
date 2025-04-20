<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

// 开关状态
const allowInviteLink = ref(false)
const allowCreateTeam = ref(true)

// 使用useI18n但不需要显式引用t变量
useI18n()
</script>

<template>
  <div class="space-permission-panel">
    <!-- 管理员权限 -->
    <div class="role-card">
      <div class="role-title">
        {{ $t('space.permission.admin.title') }}
      </div>
      <div class="role-description">
        {{ $t('space.permission.admin.description') }}
      </div>
    </div>

    <!-- 成员权限 -->
    <div class="role-card">
      <div class="role-title">
        {{ $t('space.permission.member.title') }}
      </div>
      <div class="role-description">
        {{ $t('space.permission.member.description') }}
      </div>

      <div class="option-content">
        <div class="option-text">
          {{ $t('space.permission.options.invite_link') }}
        </div>
        <el-switch v-model="allowInviteLink" />
      </div>

      <div class="option-content">
        <div class="option-text">
          {{ $t('space.permission.options.create_team') }}
        </div>
        <el-switch v-model="allowCreateTeam" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.space-permission-panel {
  padding: 20px;
}

.role-card {
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 8px;
  background-color: var(--el-fill-color-light);
}

.role-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
  color: var(--el-text-color-primary);
}

.role-description {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  line-height: 1.5;
}

.permission-option {
  margin-top: 20px;
  padding: 16px;
  border-radius: 8px;
  background-color: var(--el-fill-color-light);
}

.option-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}

.option-text {
  font-size: 14px;
  color: var(--el-text-color-primary);
}
</style>
