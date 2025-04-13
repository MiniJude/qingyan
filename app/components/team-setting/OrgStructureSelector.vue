<script setup lang="ts">
import type { CheckboxValueType } from 'element-plus'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  (e: 'selected', value: Member[]): void
}>()

const { t } = useI18n()

// 成员类型
interface Member {
  id: number
  name: string
  avatar?: string
  userId: string
}

// 组织数据
const organization = {
  name: 'Jo\'s studio',
  members: [
    {
      id: 1,
      name: 'u53009036',
      userId: 'u53009036',
      avatar: '',
    },
    {
      id: 2,
      name: 'Coisini',
      userId: 'coisini-xvhr0',
      avatar: '',
    },
    {
      id: 3,
      name: '啦里啦啦',
      userId: 'pilipala-loqau',
      avatar: '',
    },
    {
      id: 4,
      name: 'jjj',
      userId: 'u53589763',
      avatar: '',
    },
  ] as Member[],
}

// 全选checkbox
const allSelected = ref(false)

// 已选择的成员
const selectedMembers = ref<Member[]>([])

// 显示的成员列表
const displayMembers = ref(organization.members)

// 处理全选操作
function handleSelectAll(value: CheckboxValueType): void {
  if (value) {
    selectedMembers.value = [...displayMembers.value]
  }
  else {
    selectedMembers.value = []
  }
}

// 处理单个成员选择
function handleSelectMember(member: Member, isSelected: CheckboxValueType): void {
  if (isSelected) {
    selectedMembers.value.push(member)
  }
  else {
    const index = selectedMembers.value.findIndex(m => m.id === member.id)
    if (index !== -1) {
      selectedMembers.value.splice(index, 1)
    }
  }
}

// 检查成员是否被选中
function isMemberSelected(member: Member) {
  return selectedMembers.value.some(m => m.id === member.id)
}

// 返回上一页
function goBack() {
  emit('selected', selectedMembers.value)
}

// 监听选择变化，更新全选状态
watch(selectedMembers, (newVal) => {
  allSelected.value = newVal.length > 0 && newVal.length === displayMembers.value.length
  emit('selected', selectedMembers.value)
}, { deep: true })
</script>

<template>
  <div class="org-structure-selector">
    <!-- 头部 -->
    <div class="flex items-center border-b border-gray-200 p-16px">
      <div class="flex cursor-pointer items-center" @click="goBack">
        <i class="i-carbon:arrow-left mr-8px text-18px" />
        <span>{{ t('space.team.batch_add.from_org_structure') }}</span>
      </div>
    </div>

    <!-- 组织名称 -->
    <div class="p-20px">
      <h3 class="mb-16px text-18px font-medium">
        {{ organization.name }}
      </h3>

      <!-- 全选按钮 -->
      <div class="mb-16px">
        <el-checkbox v-model="allSelected" @change="handleSelectAll">
          {{ t('space.team.batch_add.select_all', { text: t('space.team.batch_add.current_page_members') }) }}
        </el-checkbox>
      </div>

      <!-- 成员列表 -->
      <div class="member-list">
        <div v-for="member in displayMembers" :key="member.id" class="flex items-center border-b border-gray-200 p-12px">
          <el-checkbox
            :model-value="isMemberSelected(member)"
            @change="value => handleSelectMember(member, value)"
          />
          <div class="ml-12px flex items-center">
            <el-avatar :size="40" class="mr-12px">
              {{ member.name.charAt(0).toUpperCase() }}
            </el-avatar>
            <div>
              <div class="font-medium">
                {{ member.name }}
              </div>
              <div class="text-12px text-gray-500">
                ({{ member.userId }})
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.org-structure-selector {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  z-index: 1;
}

.member-list {
  max-height: 350px;
  overflow-y: auto;
}
</style>
