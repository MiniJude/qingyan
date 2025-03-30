<script setup lang="ts">
import { Plus, Upload } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import FileUploadPanel from './FileUploadPanel.vue'

// 接收弹框显示状态
interface Props {
  /** 弹框是否可见 */
  modelValue: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'selectTemplate'])

const { t } = useI18n()

// 对话框可见性的计算属性
const dialogVisible = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})

// 类型菜单数据
const typeMenus = [
  {
    title: t('knowledge_base.template.all'),
    type: 'document',
    file_type: 'all',
  },
  {
    title: t('knowledge_base.template.markdown'),
    type: 'document',
    file_type: 'md',
  },
  {
    title: t('knowledge_base.template.mind'),
    type: 'document',
    file_type: 'mind',
  },
  {
    title: t('knowledge_base.template.flow'),
    type: 'document',
    file_type: 'flow',
  },
  {
    title: t('knowledge_base.template.ai_doc'),
    type: 'document',
    file_type: 'ai-rich',
  },
  {
    title: t('knowledge_base.template.online_doc'),
    type: 'document',
    file_type: 'rich',
  },
  {
    title: t('knowledge_base.template.word'),
    type: 'document',
    file_type: 'word',
  },
  {
    title: t('knowledge_base.template.powerpoint'),
    type: 'document',
    file_type: 'powerpoint',
  },
  {
    title: t('knowledge_base.template.excel'),
    type: 'document',
    file_type: 'excel',
  },
  {
    title: t('knowledge_base.template.new_folder'),
    type: 'document',
    file_type: 'folder',
  },
  {
    title: t('knowledge_base.template.upload'),
    type: 'document',
    file_type: 'upload',
  },
]

// 当前选中的类型
const activeType = ref('all')

// 切换类型
function switchType(fileType: string) {
  activeType.value = fileType
}

// 获取图标
function getIconClass(fileType: string) {
  const iconMap: Record<string, string> = {
    'all': 'i-twemoji:blue-square',
    'md': 'i-twemoji:bookmark-tabs',
    'mind': 'i-twemoji:thought-balloon',
    'flow': 'i-carbon:flow',
    'ai-rich': 'i-carbon:ai-status',
    'rich': 'i-carbon:document-blank',
    'word': 'i-twemoji:memo',
    'powerpoint': 'i-carbon:presentation-file',
    'excel': 'i-twemoji:books',
    'folder': 'i-carbon:folder',
    'upload': 'i-carbon:upload',
  }
  return iconMap[fileType] || 'i-carbon:document'
}

// 模拟模板数据
const templates = ref<Template[]>([])

async function fetchTemplates() {
  try {
    const { data } = await useFetch<Template[]>('/api/templates')
    if (data.value) {
      templates.value = data.value
    }
  }
  catch (error) {
    console.error('Failed to fetch templates:', error)
    // 可以添加错误处理，比如显示错误消息
  }
}

// 页面加载时获取模板数据
fetchTemplates()

// 根据当前选择的类型筛选模板
const filteredTemplates = computed(() => {
  if (activeType.value === 'all') {
    return templates.value
  }
  return templates.value.filter(template => template.file_type === activeType.value)
})

// 选择模板并关闭对话框
function selectTemplate(template: Template) {
  emit('selectTemplate', template)
  dialogVisible.value = false
}

// 文件上传相关
const uploadFolders = [
  { label: '默认文件夹', value: 'default' },
  { label: '我的文档', value: 'documents' },
  { label: '项目资料', value: 'projects' },
]
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    width="1200px"
    :title="$t('knowledge_base.index.template_library')"
    class="template-library-dialog"
    :close-on-click-modal="false"
    :before-close="() => dialogVisible = false"
  >
    <div class="h-650px flex">
      <!-- 左侧类型菜单 -->
      <div class="w-200px flex flex-col gap-4px overflow-y-auto">
        <div
          v-for="menu in typeMenus"
          :key="menu.file_type"
          class="mx-4px cursor-pointer rounded-4px p-14px transition-all duration-300"
          :class="activeType === menu.file_type ? 'bg-primary-light-8 font-500 text-primary' : 'hover:bg-primary-light-9'"
          @click="switchType(menu.file_type)"
        >
          <div class="flex items-center">
            <div class="mr-10px h-20px w-20px" :class="getIconClass(menu.file_type)" />
            <span>{{ menu.title }}</span>
          </div>
        </div>
      </div>

      <!-- 右侧内容区域 -->
      <div class="flex-1 overflow-y-auto p-20px">
        <!-- 上传文档界面 -->
        <template v-if="activeType === 'upload'">
          <FileUploadPanel
            :folders="uploadFolders"
          />
        </template>

        <!-- 模板展示区域 -->
        <template v-else>
          <h2 class="mb-20px text-18px font-bold">
            {{ typeMenus.find(menu => menu.file_type === activeType)?.title }}
          </h2>

          <!-- 模板网格 -->
          <div class="grid grid-cols-4 gap-24px">
            <div
              v-for="template in filteredTemplates"
              :key="template.id"
              class="group hover:border-primary-light-8 relative cursor-pointer overflow-hidden border border-gray-200 rounded-8px border-solid bg-overlay shadow-sm transition-all duration-300 hover:translate-y--2px hover:shadow"
            >
              <!-- 模板标题和描述 -->
              <div class="px-16px py-12px">
                <h3 class="truncate text-16px font-medium">
                  {{ template.title }}
                </h3>
              </div>
              <!-- 模板预览图 -->
              <div class="relative p-12px pt-0px">
                <div class="relative h-200px overflow-hidden rounded-4px">
                  <img
                    :src="`https://static.writebug.com/static${template.image}`"
                    alt=""
                    class="h-full w-full object-cover"
                  >
                  <!-- 悬停时显示的使用按钮 -->
                  <div class="absolute inset-0 flex flex-col items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div class="mb-16px h-40px w-40px" :class="getIconClass(template.file_type)" />
                    <el-button
                      type="primary"
                      class="transform transition-transform duration-200 hover:scale-105"
                      @click.stop="selectTemplate(template)"
                    >
                      使用
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 无结果提示 -->
          <div v-if="filteredTemplates.length === 0" class="py-40px text-center text-gray-500">
            {{ $t('common.messages.no_templates') }}
          </div>
        </template>
      </div>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
.template-library-dialog {
  :deep(.el-dialog__body) {
    padding: 0;
  }
}
</style>
