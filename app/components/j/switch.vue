<script setup lang="ts">
import _ from 'lodash'

// 定义列项的接口
interface ColumnItem {
  label: string
  [key: string]: any
}

// 定义组件的props
interface Props {
  columns: ColumnItem[]
  activeIndex?: number
  /** switch_item的固定宽度，不传则自适应各自的宽度 */
  itemWidth?: number
}

const props = withDefaults(defineProps<Props>(), {
  activeIndex: 0,
})

// 定义emit事件
const emit = defineEmits<{
  (e: 'change', item: ColumnItem): void
  (e: 'update:activeIndex', index: number): void
}>()

const PADDING = 2

// 组件内部状态
const sliderWidth = ref(0)
const sliderLeft = ref(0)
const switchItemRefs = ref<{ [key: string]: HTMLElement[] }>({})

// 点击切换处理函数
function handleClick(e: MouseEvent, item: ColumnItem, index: number) {
  const target = e.target as HTMLElement
  sliderWidth.value = target.offsetWidth
  sliderLeft.value = target.offsetLeft + PADDING
  emit('change', item)
  emit('update:activeIndex', index)
}

// 计算滑块位置和宽度
async function render() {
  await nextTick()
  const refKey = `switchItem${props.activeIndex}`
  if (switchItemRefs.value[refKey]?.[0]) {
    const { offsetWidth, offsetLeft } = switchItemRefs.value[refKey][0]
    sliderWidth.value = offsetWidth
    sliderLeft.value = offsetLeft + PADDING
  }
}

// 监听activeIndex变化重新计算滑块位置
watch(() => props.activeIndex, () => {
  render()
})

// 组件挂载后初始化
onMounted(() => {
  render()
  window.onresize = _.debounce(() => {
    render()
  }, 500)
})

// 组件卸载后移除监听
onUnmounted(() => {
  window.onresize = null
})
</script>

<template>
  <div class="j-switch">
    <span
      class="slider"
      :style="{ left: `${sliderLeft}px`, width: `${sliderWidth}px` }"
    />
    <div class="switch_items_wrapper">
      <span
        v-for="(item, index) in columns"
        :key="index"
        :ref="el => {
          if (el) switchItemRefs[`switchItem${index}`] = [el as HTMLElement]
        }"
        class="switch_item"
        :style="{ width: itemWidth ? `${itemWidth}px` : 'auto' }"
        @click="handleClick($event, item, index)"
      >
        {{ item.label }}
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.j-switch {
  flex-shrink: 0;
  display: inline-block;
  width: fit-content;
  position: relative;
  background-color: #e9edf7;
  border-radius: 4px;
  padding: v-bind('`${PADDING}px`');
  .slider {
    position: absolute;
    top: v-bind('`${PADDING}px`');
    left: v-bind('`${PADDING}px`');
    height: v-bind('`calc(100% - ${PADDING * 2}px)`');
    background-color: #fff;
    border-radius: 4px;
    z-index: 99;
    transition: all ease 0.2s;
  }
  .switch_items_wrapper {
    position: relative;
    z-index: 999;
    height: 100%;
    .switch_item {
      cursor: pointer;
      font-size: 12px;
      color: var(--el-text-color-primary);
      padding: 0 8px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      height: 100%;
      vertical-align: middle;
      position: relative;
      overflow: hidden;
      white-space: nowrap;
    }
  }
}
</style>
