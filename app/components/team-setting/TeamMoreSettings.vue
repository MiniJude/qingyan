<script setup lang="ts">
import { ElMessage } from 'element-plus'

const { appContext } = getCurrentInstance()!
const { t } = useI18n()

// 功能开关
const activityEnabled = ref(true)
const topicEnabled = ref(true)

// 删除团队
function handleDeleteTeam() {
  ElMessage.warning(t('common.coming_soon.title'), appContext)
}
</script>

<template>
  <div class="more-settings-panel">
    <h3 class="mb-16px text-18px font-medium">
      {{ t('space.team.more_settings') }}
    </h3>
    <p class="mb-20px text-sm text-gray-500">
      {{ t('space.team.more_settings_description') }}
    </p>

    <!-- 动态 -->
    <div class="mb-24px border-b border-gray-200 pb-20px">
      <div class="mb-12px flex items-center justify-between">
        <div class="flex-1">
          <div class="text-16px font-medium">
            {{ t('space.team.activity') }}
          </div>
          <div class="text-sm text-gray-500">
            {{ t('space.team.activity_description') }}
          </div>
        </div>
        <el-switch v-model="activityEnabled" />
      </div>
    </div>

    <!-- 话题知识库 -->
    <div class="mb-24px border-b border-gray-200 pb-20px">
      <div class="mb-12px flex items-center justify-between">
        <div class="flex-1">
          <div class="text-16px font-medium">
            {{ t('space.team.topic') }}
          </div>
          <div class="text-sm text-gray-500">
            {{ t('space.team.topic_description') }}
          </div>
        </div>
        <el-switch v-model="topicEnabled" />
      </div>
    </div>

    <!-- 删除团队 -->
    <div class="delete-team mt-40px">
      <div class="mb-12px">
        <div class="text-16px text-danger font-medium">
          {{ t('space.team.delete_team_title') }}
        </div>
        <div class="text-sm text-gray-500">
          {{ t('space.team.delete_team_description') }}
        </div>
      </div>
      <el-button type="danger" @click="handleDeleteTeam">
        {{ t('space.team.delete_team') }}
      </el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.text-danger {
  color: var(--el-color-danger);
}
</style>
