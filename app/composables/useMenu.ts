import Ai2Icon from '@/assets/svg/ai2.svg?component'
import BookIcon from '@/assets/svg/book.svg?component'
import { HOME_ROUTE } from '~/constants'
import { useSpaceStore } from '~/stores/space'

export function useMenu() {
  const route = useRoute()
  const { t } = useI18n()
  const localePath = useLocalePath()
  const spaceStore = useSpaceStore()

  // 创建图标引用
  const knowledgeIcon = shallowRef(BookIcon)
  const aiIcon = shallowRef(Ai2Icon)

  // 定义菜单结构
  const menu = ref([
    {
      key: 'knowledge_base',
      path: '/knowledge-base',
      iconUrl: knowledgeIcon,
    },
    {
      key: 'ai_assistant',
      path: '/agents',
      iconUrl: aiIcon,
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
