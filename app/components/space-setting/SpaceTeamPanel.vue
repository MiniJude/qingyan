<script setup lang="ts">
import type { Team } from '~/types/team'
import { MoreFilled, Search } from '@element-plus/icons-vue'
import CreateTeamDialog from '../team-setting/CreateTeamDialog.vue'
import TeamSetting from '../team-setting/index.vue'

const { appContext } = getCurrentInstance()!
const { t } = useI18n()

// 团队列表数据
const teams = ref<Team[]>([
  {
    id: 1,
    name: '你好',
    isLocked: true,
    createdTime: new Date(),
  },
  {
    id: 2,
    name: '技术团队',
    isLocked: true,
    createdTime: new Date(2023, 2, 25, 17, 3), // 03-25 17:03
  },
  {
    id: 3,
    name: '产品',
    isLocked: true,
    createdTime: new Date(2023, 2, 25, 17, 1), // 03-25 17:01
  },
])

// 搜索查询
const searchQuery = ref('')

// 根据搜索查询过滤团队
const filteredTeams = computed(() => {
  if (!searchQuery.value)
    return teams.value

  const query = searchQuery.value.toLowerCase()
  return teams.value.filter(team =>
    team.name.toLowerCase().includes(query),
  )
})

// 格式化日期
function formatDate(date: Date | string): string {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const inputDate = new Date(date instanceof Date ? date : new Date(date))

  // 如果是今天
  if (inputDate >= today) {
    return `${t('space.team.today')} ${inputDate.getHours().toString().padStart(2, '0')}:${inputDate.getMinutes().toString().padStart(2, '0')}`
  }

  // 其他日期显示月日时分
  return `${(inputDate.getMonth() + 1).toString().padStart(2, '0')}-${inputDate.getDate().toString().padStart(2, '0')} ${inputDate.getHours().toString().padStart(2, '0')}:${inputDate.getMinutes().toString().padStart(2, '0')}`
}

// 当前页码
const currentPage = ref(1)

// 当前查看的团队
const currentTeam = ref<Team | undefined>(undefined)
const teamInfoDialogVisible = ref(false)
const createTeamDialogVisible = ref(false)

// 处理团队操作
async function handleTeamAction(team: Team, action: 'view' | 'settings' | 'delete'): Promise<void> {
  switch (action) {
    case 'view':
      // 打开团队信息弹框
      currentTeam.value = { ...team }
      teamInfoDialogVisible.value = true
      break
    case 'settings':
      // 团队设置逻辑
      ElMessage.info('团队设置功能即将实现', appContext)
      break
    case 'delete':
      try {
        await ElMessageBox.confirm(
          t('space.team.delete_confirm', { name: team.name }),
          t('common.actions.warning'),
          {
            confirmButtonText: t('common.actions.confirm'),
            cancelButtonText: t('common.actions.cancel'),
            type: 'warning',
          },
          appContext,
        )
        // 删除团队逻辑
        // TODO: 实现真实删除API调用
        const index = teams.value.findIndex(t => t.id === team.id)
        if (index !== -1) {
          teams.value.splice(index, 1)
        }
        ElMessage.success(t('common.messages.operation_success', { operation: t('common.actions.delete') }))
      }
      catch (error) {
        if (error !== 'cancel') {
          console.error('Delete team failed:', error)
        }
      }
      break
  }
}

// 更新团队信息
function updateTeamInfo(updatedTeam: Team) {
  if (!updatedTeam)
    return

  // 找到当前团队在列表中的索引并更新
  const index = teams.value.findIndex(t => t.id === updatedTeam.id)
  if (index !== -1) {
    teams.value[index] = { ...updatedTeam }
  }
}

// 创建新团队
function createTeam(): void {
  createTeamDialogVisible.value = true
}

// 处理新团队创建完成
function handleTeamCreated(newTeam: Team): void {
  if (newTeam) {
    const formattedTeam: Team = {
      ...newTeam,
      isLocked: newTeam.isLocked ?? false,
    }

    teams.value.push(formattedTeam)
    ElMessage.success(t('common.messages.operation_success', { operation: t('common.actions.create') }), appContext)
  }
}
</script>

<template>
  <div class="space-team-panel">
    <!-- 标题和搜索区域 -->
    <div class="flex items-center justify-between py-20px">
      <div class="flex space-x-16px">
        <el-input
          v-model="searchQuery"
          class="w-300px"
          :placeholder="$t('space.team.search_placeholder')"
          :prefix-icon="Search"
          clearable
        />
        <el-button type="primary" @click="createTeam">
          {{ $t('space.team.create_team') }}
        </el-button>
      </div>
    </div>

    <!-- 使用Element Plus表格 -->
    <el-table :data="filteredTeams" style="width: 100%">
      <!-- 团队名称列 -->
      <el-table-column prop="name" :label="$t('space.team.team_name')" min-width="200">
        <template #default="{ row }">
          <div class="flex items-center">
            <div class="mr-12px h-36px w-36px flex items-center justify-center rounded-md bg-blue-100 text-blue-600">
              <i class="i-carbon:group text-20px" />
            </div>
            <span class="flex items-center">
              {{ row.name }}
              <el-icon v-if="row.isLocked" class="ml-8px text-gray-400">
                <i class="i-carbon:locked" />
              </el-icon>
            </span>
          </div>
        </template>
      </el-table-column>

      <!-- 创建时间列 -->
      <el-table-column prop="createdTime" :label="$t('space.team.created_time')">
        <template #default="{ row }">
          {{ formatDate(row.createdTime) }}
        </template>
      </el-table-column>

      <!-- 操作列 -->
      <el-table-column :label="$t('space.team.operations')" width="60" align="center" fixed="right">
        <template #default="{ row }">
          <el-dropdown trigger="click" @command="action => handleTeamAction(row, action)">
            <span class="cursor-pointer">
              <el-icon :size="20">
                <MoreFilled />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="view">
                  {{ $t('space.team.view_team') }}
                </el-dropdown-item>
                <el-dropdown-item command="settings">
                  {{ $t('space.team.team_settings') }}
                </el-dropdown-item>
                <el-dropdown-item command="delete" divided style="color: #f56c6c;">
                  {{ $t('space.team.delete_team') }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="mt-20px flex justify-center">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="10"
        layout="prev, pager, next"
        :total="teams.length"
        background
      />
    </div>

    <!-- 团队信息弹框 -->
    <TeamSetting
      v-model="teamInfoDialogVisible"
      :team="currentTeam"
      @update:team="updateTeamInfo"
    />

    <!-- 新建团队弹框 -->
    <CreateTeamDialog
      v-model="createTeamDialogVisible"
      @team-created="handleTeamCreated"
    />
  </div>
</template>

<style lang="scss" scoped>
.space-team-panel {
}
</style>
