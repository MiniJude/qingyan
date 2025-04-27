<script lang="ts" setup>
import type { Team } from '~/types/team'
import { Plus } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { useFileStore } from '~/stores/file'
import { useSpaceStore } from '~/stores/space'

const spaceStore = useSpaceStore()
const { appContext } = getCurrentInstance()!
const { t } = useI18n()

// 响应式数据结构
const data = ref<{
  treeData: FileTreeType[]
  checkboxVisible: boolean
  checkedKeys: string[]
}[]>([])

// 团队设置相关
const teamSettingVisible = ref(false)
const currentTeam = ref<Team | undefined>(undefined)
const defaultActiveMenu = ref('team-info')

// 加载状态
const loading = ref(false)
// 新增根文件夹对话框
const addRootFolderDialogVisible = ref(false)
const newRootFolderName = ref('')

// 加载知识库数据
async function loadKnowledgeBaseData() {
  if (!spaceStore.currentSpace)
    return
  loading.value = true
  try {
    const spaceId = spaceStore.currentSpace.id
    const knowledgeBaseData = await $api<FileTreeType[]>(`/mock-api/knowledge-base?spaceId=${spaceId}`)

    if (Array.isArray(knowledgeBaseData)) {
      data.value = knowledgeBaseData.map(item => ({
        treeData: [item],
        checkboxVisible: false,
        checkedKeys: [],
      }))
    }
    else {
      console.error('获取知识库数据格式错误')
    }
  }
  catch (error) {
    console.error('获取知识库数据失败', error)
  }
  finally {
    loading.value = false
  }
}

// 监听当前空间变化，重新加载知识库数据
watch(() => spaceStore.currentSpace?.id, (newSpaceId, oldSpaceId) => {
  if (newSpaceId && newSpaceId !== oldSpaceId) {
    loadKnowledgeBaseData()
  }
}, { immediate: true })

// 处理节点选中状态变更
function handleCheckChange(checkedKeys: string[], index: number) {
  data.value[index]!.checkedKeys = checkedKeys
}

const treeRef = useTemplateRef<HTMLElement[]>('treeRef')

// 处理节点点击
function handleNodeClick(file: FileTreeType, fileRoute: string[]) {
  if (file.type === 'file') {
    // 获取当前空间ID
    const currentSpaceId = spaceStore.currentSpace?.id || '1'
    // 生成符合新路由结构的路径
    const fullPath = `/group/${currentSpaceId}/knowledge-base/${file.fileType}/${file.id}`

    navigateTo(fullPath)

    // 存储当前文件路径
    useFileStore().setFileRoute(fileRoute)
  }
}

// 处理新增根文件夹
function showAddRootFolderDialog() {
  addRootFolderDialogVisible.value = true
  newRootFolderName.value = ''
}

// 提交新增根文件夹
async function submitAddRootFolder() {
  if (!newRootFolderName.value.trim()) {
    ElMessage.warning({
      message: t('knowledge_base.add_root_folder_dialog.folder_name_placeholder'),
      appContext,
    })
    return
  }

  try {
    // 由于没有实际API，我们直接在本地创建新的根文件夹数据
    const newFolder: FileTreeType = {
      id: `folder-${Date.now()}`,
      label: newRootFolderName.value.trim(),
      // type: 'folder',
      children: [],
      fileType: 'doc' as FileType,
    }

    // 添加到当前data中
    data.value.push({
      treeData: [newFolder],
      checkboxVisible: false,
      checkedKeys: [],
    })

    ElMessage.success({
      message: t('knowledge_base.add_root_folder_dialog.success'),
      appContext,
    })

    // 关闭对话框
    addRootFolderDialogVisible.value = false
  }
  catch (error) {
    console.error('创建根文件夹失败', error)
    ElMessage.error({
      message: t('knowledge_base.add_root_folder_dialog.error'),
      appContext,
    })
  }
}

// 处理新增文件夹
async function handleAddFolder(parentId: string, folderName: string) {
  try {
    // 实际项目中应该调用API创建文件夹
    // 这里模拟创建成功
    // const result = await $api.post('/api/folders', { parentId, name: folderName })

    // 模拟创建成功后的逻辑
    ElMessage.success({
      message: `成功创建文件夹：${folderName}`,
      appContext,
    })

    // 重新加载数据
    await loadKnowledgeBaseData()
  }
  catch (error) {
    console.error('创建文件夹失败', error)
    ElMessage.error({
      message: '创建文件夹失败',
      appContext,
    })
  }
}

// 处理新增文件
async function handleAddFile(_parentId: string, _templateId: string) {
  try {
    // 实际项目中应该调用API创建文件
    // 这里模拟创建成功
    // const result = await $api.post('/api/files', { parentId: _parentId, templateId: _templateId })

    // 模拟创建成功后的逻辑
    ElMessage.success({
      message: '文件创建成功',
      appContext,
    })

    // 重新加载数据
    await loadKnowledgeBaseData()
  }
  catch (error) {
    console.error('创建文件失败', error)
    ElMessage.error({
      message: '创建文件失败',
      appContext,
    })
  }
}

// 处理打开团队设置
function handleOpenTeamSetting(activeMenu: string, teamName: string) {
  // 模拟获取团队信息
  currentTeam.value = {
    id: `team-${Date.now()}`,
    name: teamName,
    description: '这是一个团队描述',
    avatar: '',
    createdTime: new Date().toISOString(),
    memberCount: 5,
  } as Team

  // 设置初始激活的标签页
  defaultActiveMenu.value = activeMenu

  // 打开团队设置弹框
  teamSettingVisible.value = true
}

// 处理节点重命名
async function handleRenameNode(_node: FileTreeType, _newName: string) {
  try {
    // 实际项目中应该调用API保存重命名
    // const result = await $api('/api/folders/rename', {
    //   method: 'POST',
    //   body: {
    //     id: _node.id,
    //     newName: _newName,
    //   }
    // })

    // 模拟成功逻辑，本地修改已经在DocTree组件中完成了
    // 这里可以添加其他逻辑如需要

    // 如果需要重新加载数据可以取消下面的注释
    // await loadKnowledgeBaseData()
  }
  catch (error) {
    console.error('重命名失败', error)
    ElMessage.error({
      message: t('knowledge_base.rename_confirm.error', { defaultValue: '重命名失败' }),
      appContext,
    })

    // 失败时重新加载数据恢复原状态
    await loadKnowledgeBaseData()
  }
}

// 更新团队信息
function updateTeamInfo(team: Team) {
  currentTeam.value = team
  // 实际项目中应该调用API更新团队信息
  // 这里只是更新本地数据
}

defineExpose({
  data,
})
</script>

<template>
  <div class="kb-tree-container">
    <div v-if="loading" class="h-full w-full flex items-center justify-center">
      <el-skeleton :rows="8" animated />
    </div>
    <div v-else>
      <!-- 添加新增根文件夹按钮 -->
      <div class="border-color mb-12px flex items-center justify-end border-b py-2">
        <el-button type="primary" size="small" text @click="showAddRootFolderDialog">
          <div class="flex items-center">
            <el-icon class="mr-1">
              <Plus />
            </el-icon>
            <span>{{ $t('knowledge_base.add_root_folder') }}</span>
          </div>
        </el-button>
      </div>

      <div v-for="(item, index) in data" :key="index">
        <DocTree
          v-if="item.treeData.length > 0"
          ref="treeRef"
          :data="item.treeData"
          :checkbox-visible="item.checkboxVisible"
          editable
          :is-team-space="spaceStore.currentSpace?.type === 'team'"
          @update:checkbox-visible="item.checkboxVisible = $event"
          @check-change="keys => handleCheckChange(keys, index)"
          @node-click="handleNodeClick"
          @add-folder="handleAddFolder"
          @add-file="handleAddFile"
          @open-team-setting="handleOpenTeamSetting"
          @rename-node="handleRenameNode"
        />
      </div>

      <!-- 团队设置弹框 -->
      <TeamSetting
        v-model="teamSettingVisible"
        :team="currentTeam"
        :default-active-menu="defaultActiveMenu"
        @update:team="updateTeamInfo"
      />

      <!-- 新增根文件夹对话框 -->
      <el-dialog
        v-model="addRootFolderDialogVisible"
        :title="$t('knowledge_base.add_root_folder_dialog.title')"
        width="30%"
        destroy-on-close
      >
        <el-form @submit.prevent="submitAddRootFolder">
          <el-form-item :label="$t('knowledge_base.add_root_folder_dialog.folder_name')">
            <el-input
              v-model="newRootFolderName"
              :placeholder="$t('knowledge_base.add_root_folder_dialog.folder_name_placeholder')"
              autofocus
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="addRootFolderDialogVisible = false">
              {{ $t('knowledge_base.cancel') }}
            </el-button>
            <el-button type="primary" @click="submitAddRootFolder">
              {{ $t('knowledge_base.confirm') }}
            </el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.kb-tree-container {
  width: 100%;
  height: 100%;
}
</style>
