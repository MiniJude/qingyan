<script setup lang="ts">
import { ElColorPicker } from 'element-plus'

const { t } = useI18n()
const { colors, themeDrawerVisible, setColor, resetColors, closeThemeDrawer } = useTheme()

type ColorKey = keyof typeof colors.value

// 颜色分组
const colorGroups = [
  {
    title: '主调色板',
    items: [
      { label: '强调的功能操作', desc: '确定按钮', key: 'primaryColor' as ColorKey, value: '#660874' },
      { label: '悬浮色', desc: '', key: 'primaryHoverColor' as ColorKey, value: '#8D7697' },
      { label: '导航栏底色', desc: '看板底色', key: 'navBarBgColor' as ColorKey, value: '#EDEFF3' },
      { label: '切换按钮色', desc: '目录选中色白底悬浮色', key: 'bgCutColor' as ColorKey, value: '#E9EDF7' },
      { label: '主页背景底色', desc: '', key: 'bgMainWhite' as ColorKey, value: '#FFFFFF' },
    ],
  },
  {
    title: '字体调色板',
    items: [
      { label: '强调文字', desc: '正文标题', key: 'textEmphasis' as ColorKey, value: '#1D2129' },
      { label: '次强调文字', desc: '', key: 'textSubEmphasis' as ColorKey, value: '#4E5969' },
      { label: '置灰信息', desc: '', key: 'textSecondary' as ColorKey, value: '#C9CDD4' },
      { label: '深底文字', desc: '', key: 'textLight' as ColorKey, value: '#FFFFFF' },
    ],
  },
  {
    title: '边框/分割线调色板',
    items: [
      { label: '常规/浅色', desc: '', key: 'borderRegular' as ColorKey, value: '#C9CDD4' },
    ],
  },
  {
    title: '滚动条调色板',
    items: [
      { label: '点击', desc: '', key: 'scrollThumb' as ColorKey, value: '#999DA3' },
      { label: '常规', desc: '', key: 'scrollRegular' as ColorKey, value: '#C9CDD4' },
    ],
  },
]

// 修改颜色
function handleColorChange(color: string | null, key: ColorKey) {
  if (color) {
    setColor(key, color)
  }
}
</script>

<template>
  <el-drawer
    v-model="themeDrawerVisible"
    :title="t('theme.title')"
    direction="rtl"
    size="500px"
    :before-close="closeThemeDrawer"
  >
    <div class="theme-drawer-content" p="x-20px">
      <div v-for="group in colorGroups" :key="group.title" class="theme-section" mb-30px>
        <div mb-15px text-18px font-bold>
          {{ group.title }}
        </div>
        <div v-for="item in group.items" :key="item.key" mb-20px>
          <div class="color-item-header" mb-5px>
            <span>{{ item.label }}</span>
            <span v-if="item.desc" class="color-item-desc">{{ item.desc }}</span>
          </div>
          <div class="color-item-content">
            <ElColorPicker
              v-model="colors[item.key]"
              show-alpha
              color-format="hex"
              popper-class="theme-color-picker"
              @change="(val) => handleColorChange(val, item.key)"
            />
            <div class="color-preview" :style="{ backgroundColor: colors[item.key] }">
              <div class="color-value">
                {{ colors[item.key] }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <el-button type="primary" class="reset-btn" @click="resetColors">
        {{ t('theme.reset') }}
      </el-button>
    </div>
  </el-drawer>
</template>

<style lang="scss" scoped>
.theme-drawer-content {
  .theme-section {
    margin-bottom: 25px;
  }

  .color-item-header {
    display: flex;
    align-items: center;

    .color-item-desc {
      margin-left: 8px;
      font-size: 12px;
      color: var(--app-text-sub-emphasis, #4e5969);
    }
  }

  .color-item-content {
    display: flex;
    align-items: center;
  }

  .color-preview {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 200px;
    height: 32px;
    border-radius: 4px;
    margin-left: 15px;
    position: relative;
    border: 1px solid var(--el-border-color);

    .color-value {
      font-size: 12px;
      color: white;
      text-shadow: 0 0 1px rgba(0, 0, 0, 0.7);
    }
  }

  .reset-btn {
    margin-top: 20px;
  }
}
</style>

<style>
/* 确保颜色选择器面板正确显示 */
.theme-color-picker .el-color-dropdown__main-wrapper {
  display: flex !important;
}
.theme-color-picker .el-color-dropdown__btns {
  margin-top: 8px;
  text-align: right;
}
</style>
