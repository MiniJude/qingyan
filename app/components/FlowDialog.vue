<script setup lang="ts">
import { CircleCloseFilled } from '@element-plus/icons-vue'

// 定义组件的props
interface Props {
  steps: FlowStepItem[]
}

// 禁用属性继承
defineOptions({
  inheritAttrs: false,
})

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const dialogRef = ref()

const currentIndex = ref(0)

// 动画方向
const animationDirection = ref('right') // 'right' 或 'left'

const currentFlowStepItem = computed(() => props.steps[currentIndex.value])
const currentStepComponentRef = ref<ComponentPublicInstance & { submit: () => void }>()

// 前往上一步
function toPrevStep() {
  if (currentIndex.value > 0) {
    animationDirection.value = 'left'
    currentIndex.value--
  }
}

// 前往下一步
async function toNextStep() {
  await currentStepComponentRef.value?.submit()
  if (currentIndex.value < props.steps.length - 1) {
    animationDirection.value = 'right'
    currentIndex.value++
  }
}

// 关闭对话框
function handleClose() {
  emit('update:modelValue', false)
}

// 将dialogRef的方法暴露给父组件
defineExpose(new Proxy({}, {
  get(target, key) {
    return dialogRef.value?.[key]
  },
  has(target, key) {
    return key in dialogRef.value!
  },
}))
</script>

<template>
  <el-dialog
    ref="dialogRef"
    v-bind="$attrs"
    class="!bg-board !p-0 !dark:bg-black"
    destroy-on-close
    :show-close="false"
    align-center
    header-class="hidden"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div relative m-auto h-850px flex-center rounded-10px>
      <img src="@/assets/img/logo.png" alt="logo" absolute left-25px top-26px h-64px w-134px>
      <CircleCloseFilled color="primary" absolute right-35px top-38px h-40px w-40px cursor-pointer @click="handleClose" />

      <div relative>
        <div class="dot" left--10px top-20px style="background: #6CB5EE;" />
        <div class="dot" bottom-20px right--10px style="background: #25DFE2;" />
        <div class="dot" bottom-55px right--10px style="background: #8F67E8;" />
        <div class="dot" bottom-90px right--10px style="background: #1A61FA;" />
        <div class="absolute left-[50%] z-2 translate-x-[-50%] rounded-[0_0_30px_30px]" text="14px white" h-35px w-172px flex-center style="background: #660874;">
          {{ steps[currentIndex]?.title }}
        </div>

        <div class="sys-form-container" relative min-h-200px min-w-200px rounded-10px bg-white dark:bg-overlay>
          <!-- 步骤内容区域，使用Transition实现动画效果 -->
          <div class="steps-container">
            <transition :name="animationDirection === 'right' ? 'slide-left' : 'slide-right'">
              <component :is="currentFlowStepItem?.component" ref="currentStepComponentRef" :key="currentIndex" v-bind="currentFlowStepItem?.props" />
            </transition>
          </div>

          <!-- 步骤导航按钮 -->
          <div flex justify-center gap-4 py-8>
            <el-button v-if="currentIndex > 0" size="large" @click="toPrevStep">
              {{ $t('common.actions.previous') }}
            </el-button>
            <el-button v-if="currentIndex < props.steps.length - 1" type="primary" size="large" @click="toNextStep">
              {{ $t('common.actions.next') }}
            </el-button>
            <el-button v-if="currentIndex === steps.length - 1" type="primary" size="large" @click="toNextStep">
              {{ $t('common.actions.confirm') }}
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
:deep(.el-dialog) {
  border-radius: 10px;
  overflow: hidden;
}

:deep(.el-dialog__header) {
  margin: 0;
  padding: 0;
}

:deep(.el-dialog__body) {
  padding: 0;
}

.sys-form-container {
  border-radius: 10px;
  backdrop-filter: blur(84px);
  box-shadow:
    0px 3px 6px rgba(0, 0, 0, 0.16),
    inset 0px 3px 6px rgba(0, 0, 0, 0.16);
  z-index: 1;
}

.dot {
  width: 20px;
  height: 20px;
  position: absolute;
  background-color: #000;
  border-radius: 50%;
  z-index: 0;
}

.steps-container {
  position: relative;
  overflow: hidden;
  min-height: 200px;
}

/* 右侧进入动画 */
.slide-left-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease;
}

.slide-left-leave-active,
.slide-right-enter-active {
  transition: all 0.3s ease;
}

.slide-left-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

/* 左侧进入动画 */
.slide-right-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
