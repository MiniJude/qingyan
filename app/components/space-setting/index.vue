<script setup lang="ts">
import { MenuSplitContent, SpaceMemberPanel, SpaceModelSettingPanel, SpacePermissionPanel, SpaceSettingPanel, SpaceTeamPanel, SpaceTrashPanel, SpaceUpgradePanel } from '#components'
import { useSpaceStore } from '~/stores/space'

const props = withDefaults(defineProps<Props>(), {
  activeTab: 'space-upgrade', // 默认是升级选项卡
})

const spaceStore = useSpaceStore()

interface Props {
  activeTab?: 'space-upgrade' | 'space-setting' | 'space-model' | 'space-member' | 'space-permission' | 'space-team' | 'space-trash'
}

const dialogVisible = defineModel<boolean>('modelValue')
const activeTabModel = defineModel<Props['activeTab']>('activeTab', {
  default: 'space-upgrade',
})

const { t } = useI18n()
const { isMobileDevice } = useDeviceDetection()

// 当前选中的左侧菜单，使用activeTabModel
const currentMenu = computed({
  get: () => activeTabModel.value || props.activeTab,
  set: (val) => {
    activeTabModel.value = val as Props['activeTab']
  },
})

// 所有可用的菜单项
const allMenuItems = [
  {
    key: 'space-upgrade',
    icon: 'i-carbon:upgrade',
    name: t('space.menu.upgrade'),
    component: shallowRef(SpaceUpgradePanel),
  },
  {
    key: 'space-setting',
    icon: 'i-carbon:settings',
    name: t('space.menu.settings'),
    component: shallowRef(SpaceSettingPanel),
  },
  {
    key: 'space-model',
    icon: 'i-carbon:machine-learning',
    name: t('space.menu.model'),
    description: t('space.menu.model_description'),
    component: shallowRef(SpaceModelSettingPanel),
  },
  {
    key: 'space-member',
    icon: 'i-carbon:group',
    name: t('space.menu.member'),
    component: shallowRef(SpaceMemberPanel),
  },
  {
    key: 'space-permission',
    icon: 'i-carbon:security',
    name: t('space.menu.permission'),
    component: shallowRef(SpacePermissionPanel),
  },
  {
    key: 'space-team',
    icon: 'i-carbon:partnership',
    name: t('space.menu.team'),
    component: shallowRef(SpaceTeamPanel),
  },
  {
    key: 'space-trash',
    icon: 'i-carbon:trash-can',
    name: t('knowledge_base.trash'),
    component: shallowRef(SpaceTrashPanel),
  },
]

// 根据空间类型过滤菜单
const menuList = computed(() => {
  const isPersonalSpace = spaceStore.currentSpace?.type === 'personal'
  if (isPersonalSpace) {
    return [...allMenuItems.slice(0, 3), ...allMenuItems.slice(-1)]
  }
  // 团队空间显示所有菜单项
  return allMenuItems
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    width="1200"
    :title="$t('space.title')"
    :append-to-body="true"
    :close-on-click-modal="false"
    align-center
    :fullscreen="isMobileDevice"
  >
    <MenuSplitContent
      v-model="currentMenu"
      :menu-list="menuList"
      :content-height="isMobileDevice ? '100%' : '800px'"
      :show-menu="menuList.length > 1"
    />
  </el-dialog>
</template>

<style lang="scss" scoped>
:deep(.el-dialog__header) {
  margin-right: 0;
  padding: 20px;
  border-bottom: 1px solid var(--el-border-color);
}

:deep(.el-dialog__body) {
  padding: 0;
}
</style>
