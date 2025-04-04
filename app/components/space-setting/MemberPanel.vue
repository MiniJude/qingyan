<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'

const { t } = useI18n()

// 成员列表
const members = ref([
  {
    id: 1,
    username: '张三',
    email: 'zhangsan@example.com',
    role: 'admin',
    status: 'active',
    joinTime: '2024-03-20',
  },
  {
    id: 2,
    username: '李四',
    email: 'lisi@example.com',
    role: 'member',
    status: 'active',
    joinTime: '2024-03-21',
  },
])

// 角色选项
const roleOptions = [
  {
    label: t('space.member.role.admin'),
    value: 'admin',
  },
  {
    label: t('space.member.role.member'),
    value: 'member',
  },
]

// 添加成员对话框
const addMemberDialogVisible = ref(false)
const addMemberFormRef = ref<FormInstance>()
const addMemberForm = ref({
  email: '',
  role: 'member',
})

// 添加成员表单验证规则
const addMemberRules = reactive<FormRules>({
  email: [
    { required: true, message: t('common.validation.required', { field: t('space.member.email') }), trigger: 'blur' },
    { type: 'email', message: t('common.validation.format_error', { field: t('space.member.email') }), trigger: 'blur' },
  ],
  role: [
    { required: true, message: t('common.validation.required', { field: t('space.member.role.label') }), trigger: 'change' },
  ],
})

// 提交添加成员表单
async function submitAddMember() {
  if (!addMemberFormRef.value)
    return

  try {
    await addMemberFormRef.value.validate()
    // TODO: 调用API添加成员
    ElMessage.success(t('space.member.add_success'))
    addMemberDialogVisible.value = false
  }
  catch (error) {
    console.error('Form validation failed:', error)
  }
}

// 更改成员角色
async function changeRole(member: any, role: string) {
  try {
    // TODO: 调用API更改角色
    member.role = role
    ElMessage.success(t('space.member.role_change_success'))
  }
  catch (error) {
    console.error('Change role failed:', error)
  }
}

// 移除成员
async function removeMember(member: any) {
  try {
    await ElMessageBox.confirm(
      t('space.member.remove_confirm', { name: member.username }),
      t('common.actions.warning'),
      {
        confirmButtonText: t('common.actions.confirm'),
        cancelButtonText: t('common.actions.cancel'),
        type: 'warning',
      },
    )
    // TODO: 调用API移除成员
    const index = members.value.findIndex(m => m.id === member.id)
    if (index !== -1)
      members.value.splice(index, 1)
    ElMessage.success(t('space.member.remove_success'))
  }
  catch (error) {
    if (error !== 'cancel')
      console.error('Remove member failed:', error)
  }
}
</script>

<template>
  <div class="space-member-panel">
    <!-- 头部标题和描述 -->
    <div class="mb-20px p-20px">
      <h2 class="mb-10px text-24px font-bold">
        {{ $t('space.member.title') }}
      </h2>
      <p class="text-gray-500">
        {{ $t('space.member.description') }}
      </p>
    </div>

    <!-- 成员列表 -->
    <div class="p-20px">
      <!-- 添加成员按钮 -->
      <div class="mb-20px">
        <el-button type="primary" @click="addMemberDialogVisible = true">
          <div class="i-carbon:user-follow mr-5px" />
          {{ $t('space.member.add_member') }}
        </el-button>
      </div>

      <!-- 成员表格 -->
      <el-table :data="members" style="width: 100%">
        <el-table-column prop="username" :label="$t('space.member.username')" />
        <el-table-column prop="email" :label="$t('space.member.email')" />
        <el-table-column :label="$t('space.member.role.label')" width="200">
          <template #default="{ row }">
            <el-select
              v-model="row.role"
              :disabled="row.role === 'admin'"
              @change="changeRole(row, $event)"
            >
              <el-option
                v-for="option in roleOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="joinTime" :label="$t('space.member.join_time')" width="180" />
        <el-table-column :label="$t('common.actions.operations')" width="120" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="row.role !== 'admin'"
              type="danger"
              link
              @click="removeMember(row)"
            >
              {{ $t('common.actions.remove') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 添加成员对话框 -->
    <el-dialog
      v-model="addMemberDialogVisible"
      :title="$t('space.member.add_member')"
      width="500px"
    >
      <el-form
        ref="addMemberFormRef"
        :model="addMemberForm"
        :rules="addMemberRules"
        label-width="100px"
      >
        <el-form-item :label="$t('space.member.email')" prop="email">
          <el-input
            v-model="addMemberForm.email"
            :placeholder="$t('space.member.email_placeholder')"
          />
        </el-form-item>
        <el-form-item :label="$t('space.member.role.label')" prop="role">
          <el-select v-model="addMemberForm.role">
            <el-option
              v-for="option in roleOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addMemberDialogVisible = false">
          {{ $t('common.actions.cancel') }}
        </el-button>
        <el-button type="primary" @click="submitAddMember">
          {{ $t('common.actions.confirm') }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.space-member-panel {
  :deep(.el-table) {
    --el-table-border-color: var(--el-border-color-lighter);
  }
}
</style>
