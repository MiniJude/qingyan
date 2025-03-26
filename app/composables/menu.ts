import Ai2Icon from '@/assets/svg/ai2.svg?component'
import BookIcon from '@/assets/svg/book.svg?component'

export function useMenu() {
  const route = useRoute()

  const menu = ref([
    {
      name: '知识库',
      path: '/knowledge-base',
      iconUrl: BookIcon,
    },
    {
      name: 'AI助手',
      path: '/agents',
      iconUrl: Ai2Icon,
    },
  ])

  const currentMenu = computed(() => {
    return menu.value.find(menu => route.path.includes(menu.path))
  })

  return {
    menu,
    currentMenu,
  }
}
