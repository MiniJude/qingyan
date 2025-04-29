<script setup lang="ts">
import type { Component, ShallowRef } from 'vue'

// 接收弹框显示状态
interface Props {
  /** 弹框是否可见 */
  modelValue: boolean
  /** 默认选中的类型 */
  defaultType?: string
  /** 是否隐藏左侧标签栏 */
  hideLeftTabs?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  defaultType: 'all',
  hideLeftTabs: false,
})
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'selectTemplate', template: Template): void
}>()

const { t } = useI18n()
const { isMobileDevice } = useDeviceDetection()

// 对话框可见性的计算属性
const dialogVisible = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})

// 当前选中的菜单
const activeMenu = ref(props.defaultType)

// 监听默认类型变化
watch(() => props.defaultType, (newType) => {
  if (newType && dialogVisible.value) {
    activeMenu.value = newType
  }
})

// 监听弹窗打开，设置默认类型
watch(() => dialogVisible.value, (isOpen) => {
  if (isOpen && props.defaultType) {
    activeMenu.value = props.defaultType
  }
})

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
    const { data } = await useFetch<Template[]>('/templates')
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
  if (activeMenu.value === 'all') {
    return templates.value
  }
  return templates.value.filter(template => template.file_type === activeMenu.value)
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

// 菜单列表 - 使用 MenuSplitContent 组件所需的格式
const menuList = computed(() => {
  const menus = [
    {
      key: 'all',
      icon: getIconClass('all'),
      name: t('knowledge_base.template.all'),
    },
    {
      key: 'md',
      icon: getIconClass('md'),
      name: t('knowledge_base.template.markdown'),
    },
    {
      key: 'mind',
      icon: getIconClass('mind'),
      name: t('knowledge_base.template.mind'),
    },
    {
      key: 'flow',
      icon: getIconClass('flow'),
      name: t('knowledge_base.template.flow'),
    },
    {
      key: 'ai-rich',
      icon: getIconClass('ai-rich'),
      name: t('knowledge_base.template.ai_doc'),
    },
    {
      key: 'rich',
      icon: getIconClass('rich'),
      name: t('knowledge_base.template.online_doc'),
    },
    {
      key: 'word',
      icon: getIconClass('word'),
      name: t('knowledge_base.template.word'),
    },
    {
      key: 'powerpoint',
      icon: getIconClass('powerpoint'),
      name: t('knowledge_base.template.powerpoint'),
    },
    {
      key: 'excel',
      icon: getIconClass('excel'),
      name: t('knowledge_base.template.excel'),
    },
    {
      key: 'folder',
      icon: getIconClass('folder'),
      name: t('knowledge_base.template.new_folder'),
    },
    {
      key: 'upload',
      icon: getIconClass('upload'),
      name: t('knowledge_base.template.upload'),
    },
  ]

  return menus
})
</script>

<template>
  <ClientOnly>
    <el-dialog
      v-model="dialogVisible"
      width="1200px"
      :title="$t('knowledge_base.index.template_library')"
      class="template-library-dialog"
      :close-on-click-modal="false"
      :before-close="() => dialogVisible = false"
      :fullscreen="isMobileDevice"
    >
      <MenuSplitContent
        v-model="activeMenu"
        :menu-list="menuList"
        content-height="650px"
        label-width="210px"
        :show-menu="!hideLeftTabs"
      >
        <template #default="{ activeMenu: currentActiveMenu }">
          <!-- 上传文档界面 -->
          <template v-if="currentActiveMenu === 'upload'">
            <FileUploadPanel
              :folders="uploadFolders"
            />
          </template>

          <!-- 模板展示区域 -->
          <template v-else>
            <!-- 模板网格 -->
            <div class="grid grid-cols-4 gap-24px lt-lg:grid-cols-2 lt-md:grid-cols-1 lt-xl:grid-cols-3">
              <div
                v-for="template in filteredTemplates"
                :key="template.id"
                class="group hover:border-primary-light-8 relative cursor-pointer overflow-hidden border border-gray-200 rounded-8px border-solid bg-overlay shadow-sm transition-all duration-300 hover:translate-y--2px dark:border-gray-9 hover:shadow"
              >
                <!-- 模板标题和描述 -->
                <div class="px-16px py-12px">
                  <h3 class="truncate text-16px font-medium">
                    {{ template.title }}
                  </h3>
                </div>
                <!-- 模板预览图 -->
                <div class="relative p-12px pt-0px">
                  <div class="relative h-200px overflow-hidden rounded-4px lt-md:h-240px">
                    <img
                      :src="`https://static.writebug.com/static${template.image}`"
                      alt=""
                      class="h-full w-full object-cover"
                    >
                    <!-- 悬停时显示的使用按钮 -->
                    <div class="absolute inset-0 flex flex-col items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 lt-md:opacity-100">
                      <div class="mb-16px h-40px w-40px" :class="getIconClass(template.file_type)" />
                      <el-button
                        type="primary"
                        class="transform transition-transform duration-200 hover:scale-105"
                        @click.stop="selectTemplate(template)"
                      >
                        {{ $t('knowledge_base.template.use') }}
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
        </template>
      </MenuSplitContent>
    </el-dialog>
  </ClientOnly>
</template>

<style lang="scss" scoped>
.template-library-dialog {
  :deep(.el-dialog__body) {
    padding: 0;
  }
}
</style>
