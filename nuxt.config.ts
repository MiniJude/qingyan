import { APP_DESC } from './app/constants/index'

export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/color-mode',
    '@vite-pwa/nuxt',
    '@nuxt/eslint',
    '@element-plus/nuxt',
    'nuxt-svgo',
    'nuxt-echarts',
    '@nuxtjs/i18n',
  ],
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  devtools: {
    enabled: true,
  },

  app: {
    head: {
      viewport: 'width=device-width,initial-scale=1',
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', type: 'image/svg+xml', href: '/logo-icon.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],

      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: APP_DESC },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'theme-color', media: '(prefers-color-scheme: light)', content: 'white' },
        { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#222222' },
      ],
    },
  },

  // css
  css: [
    '@unocss/reset/tailwind.css',
    '~/assets/scss/index.scss',
    '~/assets/scss/theme-variables.scss',
  ],

  colorMode: {
    classSuffix: '',
  },

  runtimeConfig: {
    public: {
      apiBase: '',
    },
  },

  routeRules: {
    '/api/**': {
      proxy: 'https://www.writebug.com/api/v3/**',
    },
    '/mock-api/**': {
      cache: false,
      ssr: false,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    },
  },

  devServer: {
    port: 4000,
  },

  future: {
    compatibilityVersion: 4,
  },

  experimental: {
    // when using generate, payload js assets included in sw precache manifest
    // but missing on offline, disabling extraction it until fixed
    payloadExtraction: false,
    renderJsonPayloads: true,
    typedPages: true,
  },

  compatibilityDate: '2024-08-14',

  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
    prerender: {
      crawlLinks: false,
      routes: ['/'],
      ignore: ['/hi'],
    },
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          additionalData: `@use "@/assets/scss/element/index.scss" as element;`,
        },
      },
    },
    // server: {
    //   proxy: {
    //     '/api': {
    //       target: 'https://www.writebug.com',
    //       changeOrigin: true,
    //       rewrite: path => path.replace(/^\/api/, '/api/v3'),
    //     },
    //   },
    // },
  },

  echarts: {
    charts: ['BarChart'],
    components: ['DatasetComponent', 'GridComponent', 'TooltipComponent'],
  },
  elementPlus: {
    icon: 'ElIcon',
    importStyle: 'scss',
    themes: ['dark'], // 从@element-plus/nuxt/dist/element-plus/theme-chalk/src/dark/css-vars.scss导入组件库的暗黑模式样式
  },

  eslint: {
    config: {
      standalone: false,
      nuxt: {
        sortConfigKeys: true,
      },
    },
  },

  i18n: {
    locales: [
      {
        code: 'en',
        file: 'en.json',
      },
      {
        code: 'zh-CN',
        file: 'zh-CN.json',
      },
    ],
    lazy: true,
    defaultLocale: 'zh-CN',
    bundle: {
      optimizeTranslationDirective: false,
    },
  },

  piniaPluginPersistedstate: {
    storage: 'localStorage',
    debug: true,
    key: 'qingyan-%id',
  },

  svgo: {
    autoImportPath: './assets/svg/',
    // defaultImport: 'component',
  },
})
