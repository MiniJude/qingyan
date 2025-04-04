<script setup lang="ts">
interface Plan {
  type: string
  title: string
  price: string
  unit: string
  period: string
  validDays: number
  storageSize: string
  fee: string
  buttonText: string
  isRecommended: boolean
}

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  upgradeType: {
    type: String,
    default: 'storage', // storage, ai, quality
  },
})

const emit = defineEmits(['update:visible', 'upgrade'])
const { t } = useI18n()

// 关闭弹窗
function handleClose() {
  emit('update:visible', false)
}

// 获取对应的标题
function getDialogTitle() {
  if (props.upgradeType === 'storage') {
    return t('space.upgrade.plans_dialog.storage_title')
  }
  else if (props.upgradeType === 'ai') {
    return t('space.upgrade.plans_dialog.ai_title')
  }
  else {
    return t('space.upgrade.plans_dialog.quality_title')
  }
}

// 套餐列表
const plans = computed<Plan[]>(() => [
  {
    type: 'free',
    title: t('space.upgrade.plans_dialog.free_plan'),
    price: t('space.upgrade.plans_dialog.complete_task'),
    unit: '2G',
    period: t('common.time.year'),
    validDays: 365,
    storageSize: '2G',
    fee: t('space.upgrade.plans_dialog.get_reward'),
    buttonText: t('space.upgrade.plans_dialog.go_to_task'),
    isRecommended: false,
  },
  {
    type: 'standard',
    title: t('space.upgrade.plans_dialog.standard_plan'),
    price: '45元',
    unit: '10G',
    period: t('common.time.month'),
    validDays: 30,
    storageSize: '10G',
    fee: '45元',
    buttonText: t('space.upgrade.plans_dialog.upgrade'),
    isRecommended: true,
  },
  {
    type: 'premium',
    title: t('space.upgrade.plans_dialog.premium_plan'),
    price: '60元',
    unit: t('space.upgrade.plans_dialog.unlimited'),
    period: t('common.time.month'),
    validDays: 30,
    storageSize: t('space.upgrade.plans_dialog.unlimited'),
    fee: '60元',
    buttonText: t('space.upgrade.plans_dialog.upgrade'),
    isRecommended: false,
  },
])

// 处理升级
function handleUpgrade(plan: Plan) {
  emit('upgrade', { plan, type: props.upgradeType })
  handleClose()
}
</script>

<template>
  <el-dialog
    :model-value="visible"
    :title="getDialogTitle()"
    width="1000px"
    align-center
    :append-to-body="true"
    :close-on-click-modal="false"
    @update:model-value="val => emit('update:visible', val)"
    @close="handleClose"
  >
    <div class="plan-container">
      <div
        v-for="plan in plans"
        :key="plan.type"
        class="plan-card"
        :class="{ 'is-recommended': plan.isRecommended }"
      >
        <div class="plan-title">
          {{ plan.title }}
        </div>
        <div class="plan-price">
          <span class="price">{{ plan.price }}</span>
          <span class="unit"> / {{ plan.unit }} / {{ plan.period }}</span>
        </div>
        <div class="plan-info">
          <div class="info-item">
            <span class="label">{{ t('space.upgrade.plans_dialog.valid_period') }}：</span>
            <span class="value">{{ plan.validDays }}{{ t('space.upgrade.plans_dialog.day') }}</span>
          </div>
          <div class="info-item">
            <span class="label">{{ t('space.upgrade.plans_dialog.storage_size') }}：</span>
            <span class="value">{{ plan.storageSize }}</span>
          </div>
          <div class="info-item">
            <span class="label">{{ t('space.upgrade.plans_dialog.fee') }}：</span>
            <span class="value">{{ plan.fee }}</span>
          </div>
        </div>
        <el-button
          type="primary"
          class="plan-button"
          :class="{ 'task-button': plan.type === 'free' }"
          @click="handleUpgrade(plan)"
        >
          {{ plan.buttonText }}
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
.plan-container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 0 10px;
}

.plan-card {
  flex: 1;
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-5px);
  }

  &.is-recommended {
    border-color: var(--el-color-primary);
    box-shadow: 0 0 10px rgba(var(--el-color-primary-rgb), 0.3);
  }
}

.plan-title {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 15px;
  color: var(--el-text-color-primary);
}

.plan-price {
  text-align: center;
  margin-bottom: 20px;

  .price {
    font-size: 20px;
    font-weight: bold;
    color: var(--el-color-primary);
  }

  .unit {
    font-size: 14px;
    color: var(--el-text-color-secondary);
  }
}

.plan-info {
  flex: 1;
  margin-bottom: 20px;

  .info-item {
    display: flex;
    margin-bottom: 10px;
    color: var(--el-text-color-secondary);
    font-size: 14px;

    .label {
      width: 100px;
    }

    .value {
      flex: 1;
    }
  }
}

.plan-button {
  width: 100%;
}

.task-button {
  background-color: #7367f0;
  border-color: #7367f0;

  &:hover,
  &:focus {
    background-color: #6254e8;
    border-color: #6254e8;
  }
}
</style>
