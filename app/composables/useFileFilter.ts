import { FileFilterType } from '@/constants'
import { useSpaceStore } from '@/stores/space'
import { useI18n } from 'vue-i18n'

/**
 * 文件过滤Hook，管理文件过滤类型和相关UI状态
 * @returns {object} 包含文件过滤相关的状态和计算属性
 */
export function useFileFilter() {
  const { t } = useI18n()
  const spaceStore = useSpaceStore()

  // 是否是团队空间
  const isTeamSpace = computed(() => spaceStore.currentSpace?.type === 'team')

  // 当前选中的文件筛选类型，初始化时根据当前空间类型决定
  const currentFileFilterType = ref(isTeamSpace.value ? FileFilterType.TEAM : FileFilterType.PERSONAL)

  // 监听空间类型变化，更新当前筛选类型
  watch(() => isTeamSpace.value, (newIsTeam) => {
    // 只在个人/团队类型之间切换，共享类型不自动切换
    if (currentFileFilterType.value === FileFilterType.PERSONAL && newIsTeam) {
      currentFileFilterType.value = FileFilterType.TEAM
    }
    else if (currentFileFilterType.value === FileFilterType.TEAM && !newIsTeam) {
      currentFileFilterType.value = FileFilterType.PERSONAL
    }
  })

  // 计算当前显示的提示文本
  const viewingText = computed(() => {
    if (currentFileFilterType.value === FileFilterType.PERSONAL) {
      return t('knowledge_base.index.viewing_personal_files')
    }
    else if (currentFileFilterType.value === FileFilterType.TEAM) {
      return t('knowledge_base.index.viewing_team_files')
    }
    else {
      return t('knowledge_base.index.viewing_shared_files')
    }
  })

  // 计算Switch组件的列配置
  const switchColumns = computed(() => [
    {
      label: isTeamSpace.value
        ? t('knowledge_base.index.my_team')
        : t('knowledge_base.index.my_personal'),
      value: isTeamSpace.value ? FileFilterType.TEAM : FileFilterType.PERSONAL,
    },
    {
      label: t('knowledge_base.index.shared_with_me'),
      value: FileFilterType.SHARED,
    },
  ])

  return {
    currentFileFilterType,
    viewingText,
    switchColumns,
    isTeamSpace,
  }
}
