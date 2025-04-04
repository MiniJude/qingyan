<script setup lang="ts">
const { t } = useI18n()

// 空间信息
const spaceInfo = reactive({
  currentVersion: '基础版',
  storageUsed: '1.1',
  storageTotal: '2.0',
  aiQuotaUsed: 1,
  aiQuotaTotal: 200,
  qualityQuotaUsed: 0,
  qualityQuotaTotal: 20,
})

// 计算存储空间使用百分比
const storagePercentage = computed(() => {
  return ((Number(spaceInfo.storageUsed) / Number(spaceInfo.storageTotal)) * 100).toFixed(1)
})

// 计算AI问答使用百分比
const aiQuotaPercentage = computed(() => {
  return ((spaceInfo.aiQuotaUsed / spaceInfo.aiQuotaTotal) * 100).toFixed(1)
})

// 计算代码质量评估使用百分比
const qualityQuotaPercentage = computed(() => {
  return ((spaceInfo.qualityQuotaUsed / spaceInfo.qualityQuotaTotal) * 100).toFixed(1)
})
</script>

<template>
  <div class="space-upgrade-panel">
    <!-- 头部标题和描述 -->
    <div class="mb-20px p-20px">
      <h2 class="mb-10px text-24px font-bold">
        {{ $t('space.upgrade.title') }}
      </h2>
      <p class="text-gray-500">
        {{ $t('space.upgrade.description') }}
      </p>
    </div>

    <!-- 当前版本信息 -->
    <div class="mb-20px p-20px">
      <div class="mb-10px text-16px font-bold">
        {{ $t('space.upgrade.current_version') }}：{{ spaceInfo.currentVersion }}
      </div>

      <!-- 存储空间使用情况 -->
      <div class="mb-15px">
        <div class="mb-5px flex items-center justify-between">
          <span>{{ $t('space.upgrade.storage_usage') }}</span>
          <span>{{ spaceInfo.storageUsed }} / {{ spaceInfo.storageTotal }} GB</span>
        </div>
        <el-progress
          :percentage="Number(storagePercentage)"
          :format="() => `${storagePercentage}%`"
        />
      </div>

      <!-- AI问答次数使用情况 -->
      <div class="mb-15px">
        <div class="mb-5px flex items-center justify-between">
          <span>{{ $t('space.upgrade.ai_quota_usage') }}</span>
          <span>{{ spaceInfo.aiQuotaUsed }} / {{ spaceInfo.aiQuotaTotal }}</span>
        </div>
        <el-progress
          :percentage="Number(aiQuotaPercentage)"
          :format="() => `${aiQuotaPercentage}%`"
        />
      </div>

      <!-- 代码质量评估次数使用情况 -->
      <div class="mb-15px">
        <div class="mb-5px flex items-center justify-between">
          <span>{{ $t('space.upgrade.quality_quota_usage') }}</span>
          <span>{{ spaceInfo.qualityQuotaUsed }} / {{ spaceInfo.qualityQuotaTotal }}</span>
        </div>
        <el-progress
          :percentage="Number(qualityQuotaPercentage)"
          :format="() => `${qualityQuotaPercentage}%`"
        />
      </div>
    </div>

    <!-- 升级按钮 -->
    <div class="flex justify-center p-20px">
      <el-button type="primary" size="large">
        {{ $t('space.upgrade.upgrade_button') }}
      </el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.space-upgrade-panel {
  :deep(.el-progress-bar__inner) {
    background-color: var(--el-color-primary);
  }
}
</style>
