import { createLocalFontProcessor } from '@unocss/preset-web-fonts/local'
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetWebFonts,
  presetWind3,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    ['btn', 'px-4 py-1 rounded inline-block bg-teal-600 text-white cursor-pointer hover:bg-teal-700 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'],
    ['icon-btn', 'inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-teal-600'],
    ['flex-center', 'flex items-center justify-center'],
    ['menu-btn', 'cursor-pointer rounded-4px p-16px px-20px text-tprimary transition-all duration-300'],
    ['menu-btn-active', 'text-white !bg-[var(--el-color-primary)]'],
    ['menu-btn-hover', 'hover:bg-[var(--el-color-primary-light-3)] !text-white'],
  ],
  presets: [
    presetWind3(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        sans: {
          name: 'System Font',
          provider: 'none',
        },
        serif: {
          name: 'System Serif',
          provider: 'none',
        },
        mono: {
          name: 'System Mono',
          provider: 'none',
        },
      },
      processors: createLocalFontProcessor(),
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  theme: {
    colors: {
      primary: 'var(--el-color-primary)',
      success: 'var(--el-color-success)',
      warning: 'var(--el-color-warning)',
      danger: 'var(--el-color-danger)',
      error: 'var(--el-color-error)',
      info: 'var(--el-color-info)',

      // 文字颜色
      tprimary: 'var(--el-text-color-primary)',
      tregular: 'var(--el-text-color-regular)',
      tsecondary: 'var(--el-text-color-secondary)',
      tplaceholder: 'var(--el-text-color-placeholder)',
      tdisabled: 'var(--el-text-color-disabled)',

      overlay: 'var(--el-bg-color-overlay)',
    },
  },
})
