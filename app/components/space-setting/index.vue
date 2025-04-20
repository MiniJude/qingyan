<script setup lang="ts">
import { MenuSplitContent, SpaceMemberPanel, SpaceModelSettingPanel, SpacePermissionPanel, SpaceSettingPanel, SpaceTeamPanel, SpaceTrashPanel, SpaceUpgradePanel } from '#components'

const props = withDefaults(defineProps<Props>(), {
  activeTab: 'space-upgrade', // 默认是升级选项卡
})

const dialogVisible = defineModel<boolean>('modelValue')

// 添加props来接收初始选中的tab
interface Props {
  activeTab?: 'space-upgrade' | 'space-setting' | 'space-model' | 'space-member' | 'space-permission' | 'space-team' | 'space-trash'
}

const { t } = useI18n()

// 当前选中的左侧菜单，使用props中传入的初始值
const currentMenu = ref(props.activeTab)

// 菜单列表
const menuList = computed(() => [
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
])

// 监听props中activeTab的变化，更新currentMenu
watch(() => props.activeTab, (newValue) => {
  if (newValue) {
    currentMenu.value = newValue
  }
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
  >
    <MenuSplitContent
      v-model="currentMenu"
      :menu-list="menuList"
      content-height="800px"
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
