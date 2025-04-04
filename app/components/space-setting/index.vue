<script setup lang="ts">
import { MenuSplitContent, SpaceModelSettingPanel, SpaceSettingPanel, SpaceUpgradePanel } from '#components'

const dialogVisible = defineModel<boolean>('modelValue')

const { t } = useI18n()

// 当前选中的左侧菜单
const currentMenu = ref('space-upgrade')

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
  },
])
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    width="1200"
    :title="$t('space.title')"
    :append-to-body="true"
    :close-on-click-modal="false"
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
