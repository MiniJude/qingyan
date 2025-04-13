<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import type { CreateTeamRequest, Team } from '~/types/team'
import defaultTeamAvatar from '~/assets/img/avatar.png'
import AvatarUploader from '~/components/user/AvatarUploader.vue'

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { appContext } = getCurrentInstance()!
const { t } = useI18n()

// 接收props
interface Props {
  modelValue: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'teamCreated', value: Team): void
}

// 计算属性用于双向绑定
const dialogVisible = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})

// 新团队数据
const newTeam = ref<CreateTeamRequest>({
  name: '',
  description: '',
  avatar: '',
  isPublic: true,
})

// 头像相关
const teamAvatar = ref(defaultTeamAvatar)
const avatarChanged = ref(false)
const originalAvatar = ref(defaultTeamAvatar)

// 表单ref
const teamFormRef = ref<FormInstance>()

// 表单验证规则
const teamFormRules = reactive<FormRules>({
  name: [
    { required: true, message: t('common.validation.required', { field: t('space.team.team_name') }), trigger: 'blur' },
    { min: 2, max: 50, message: t('space.form.name_length'), trigger: 'blur' },
  ],
})

// 关闭弹框
function closeDialog() {
  teamFormRef.value?.resetFields()
  newTeam.value.name = ''
  newTeam.value.description = ''
  newTeam.value.isPublic = true
  teamAvatar.value = defaultTeamAvatar
  avatarChanged.value = false
  emit('update:modelValue', false)
}

// 处理头像变更
function handleAvatarChange(newAvatar: string) {
  teamAvatar.value = newAvatar
  avatarChanged.value = true
  newTeam.value.avatar = newAvatar
}

// 撤销头像变更
function cancelAvatarUpload() {
  teamAvatar.value = originalAvatar.value
  avatarChanged.value = false
  newTeam.value.avatar = originalAvatar.value
}

// 添加成员相关
const memberSearch = ref('')
const addingMembers = ref(false)

// 创建团队
async function createTeam() {
  // 表单验证
  if (!teamFormRef.value)
    return

  try {
    await teamFormRef.value.validate()

    // 这里应该调用API创建团队
    // 为了演示，创建一个模拟的团队对象
    const createdTeam: Team = {
      id: Date.now(), // 模拟ID
      name: newTeam.value.name,
      description: newTeam.value.description,
      avatar: newTeam.value.avatar || defaultTeamAvatar,
      isLocked: false,
      createdTime: new Date(),
      isPublic: newTeam.value.isPublic,
      updatedAt: new Date(),
      ownerId: 'current-user-id', // 模拟当前用户ID
      members: [], // 初始没有成员
    }

    emit('teamCreated', createdTeam)
    ElMessage.success(t('common.messages.operation_success', { operation: t('common.actions.create') }), appContext)
    closeDialog()
  }
  catch (error) {
    console.error('Form validation failed:', error)
  }
}

// 批量添加成员
function batchAddMembers() {
  ElMessage.info(t('space.team.add_member_coming_soon'), appContext)
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="t('space.team.create.title')"
    width="600px"
    :append-to-body="true"
    :close-on-click-modal="false"
    align-center
    @closed="closeDialog"
  >
    <div class="create-team-dialog">
      <p class="mb-20px text-gray-500">
        {{ t('space.team.create.subtitle') }}
      </p>

      <el-form
        ref="teamFormRef"
        :model="newTeam"
        :rules="teamFormRules"
        label-position="top"
      >
        <!-- 基本信息 -->
        <div class="mb-24px">
          <h3 class="mb-16px text-16px font-medium">
            {{ t('space.team.create.basic_info') }}
          </h3>

          <!-- 头像 -->
          <div class="mb-24px">
            <div class="mb-12px flex items-center">
              <AvatarUploader
                v-model="teamAvatar"
                :size="60"
                :has-changed="avatarChanged"
                :original-avatar="originalAvatar"
                @update:model-value="handleAvatarChange"
                @cancel="cancelAvatarUpload"
              />
            </div>
          </div>

          <!-- 团队名称 -->
          <el-form-item :label="t('space.team.create.team_name')" prop="name" required>
            <el-input
              v-model="newTeam.name"
              class="w-full"
              :placeholder="t('space.team.create.team_name_placeholder')"
            />
          </el-form-item>

          <!-- 团队简介 -->
          <el-form-item :label="t('space.team.create.description')" prop="description">
            <el-input
              v-model="newTeam.description"
              type="textarea"
              :rows="4"
              :placeholder="t('space.team.create.description_placeholder')"
              class="w-full"
              :maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </div>

        <!-- 添加成员 -->
        <div class="mb-24px">
          <h3 class="mb-16px text-16px font-medium">
            {{ t('space.team.create.add_member') }}
          </h3>

          <div class="mb-16px flex items-center">
            <el-input
              v-model="memberSearch"
              class="mr-12px flex-1"
              :placeholder="t('space.team.create.search_member_placeholder')"
              clearable
            >
              <template #prefix>
                <el-icon><i class="i-carbon:search" /></el-icon>
              </template>
            </el-input>
            <el-button @click="batchAddMembers">
              {{ t('space.team.create.batch_add') }}
            </el-button>
          </div>

          <!-- 成员列表区域（为了简化，这里不实现实际的成员添加功能） -->
          <div v-if="addingMembers" class="h-100px flex items-center justify-center border border-gray-300 rounded-md border-dashed">
            <div class="text-gray-400">
              {{ t('space.team.add_member_coming_soon') }}
            </div>
          </div>
        </div>

        <!-- 公开性 -->
        <div class="mb-24px">
          <h3 class="mb-16px text-16px font-medium">
            {{ t('space.team.create.visibility') }}
          </h3>

          <div class="flex items-center">
            <el-switch v-model="newTeam.isPublic" />
            <span class="ml-8px">{{ t('space.team.create.public_to_space') }}</span>
          </div>
        </div>

        <!-- 提交按钮 -->
        <div class="mt-32px flex justify-center">
          <el-button type="primary" class="w-full" @click="createTeam">
            {{ t('space.team.create.create_button') }}
          </el-button>
        </div>
      </el-form>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
.create-team-dialog {
  .text-danger {
    color: var(--el-color-danger);
  }
}
</style>
