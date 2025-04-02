<script setup lang="ts">
import { CircleCloseFilled } from '@element-plus/icons-vue'
import { computed, defineEmits, defineProps, ref } from 'vue'

// 定义组件的props
interface Props {
  steps: FlowStepItem[]
  modelValue: boolean
}

const props = defineProps<Props>()

// 发射事件
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'showRegisterDialog'): void
  // 添加这一行，用于转发任意事件
  (e: string, ...args: any[]): void
}>()

const modelValue = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})

const currentStep = ref(0)

// 动画方向
const animationDirection = ref('right') // 'right' 或 'left'

const currentStepComponent = computed(() => props.steps[currentStep.value]?.component)
const currentStepComponentRef = ref<ComponentPublicInstance & { submit: () => void }>()

// 前往上一步
function toPrevStep() {
  if (currentStep.value > 0) {
    animationDirection.value = 'left'
    currentStep.value--
  }
}

// 前往下一步
async function toNextStep() {
  await currentStepComponentRef.value?.submit()
  if (currentStep.value < props.steps.length - 1) {
    animationDirection.value = 'right'
    currentStep.value++
  }
}

// 关闭弹框
function closeDialog() {
  emit('update:modelValue', false)
}
</script>

<template>
  <transition name="el-zoom-in-top">
    <main v-show="modelValue" h-full flex-center>
      <div class="sys-layout bg-board dark:bg-black" relative m-auto h-850px w-1351px flex-center rounded-10px>
        <img src="@/assets/img/logo.png" alt="logo" absolute left-25px top-26px h-64px w-134px>
        <CircleCloseFilled color="primary" absolute right-35px top-38px h-40px w-40px cursor-pointer @click="closeDialog" />

        <div relative>
          <div class="dot" left--10px top-20px style="background: #6CB5EE;" />
          <div class="dot" bottom-20px right--10px style="background: #25DFE2;" />
          <div class="dot" bottom-55px right--10px style="background: #8F67E8;" />
          <div class="dot" bottom-90px right--10px style="background: #1A61FA;" />
          <div class="absolute left-[50%] z-2 translate-x-[-50%] rounded-[0_0_30px_30px]" text="14px white" h-35px w-172px flex-center style="background: #660874;">
            {{ steps[currentStep]?.title }}
          </div>

          <div class="sys-form-container" relative min-h-200px min-w-200px rounded-10px bg-white dark:bg-overlay>
            <!-- 步骤内容区域，使用Transition实现动画效果 -->
            <div class="steps-container">
              <transition :name="animationDirection === 'right' ? 'slide-left' : 'slide-right'">
                <component :is="currentStepComponent" ref="currentStepComponentRef" :key="currentStep" />
              </transition>
            </div>

            <!-- 步骤导航按钮 -->
            <div flex justify-center gap-4 py-8>
              <el-button v-if="currentStep > 0" size="large" @click="toPrevStep">
                {{ $t('common.actions.previous') }}
              </el-button>
              <el-button v-if="currentStep < props.steps.length - 1" type="primary" size="large" @click="toNextStep">
                {{ $t('common.actions.next') }}
              </el-button>
              <el-button v-if="currentStep === steps.length - 1" type="primary" size="large" @click="toNextStep">
                {{ $t('common.actions.confirm') }}
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </transition>
</template>

<style lang="scss" scoped>
.sys-layout {
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.16);
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
