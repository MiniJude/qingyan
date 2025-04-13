<script setup lang="ts">
import type { Team } from '~/types/team'
import TeamInfo from './TeamInfo.vue'
import TeamMoreSettings from './TeamMoreSettings.vue'
import TeamPermission from './TeamPermission.vue'

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { t } = useI18n()

// 接收props
interface Props {
  modelValue: boolean
  team?: Team
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
const activeSideMenu = ref('team-info')

// 侧边栏菜单
const sideMenus = [
  {
    key: 'team-info',
    label: t('space.team.team_info'),
    icon: 'i-carbon:group',
  },
  {
    key: 'permission',
    label: t('space.team.permission'),
    icon: 'i-carbon:security',
  },
  {
    key: 'more-settings',
    label: t('space.team.more_settings'),
    icon: 'i-carbon:settings',
  },
]

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
    @closed="closeDialog"
  >
    <div class="team-info-dialog">
      <div class="h-600px flex">
        <!-- 左侧菜单 -->
        <div class="sidebar w-200px border-r border-gray-200 p-20px">
          <div
            v-for="menu in sideMenus"
            :key="menu.key"
            class="sidebar-item mb-12px flex cursor-pointer items-center rounded-md p-12px transition-all"
            :class="{ active: activeSideMenu === menu.key }"
            @click="activeSideMenu = menu.key"
          >
            <i :class="menu.icon" class="mr-8px text-18px" />
            {{ menu.label }}
          </div>
        </div>

        <!-- 右侧内容 -->
        <div class="content flex-1 p-24px">
          <!-- 使用组件化的方式显示内容 -->
          <TeamInfo
            v-if="activeSideMenu === 'team-info' && localTeam"
            :team="localTeam"
            @update="handleTeamInfoUpdate"
          />
          <TeamPermission
            v-if="activeSideMenu === 'permission'"
          />
          <TeamMoreSettings
            v-if="activeSideMenu === 'more-settings'"
          />
        </div>
      </div>
    </div>
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
