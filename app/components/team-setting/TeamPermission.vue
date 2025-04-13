<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { getCurrentInstance, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BatchAddMemberDialog from './BatchAddMemberDialog.vue'

const { appContext } = getCurrentInstance()!
const { t } = useI18n()

// 定义TeamMember接口
interface TeamMember {
  id: number
  name: string
  role: 'owner' | 'member'
  department: string
  permission: 'admin' | 'manageable' | 'read_only'
}

// 成员数据
const members = ref<TeamMember[]>([
  {
    id: 1,
    name: 'John',
    role: 'owner',
    department: 'Jo\'s studio',
    permission: 'admin',
  },
  {
    id: 2,
    name: 'Coisini',
    role: 'member',
    department: 'Jo\'s studio',
    permission: 'manageable',
  },
  {
    id: 3,
    name: '啦里啦啦',
    role: 'member',
    department: 'Jo\'s studio',
    permission: 'read_only',
  },
])

// 批量添加成员对话框状态
const batchAddDialogVisible = ref(false)

// 处理权限变更
function handlePermissionChange(member: TeamMember, permission: 'manageable' | 'read_only'): void {
  member.permission = permission
  ElMessage.success(t('common.messages.operation_success', { operation: t('space.team.set_permission') }), appContext)
}

// 批量添加成员
function handleAddBatchMembers() {
  batchAddDialogVisible.value = true
}

// 处理添加的成员
function handleAddedMembers(newMembers: any[]) {
  if (newMembers.length === 0)
    return

  // 将新成员添加为普通成员
  const processedMembers = newMembers.map(member => ({
    id: member.id,
    name: member.name,
    role: 'member' as const, // 明确指定类型
    department: member.organization || 'Jo\'s studio',
    permission: 'read_only' as const, // 明确指定类型
  }))

  // 过滤掉已存在的成员
  const uniqueNewMembers = processedMembers.filter(
    newMember => !members.value.some(existingMember => existingMember.id === newMember.id),
  )

  if (uniqueNewMembers.length > 0) {
    members.value.push(...uniqueNewMembers)
    ElMessage.success(t('common.messages.operation_success', {
      operation: t('space.team.batch_add.members_added', { count: uniqueNewMembers.length }),
    }), appContext)
  }
}

// 移除成员
async function removeMember(member: TeamMember): Promise<void> {
  try {
    await ElMessageBox.confirm(
      t('common.user.remove_confirm', { name: member.name }),
      t('common.actions.warning'),
      {
        confirmButtonText: t('common.actions.confirm'),
        cancelButtonText: t('common.actions.cancel'),
        type: 'warning',
      },
      appContext,
    )
    const index = members.value.findIndex(m => m.id === member.id)
    if (index !== -1) {
      members.value.splice(index, 1)
    }
    ElMessage.success(t('common.messages.operation_success', { operation: t('common.actions.remove') }), appContext)
  }
  catch (error) {
    if (error !== 'cancel') {
      console.error('Remove member failed:', error)
    }
  }
}

// 退出团队
function exitTeam() {
  ElMessage.warning(t('common.coming_soon.title'), appContext)
}
</script>

<template>
  <div class="permission-panel">
    <h3 class="mb-16px text-18px font-medium">
      {{ t('space.team.permission') }}
    </h3>
    <p class="mb-20px text-sm text-gray-500">
      {{ t('space.team.permission_description') }}
    </p>

    <!-- 成员列表 -->
    <div>
      <div class="mb-16px flex items-center justify-between">
        <div class="text-18px font-medium">
          {{ t('space.team.members') }}
        </div>
        <el-button type="primary" @click="handleAddBatchMembers">
          {{ t('space.team.add_member') }}
        </el-button>
      </div>

      <el-table :data="members" border>
        <el-table-column :label="t('space.team.name')" min-width="160">
          <template #default="{ row }">
            <div class="flex items-center">
              <el-avatar :size="32" class="mr-8px">
                {{ row.name.charAt(0).toUpperCase() }}
              </el-avatar>
              <div>
                <div>{{ row.name }}</div>
                <div v-if="row.role === 'owner'" class="mt-2px text-12px text-gray-500">
                  {{ row.role === 'owner' ? t('space.team.owner') : '' }}
                </div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column :label="t('common.departments.department')" prop="department" min-width="150" />

        <el-table-column :label="t('space.team.role')" min-width="150">
          <template #default="{ row }">
            <div>
              <el-dropdown
                v-if="row.role !== 'owner'"
                trigger="click"
                @command="permission => handlePermissionChange(row, permission)"
              >
                <span class="flex cursor-pointer items-center font-bold">
                  {{ row.permission === 'manageable' ? t('space.team.manageable') : t('space.team.read_only_permission') }}
                  <el-icon class="el-icon--right"><i class="i-carbon:chevron-down" /></el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="manageable">
                      {{ t('space.team.manageable') }}
                    </el-dropdown-item>
                    <el-dropdown-item command="read_only">
                      {{ t('space.team.read_only_permission') }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <span v-else class="font-bold">
                {{ t('space.team.admin') }}
              </span>
            </div>
          </template>
        </el-table-column>

        <el-table-column :label="t('space.team.operation')" width="120" align="center">
          <template #default="{ row }">
            <div class="flex items-center justify-center">
              <div
                v-if="row.role !== 'owner'"
                class="i-carbon:trash-can cursor-pointer"
                @click="removeMember(row)"
              />

              <div v-else class="i-carbon:exit rotate-180" cursor-pointer @click="exitTeam" />
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 批量添加成员对话框 -->
    <BatchAddMemberDialog
      v-model="batchAddDialogVisible"
      @add-members="handleAddedMembers"
    />
  </div>
</template>
