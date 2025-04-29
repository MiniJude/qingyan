<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import type { Team } from '~/types/team'
import defaultTeamAvatar from '~/assets/img/avatar.png'
import AvatarUploader from '~/components/user/AvatarUploader.vue'

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { appContext } = getCurrentInstance()!
const { t } = useI18n()

// 接收props
interface Props {
  team: Team
}

interface Emits {
  (e: 'update', value: Team): void
}

// 团队数据的本地副本
const localTeam = ref({ ...props.team })

// 头像相关
const teamAvatar = ref(localTeam.value.avatar || defaultTeamAvatar)
const avatarChanged = ref(false)
const originalAvatar = ref(localTeam.value.avatar || defaultTeamAvatar)

// 表单ref
const teamFormRef = ref<FormInstance>()

// 表单验证规则
const teamFormRules = reactive<FormRules>({
  name: [
    { required: true, message: t('common.validation.required', { field: t('space.team.team_name') }), trigger: 'blur' },
    { min: 2, max: 50, message: t('space.form.name_length'), trigger: 'blur' },
  ],
})

// 处理头像变更
function handleAvatarChange(newAvatar: string) {
  teamAvatar.value = newAvatar
  avatarChanged.value = true
  localTeam.value.avatar = newAvatar
}

// 撤销头像变更
function cancelAvatarUpload() {
  teamAvatar.value = originalAvatar.value
  avatarChanged.value = false
  localTeam.value.avatar = originalAvatar.value
}

// 保存团队信息变更
async function saveTeamChanges() {
  // 表单验证
  if (!teamFormRef.value)
    return

  try {
    await teamFormRef.value.validate()

    // 应用头像变更
    if (avatarChanged.value) {
      avatarChanged.value = false
      originalAvatar.value = teamAvatar.value
    }

    emit('update', localTeam.value)
    ElMessage.success(t('common.messages.operation_success', { operation: t('common.actions.save') }), appContext)
  }
  catch (error) {
    console.error('Form validation failed:', error)
  }
}

// 监听props变化，更新本地数据
watch(() => props.team, (newVal) => {
  localTeam.value = { ...newVal }
  teamAvatar.value = localTeam.value.avatar || defaultTeamAvatar
  originalAvatar.value = localTeam.value.avatar || defaultTeamAvatar
  avatarChanged.value = false
}, { deep: true })
</script>

<template>
  <el-form
    ref="teamFormRef"
    :model="localTeam"
    :rules="teamFormRules"
    label-position="top"
  >
    <div class="mb-24px">
      <div class="mb-12px">
        {{ t('space.team.team_avatar') }}
      </div>
      <!-- 使用AvatarUploader组件 -->
      <AvatarUploader
        v-model="teamAvatar"
        :size="60"
        :has-changed="avatarChanged"
        :original-avatar="originalAvatar"
        @update:model-value="handleAvatarChange"
        @cancel="cancelAvatarUpload"
      />
    </div>

    <el-form-item :label="t('space.team.team_name')" prop="name" required>
      <el-input v-model="localTeam.name" class="w-300px" />
    </el-form-item>

    <el-form-item :label="t('space.team.team_description')" prop="description">
      <el-input
        v-model="localTeam.description"
        type="textarea"
        :rows="4"
        :placeholder="t('space.team.description_placeholder')"
        class="max-w-lg w-full"
        :maxlength="200"
        show-word-limit
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="saveTeamChanges">
        {{ t('common.actions.save') }}
      </el-button>
    </el-form-item>
  </el-form>
</template>
