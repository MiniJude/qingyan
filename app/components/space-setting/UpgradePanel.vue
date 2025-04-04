<script setup lang="ts">
import UpgradePlans from './UpgradePlans.vue'

const { t } = useI18n()

// 控制升级套餐弹框的显示
const showUpgradeDialog = ref(false)
// 当前升级类型：storage, ai, quality
const currentUpgradeType = ref('storage')

// 空间信息
const spaceInfo = reactive({
  currentVersion: t('space.upgrade.basic_version'),
  validPeriod: t('space.upgrade.long_term'),
  storageUsed: '1.1 M',
  storageTotal: '2.0 G',
  storageRemaining: '99.9%',
  aiQuotaUsed: 1,
  aiQuotaTotal: 200,
  aiQuotaRemaining: '99.5%',
  qualityQuotaUsed: 0,
  qualityQuotaTotal: 20,
  qualityQuotaRemaining: '100.0%',
})

// 计算存储空间使用百分比
const storagePercentage = computed(() => {
  return 0.5 // 实际上应该根据使用量计算，这里为了示例简化
})

// 计算AI问答使用百分比
const aiQuotaPercentage = computed(() => {
  return (spaceInfo.aiQuotaUsed / spaceInfo.aiQuotaTotal) * 100
})

// 计算代码质量评估使用百分比
const qualityQuotaPercentage = computed(() => {
  return (spaceInfo.qualityQuotaUsed / spaceInfo.qualityQuotaTotal) * 100
})

// 打开升级套餐弹框
function openUpgradeDialog(type: string) {
  currentUpgradeType.value = type
  showUpgradeDialog.value = true
}

// 处理升级操作
function handleUpgrade(data: { plan: { title: string }, type: string }) {
  // 根据不同类型和选择的套餐执行相应的升级操作
  ElMessage.success(`已选择${data.plan.title}套餐，即将为您开通服务`)
}
</script>

<template>
  <div class="panel-container" flex flex-col p-20px>
    <!-- 当前版本信息 -->
    <div class="mb-20px">
      <div class="flex items-center justify-between">
        <div>{{ $t('space.upgrade.current_version') }}：{{ spaceInfo.currentVersion }}</div>
        <div class="text-gray-500">
          {{ $t('space.upgrade.valid_period') }}：{{ spaceInfo.validPeriod }}
        </div>
      </div>
    </div>

    <el-divider class="!my-20px" />

    <!-- 存储空间使用情况 -->
    <div class="section-title">
      <span>{{ $t('space.upgrade.storage_capacity') }}</span>
    </div>
    <div class="section-content">
      <div class="section-content-left">
        <div class="mb-12px flex items-center justify-between">
          <span>{{ $t('space.upgrade.total_capacity') }} {{ spaceInfo.storageTotal }}，{{ $t('space.upgrade.used') }} {{ spaceInfo.storageUsed }}</span>
          <span class="text-primary">{{ $t('space.upgrade.remaining') }} {{ spaceInfo.storageRemaining }}</span>
        </div>
        <el-progress
          :percentage="storagePercentage"
          :show-text="false"
        />
      </div>
      <div class="buy-btn i-twemoji:money-bag" @click="openUpgradeDialog('storage')" />
    </div>

    <el-divider class="!my-20px" />

    <!-- AI问答次数使用情况 -->
    <div class="section-title">
      <span>{{ $t('space.upgrade.ai_query_capacity') }}</span>
    </div>
    <div class="section-content">
      <div class="section-content-left">
        <div class="mb-12px flex items-center justify-between">
          <span>{{ $t('space.upgrade.total_capacity') }} {{ spaceInfo.aiQuotaTotal }} {{ $t('space.upgrade.times') }}，{{ $t('space.upgrade.used') }} {{ spaceInfo.aiQuotaUsed }} {{ $t('space.upgrade.times') }}</span>
          <span class="text-primary">{{ $t('space.upgrade.remaining') }} {{ spaceInfo.aiQuotaRemaining }}</span>
        </div>
        <el-progress
          :percentage="aiQuotaPercentage"
          :show-text="false"
        />
      </div>
      <div class="buy-btn i-twemoji:money-bag" @click="openUpgradeDialog('ai')" />
    </div>

    <el-divider class="!my-20px" />

    <!-- 代码质量评估次数使用情况 -->
    <div class="section-title">
      <span>{{ $t('space.upgrade.code_quality_capacity') }}</span>
    </div>
    <div class="section-content">
      <div class="section-content-left">
        <div class="mb-12px flex items-center justify-between">
          <span>{{ $t('space.upgrade.total_capacity') }} {{ spaceInfo.qualityQuotaTotal }} {{ $t('space.upgrade.times') }}，{{ $t('space.upgrade.used') }} {{ spaceInfo.qualityQuotaUsed }} {{ $t('space.upgrade.times') }}</span>
          <span class="text-primary">{{ $t('space.upgrade.remaining') }} {{ spaceInfo.qualityQuotaRemaining }}</span>
        </div>
        <el-progress
          :percentage="qualityQuotaPercentage"
          :show-text="false"
        />
      </div>
      <div class="buy-btn i-twemoji:money-bag" @click="openUpgradeDialog('quality')" />
    </div>

    <!-- 升级套餐弹框 -->
    <UpgradePlans
      v-model:visible="showUpgradeDialog"
      :upgrade-type="currentUpgradeType"
      @upgrade="handleUpgrade"
    />
  </div>
</template>

<style lang="scss" scoped>
.panel-container {
  .section-title {
    font-size: 16px;
    font-weight: bold;
    color: var(--el-text-color-primary);
    margin-bottom: 12px;
  }

  .section-content {
    flex: 1;
    min-width: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 80px;

    .section-content-left {
      flex: 1;
      min-width: 0;
    }

    .buy-btn {
      font-size: 24px;
      cursor: pointer;

      &:hover {
        animation: shake 1s ease-in-out;
      }
    }
  }
}
</style>
