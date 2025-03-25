<script setup lang="ts">
import type { VChart } from '#components'
import { useResizeObserver } from '@vueuse/core'

const data = ref({
  readCount: 222,
  downloadCount: 111,
  uploadCount: 444,
  lastMonthUploadCount: 412,
})

// 新增文档同比上月（百分比，注意正负和精度，保留俩位小数）
const increasePercentage = computed(() => {
  if (!data.value.lastMonthUploadCount)
    return 0

  const percentage = ((data.value.uploadCount - data.value.lastMonthUploadCount) / data.value.lastMonthUploadCount) * 100
  return Number.parseFloat(percentage.toFixed(2))
})

const option = ref<ECOption>({
  xAxis: {
    type: 'category',
    data: ['12.1', '12.2', '12.3', '12.4', '12.5', '12.6', '12.7', '12.8', '12.9', '12.10', '12.11'],
    axisLine: {
      show: true,
      lineStyle: {
        color: '#E5E6E8',
      },
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      color: '#86909C',
    },
  },
  yAxis: {
    type: 'value',
    max: 20,
    interval: 5,
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    splitLine: {
      lineStyle: {
        type: 'dashed',
        color: '#E5E6E8',
      },
    },
    axisLabel: {
      color: '#86909C',
    },
  },
  series: [{
    data: [13, 19, 16, 12, 18, 20, 16, 17, 13, 16, 18],
    type: 'bar',
    barWidth: '10px',
    itemStyle: {
      color: '#660874',
      borderRadius: [4, 4, 0, 0],
    },
  }],
  grid: {
    left: '0%',
    right: '0%',
    bottom: '0%',
    top: '5%',
    containLabel: true,
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
})

// 图表实例
const chartRef = ref<InstanceType<typeof VChart>>()
const chartContainer = ref<HTMLElement>()

// 客户端专用代码
onMounted(() => {
  // 确保只在客户端执行
  if (import.meta.client) {
    // 使用ResizeObserver监听容器大小变化
    useResizeObserver(chartContainer, () => {
      // 获取图表实例并调用resize方法
      nextTick(() => {
        if (chartRef.value) {
          chartRef.value.resize()
        }
      })
    })
  }
})
</script>

<template>
  <div class="dashboard-container bg-[#f7f7f7] dark:bg-black" flex flex-col relative>
    <h1 text="20px tprimary" line-height="28px">
      知识雷达
    </h1>
    <p mt-2px text="14px" line-height="20px" style="color: #86909C;">
      2024-12
    </p>
    <el-dropdown class="outline-none right-25px top-33px !absolute">
      <div dark:bg-overlay pl-12px pr-10px rounded-6px bg-white flex h-36px w-150px shadow-gray items-center justify-between>
        <div rounded-2px bg-primary h-12px w-12px />
        <div ml-8px mr-auto text="14px" line-height="20px" style="color: #86909C;">
          个人上传
        </div>
        <div ml-8px flex-center h-16px w-16px>
          <SvgoArrowBottomFilled text-6px />
        </div>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>团队上传</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <div mb-25px mt-17px flex h-45px items-center justify-between>
      <div>
        <div flex gap-6px items-center :class="increasePercentage > 0 ? 'text-primary' : 'text-green-500'">
          <SvgoArrowRightFilled v-if="increasePercentage > 0" text-10px rotate--90 />
          <SvgoArrowRightFilled v-else text-10px rotate-90 />
          <span text-20px line-height="20px">{{ Math.abs(increasePercentage) }}%</span>
        </div>
        <div mt-6px line-height="17px" style="color: #86909C;">
          新增文档对比上月
        </div>
      </div>
      <ul mr-48px flex gap-70px>
        <li class="statistic-item">
          <span class="statistic-item-number">{{ data.readCount }}</span>
          <span class="statistic-item-text">已阅读</span>
        </li>
        <li class="statistic-item">
          <span class="statistic-item-number">{{ data.downloadCount }}</span>
          <span class="statistic-item-text">已下载</span>
        </li>
        <li class="statistic-item">
          <span class="statistic-item-number">{{ data.uploadCount }}</span>
          <span class="statistic-item-text">共上传</span>
        </li>
      </ul>
    </div>
    <div ref="chartContainer" class="flex-1 w-full">
      <VChart ref="chartRef" class="h-full w-full" :option="option" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-container {
  margin: 26px auto 16px;
  width: 65%;
  height: 416px;
  border-radius: 6px;
  box-shadow: 0px 25px 50px rgba(0, 0, 0, 0.06);
  padding: 25px;
}

.statistic-item {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 6px;

  &-number {
    font-size: 20px;
    line-height: 24px;
    color: var(--el-text-color-primary);
  }

  &-text {
    font-size: 13px;
    line-height: 17px;
    color: #86909c;
  }
}
</style>
