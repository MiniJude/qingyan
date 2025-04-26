<script setup lang="ts">
import type { CheckboxValueType } from 'element-plus'
import { ElMessage } from 'element-plus'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// 组件属性
const props = defineProps<{
  modelValue: boolean // 对话框显示状态
}>()

// 组件事件
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'addMembers', members: any[]): void
}>()

const { t } = useI18n()
const { isMobileDevice } = useDeviceDetection()
// 计算属性：对话框显示状态
const dialogVisible = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

// 搜索关键词
const searchKeyword = ref('')
// 选中的成员列表
const selectedMembers = ref<any[]>([])

// 模拟数据：所有成员列表
const allMembers = ref([
  { id: 1, name: 'u53009036', avatarUrl: '', email: 'u53009036@example.com' },
  { id: 2, name: 'Coisini', avatarUrl: '', email: 'coisini@example.com' },
  { id: 3, name: '啦里啦啦', avatarUrl: '', email: 'lalilala@example.com' },
  { id: 4, name: '张三', avatarUrl: '', email: 'zhangsan@example.com' },
  { id: 5, name: '李四', avatarUrl: '', email: 'lisi@example.com' },
  { id: 6, name: '王五', avatarUrl: '', email: 'wangwu@example.com' },
  { id: 7, name: '赵六', avatarUrl: '', email: 'zhaoliu@example.com' },
])

// 过滤后的成员列表
const filteredMembers = computed(() => {
  if (!searchKeyword.value)
    return allMembers.value

  return allMembers.value.filter(member =>
    member.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
    || member.email.toLowerCase().includes(searchKeyword.value.toLowerCase()),
  )
})

// 选择或取消选择成员
function toggleSelectMember(member: any) {
  const index = selectedMembers.value.findIndex(m => m.id === member.id)
  if (index === -1) {
    selectedMembers.value.push(member)
  }
  else {
    selectedMembers.value.splice(index, 1)
  }
}

// 移除选中的成员
function removeMember(member: any) {
  const index = selectedMembers.value.findIndex(m => m.id === member.id)
  if (index !== -1) {
    selectedMembers.value.splice(index, 1)
  }
}

// 全选或取消全选
function toggleSelectAll(value: CheckboxValueType) {
  const isSelected = Boolean(value)

  if (isSelected) {
    // 全选当前过滤列表中未选的成员
    const membersToAdd = filteredMembers.value.filter(
      member => !selectedMembers.value.some(m => m.id === member.id),
    )
    selectedMembers.value.push(...membersToAdd)
  }
  else {
    // 取消选择当前过滤列表中的成员
    selectedMembers.value = selectedMembers.value.filter(
      member => !filteredMembers.value.some(m => m.id === member.id),
    )
  }
}

// 检查是否全选
const isAllSelected = computed(() => {
  if (filteredMembers.value.length === 0)
    return false
  return filteredMembers.value.every(
    member => selectedMembers.value.some(m => m.id === member.id),
  )
})

// 添加选中的成员
function addMembers() {
  if (selectedMembers.value.length === 0) {
    ElMessage.warning(t('space.team.batch_add.no_members_selected'))
    return
  }

  emit('addMembers', selectedMembers.value)
  dialogVisible.value = false
  // 重置状态
  selectedMembers.value = []
  searchKeyword.value = ''
}

// 关闭对话框时重置状态
function handleClose() {
  selectedMembers.value = []
  searchKeyword.value = ''
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="t('space.team.batch_add.title')"
    width="640px"
    center
    :fullscreen="isMobileDevice"
    @closed="handleClose"
  >
    <div class="batch-add-dialog">
      <div class="mb-4">
        <el-input
          v-model="searchKeyword"
          :placeholder="t('space.team.batch_add.search_placeholder')"
          clearable
        >
          <template #prefix>
            <i class="i-carbon:search" />
          </template>
        </el-input>
      </div>

      <div class="flex" style="min-height: 340px;">
        <!-- 左侧：已选成员预览 -->
        <div class="w-210px border-r border-gray-200 pr-4 lt-md:hidden">
          <div class="mb-3 text-16px font-medium">
            {{ t('space.team.batch_add.selected_count', { count: selectedMembers.length }) }}
          </div>

          <div v-if="selectedMembers.length > 0" class="selected-members overflow-y-auto" style="max-height: 300px;">
            <div
              v-for="member in selectedMembers"
              :key="member.id"
              class="mb-2 flex items-center rounded bg-gray-50 p-2"
            >
              <el-avatar :size="28" class="mr-2">
                {{ member.name.charAt(0).toUpperCase() }}
              </el-avatar>
              <div class="mr-2 min-w-0 flex-1">
                <div class="truncate font-medium">
                  {{ member.name }}
                </div>
              </div>
              <div
                class="i-carbon:close flex-shrink-0 cursor-pointer"
                @click="removeMember(member)"
              />
            </div>
          </div>

          <div v-else class="py-4 text-center text-gray-500">
            {{ t('space.team.batch_add.please_select_one') }}
          </div>
        </div>

        <!-- 右侧：成员列表 -->
        <div class="flex-1 pl-4">
          <div class="mb-3 flex items-center justify-between">
            <div class="text-16px font-medium">
              {{ filteredMembers.length === 0 && searchKeyword ? t('common.search.no_results') : t('space.team.batch_add.member_count', { count: filteredMembers.length }) }}
            </div>
            <el-checkbox
              v-if="filteredMembers.length > 0"
              :model-value="isAllSelected"
              @change="toggleSelectAll"
            >
              {{ t('space.team.batch_add.select_all', { text: '' }) }}
            </el-checkbox>
          </div>

          <div v-if="filteredMembers.length > 0" class="members-list overflow-y-auto" style="max-height: 300px;">
            <div
              v-for="member in filteredMembers"
              :key="member.id"
              class="mb-2 flex items-center rounded p-2 hover:bg-gray-100"
            >
              <el-checkbox
                :model-value="selectedMembers.some(m => m.id === member.id)"
                @change="() => toggleSelectMember(member)"
              />
              <el-avatar :size="32" class="mx-3">
                {{ member.name.charAt(0).toUpperCase() }}
              </el-avatar>
              <div class="flex-1">
                <div>{{ member.name }}</div>
                <div class="text-12px text-gray-500">
                  {{ member.email }}
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="searchKeyword" class="py-4 text-center text-gray-500">
            {{ t('common.search.no_results') }}
          </div>

          <div v-else class="py-4 text-center text-gray-500">
            {{ t('space.team.batch_add.search_tip') }}
          </div>
        </div>
      </div>

      <!-- 底部操作栏 -->
      <div class="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 lt-md:flex-col lt-md:gap-4">
        <div class="text-14px">
          {{ t('space.team.batch_add.selected_count', { count: selectedMembers.length }) }}
          <span class="mx-2">{{ t('space.team.batch_add.add_as') }}:</span>
          <span>{{ t('space.team.member') }}</span>
        </div>

        <div>
          <el-button @click="dialogVisible = false">
            {{ t('common.actions.cancel') }}
          </el-button>
          <el-button type="primary" @click="addMembers">
            {{ t('common.actions.confirm') }}
          </el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">
.batch-add-dialog {
  min-height: 300px;
}

.selected-members::-webkit-scrollbar,
.members-list::-webkit-scrollbar {
  width: 4px;
}

.selected-members::-webkit-scrollbar-thumb,
.members-list::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

// 自定义删除按钮样式
:deep(.el-button.el-button--danger.is-circle.el-button--small) {
  padding: 5px;
  width: 24px;
  height: 24px;
  min-height: 24px;
}
</style>
