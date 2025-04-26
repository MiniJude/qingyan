<script setup lang="ts">
import type { Component, ShallowRef } from 'vue'
import type { Team } from '~/types/team'
import TeamInfo from './TeamInfo.vue'
import TeamMoreSettings from './TeamMoreSettings.vue'
import TeamPermission from './TeamPermission.vue'

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { t } = useI18n()
const { isMobileDevice } = useDeviceDetection()

// 接收props
interface Props {
  modelValue: boolean
  team?: Team
  defaultActiveMenu?: string
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'update:team', value: Team): void
}

// 计算属性用于双向绑定
const dialogVisible = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})

// 当前团队的副本
const localTeam = ref(props.team ? { ...props.team } : null)

// 关闭弹框
function closeDialog() {
  emit('update:modelValue', false)
}

// 当前激活的菜单
const activeMenuKey = ref(props.defaultActiveMenu || 'team-info')

// 侧边栏菜单配置
const menuList = [
  {
    key: 'team-info',
    name: t('space.team.team_info'),
    icon: 'i-carbon:group',
    description: t('space.team.team_info_description'),
  },
  {
    key: 'permission',
    name: t('space.team.permission'),
    icon: 'i-carbon:security',
    description: t('space.team.permission_description'),
  },
  {
    key: 'more-settings',
    name: t('space.team.more_settings'),
    icon: 'i-carbon:settings',
    description: t('space.team.more_settings_description'),
  },
]

// 监听defaultActiveMenu变化
watch(() => props.defaultActiveMenu, (newVal) => {
  if (newVal) {
    activeMenuKey.value = newVal
  }
})

// 处理团队信息更新
function handleTeamInfoUpdate(updatedTeam: Team) {
  localTeam.value = { ...updatedTeam }
  emit('update:team', localTeam.value)
}

// 监听props变化
watch(() => props.team, (newVal) => {
  if (newVal) {
    localTeam.value = { ...newVal }
  }
}, { deep: true })
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="t('space.team.team_info')"
    width="1000px"
    :append-to-body="true"
    :close-on-click-modal="false"
    align-center
    :fullscreen="isMobileDevice"
    @closed="closeDialog"
  >
    <MenuSplitContent
      v-model="activeMenuKey"
      :menu-list="menuList"
      content-height="600px"
    >
      <!-- 根据活动菜单显示对应的组件 -->
      <template #default="{ activeMenu }">
        <TeamInfo
          v-if="activeMenu === 'team-info' && localTeam"
          :team="localTeam"
          @update="handleTeamInfoUpdate"
        />
        <TeamPermission
          v-if="activeMenu === 'permission'"
        />
        <TeamMoreSettings
          v-if="activeMenu === 'more-settings'"
        />
      </template>
    </MenuSplitContent>
  </el-dialog>
</template>

<style lang="scss" scoped>
.team-info-dialog {
  .sidebar-item {
    &:hover {
      background-color: #f5f7fa;
    }
    &.active {
      background-color: #ecf5ff;
      color: var(--el-color-primary);
    }
  }

  .text-danger {
    color: var(--el-color-danger);
  }
}
</style>
