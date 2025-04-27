import { SvgoAiChat, SvgoFolder2 } from '#components'
import { HOME_ROUTE } from '~/constants'
import { useSpaceStore } from '~/stores/space'

export function useMenu() {
  const route = useRoute()
  const { t } = useI18n()
  const localePath = useLocalePath()
  const spaceStore = useSpaceStore()

  // 定义菜单结构
  const menu = ref([
    {
      key: 'knowledge_base',
      path: '/knowledge-base',
      iconUrl: SvgoFolder2,
    },
    {
      key: 'ai_assistant',
      path: '/agents',
      iconUrl: SvgoAiChat,
    },
    {
      key: 'ai_doc',
      path: '/doc',
      iconUrl: h('div', {
        class: 'i-carbon:align-box-bottom-center',
      }),
    },
  ])

  // 带翻译的菜单
  const localizedMenu = computed(() =>
    menu.value.map(item => ({
      ...item,
      name: t(`sidebar.${item.key}`),
    })),
  )

  const currentMenu = computed(() => {
    return localizedMenu.value.find(item => route.path.includes(item.path))
  })

  // 返回首页
  const goHome = () => {
    const spaceId = spaceStore.currentSpace?.id
    navigateTo(localePath(`/group/${spaceId}${HOME_ROUTE}` as I18nRoutePath))
  }

  return {
    menu: localizedMenu,
    currentMenu,
    goHome,
  }
}
