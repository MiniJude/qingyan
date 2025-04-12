<script setup lang="ts">
import type { ElInput } from 'element-plus'
import type { FileInfo } from '~/types/file'
import { ArrowDown } from '@element-plus/icons-vue'
import { useFileUpload } from '~/composables/useFileUpload'

const { t } = useI18n()

const input = ref('')
const { handleFileSelect, setupPasteListener } = useFileUpload()

// 输入框中的文件
const attachedFiles = ref<FileInfo[]>([])

// 对话记录列表
interface Message {
  role: 'agent' | 'user'
  content: string
  time: string
  files?: FileInfo[]
}

const messages = ref<Message[]>([
  {
    role: 'agent',
    content: 'hi~ 我是你的知识库问答助手，有关知识库的问题都可以问我哦~',
    time: '09:00',
  },
  {
    role: 'user',
    content: '请介绍一下人工智能的优势',
    time: '09:01',
  },
  {
    role: 'agent',
    content: '人工智能(AI)具有许多优势:\n1. 自动化处理:可以处理大量数据和执行重复任务,节省时间和人力\n2. 决策支持:能分析大量数据识别模式,做出准确决策\n3. 提高准确性:在图像识别、自然语言处理等任务中表现出高精度\n4. 24/7工作:不知疲倦地持续工作,适合制造、监控等场景',
    time: '09:02',
  },
])

// 获取当前时间字符串
function getCurrentTime() {
  const now = new Date()
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
}

// 处理发送消息
function handleSend() {
  // 检查是否有文本或文件
  if (!input.value && attachedFiles.value.length === 0) {
    ElMessage.warning(t('agents.qa.input_placeholder'))
    return
  }

  // 发送消息
  messages.value.push({
    role: 'user',
    content: input.value,
    time: getCurrentTime(),
    files: attachedFiles.value.length > 0 ? [...attachedFiles.value] : undefined,
  })

  // 清空输入和附件
  input.value = ''
  attachedFiles.value = []

  // 模拟延迟响应
  setTimeout(() => {
    handleAgentAnswer()
  }, 1000)
}

// agent的回答
function handleAgentAnswer() {
  messages.value.push({
    role: 'agent',
    content: '服务器繁忙，请稍后再试！',
    time: getCurrentTime(),
  })
}

// 处理文件上传
async function handleUploadFile() {
  try {
    const files = await handleFileSelect()
    if (files.length > 0) {
      attachedFiles.value.push(...files)
    }
  }
  catch (error) {
    console.error('文件上传失败:', error)
    ElMessage.error('文件上传失败')
  }
}

// 移除已上传文件
function removeFile(fileId: string) {
  const index = attachedFiles.value.findIndex(f => f.id === fileId)
  if (index !== -1) {
    attachedFiles.value.splice(index, 1)
  }
}

// 文件点击处理
function handleFileClick(file: FileInfo) {
  if (file.url) {
    window.open(file.url, '_blank')
  }
}

// 设置粘贴监听
const inputRef = ref<InstanceType<typeof ElInput> | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)
let pasteCleanup: (() => void) | null = null

// 在mounted中设置粘贴监听
onMounted(() => {
  // 使用nextTick确保组件已完全渲染
  nextTick(() => {
    setupPasteListeners()
  })
})

// 如果组件更新，也需要重新设置监听器
onUpdated(() => {
  // 清理旧的监听器
  if (pasteCleanup) {
    pasteCleanup()
    pasteCleanup = null
  }

  // 设置新的监听器
  nextTick(() => {
    setupPasteListeners()
  })
})

// 组件卸载时清理
onBeforeUnmount(() => {
  if (pasteCleanup) {
    pasteCleanup()
    pasteCleanup = null
  }
})

// 设置粘贴监听器的函数
function setupPasteListeners() {
  // 先尝试在输入框上设置
  if (inputRef.value) {
    try {
      pasteCleanup = setupPasteListener(inputRef.value, handlePastedFiles)
      return
    }
    catch (error) {
      console.warn('在输入框设置粘贴监听器失败，将尝试在容器上设置', error)
    }
  }

  // 如果输入框设置失败，尝试在容器上设置
  if (containerRef.value) {
    try {
      pasteCleanup = setupPasteListener(containerRef.value, handlePastedFiles)
      return
    }
    catch (error) {
      console.warn('在容器设置粘贴监听器失败，将尝试在文档上设置', error)
    }
  }

  // 如果都失败了，在文档上设置（全局）
  try {
    pasteCleanup = setupPasteListener(document, handlePastedFiles)
  }
  catch (error) {
    console.error('设置粘贴监听器失败', error)
  }
}

// 处理粘贴的文件
function handlePastedFiles(files: FileInfo[]) {
  if (files.length > 0) {
    attachedFiles.value.push(...files)
    ElMessage.success(`成功粘贴${files.length}个文件`)
  }
}
</script>

<template>
  <div class="flex flex-col">
    <div class="agent-header" h-80px flex items-center justify-between pl-37px pr-53px>
      <div class="flex items-center gap-8px">
        <img width="48" src="@/assets/img/logo-icon.png" alt="">
        <span class="text-20px text-tprimary">{{ $t('agents.kb_qa_assistant.name') }}</span>
      </div>
      <div class="flex items-center gap-20px text-20px" style="color: #4E5969;">
        <SvgoNotice class="cursor-pointer" />
        <SvgoClear class="cursor-pointer" />
        <SvgoInfo class="cursor-pointer" />
      </div>
    </div>

    <div class="agent-content min-h-0 flex flex-1 flex-col items-center">
      <div class="mt-43px flex items-center justify-center gap-17px text-14px" style="color: #86909C;">
        <span>{{ $t('agents.qa.date') }}</span>
        <el-icon class="cursor-pointer">
          <ArrowDown />
        </el-icon>
      </div>
      <div class="min-h-0 w-1060px flex flex-1 flex-col gap-24px overflow-y-auto">
        <!-- 这里是对话记录 -->
        <div class="min-h-0 flex flex-1 flex-col gap-16px overflow-y-auto pt-23px">
          <template v-for="(msg, index) in messages" :key="index">
            <!-- 用户对话框 -->
            <div v-if="msg.role === 'user'" class="w-full flex flex-row-reverse items-start gap-20px">
              <img width="40" src="@/assets/img/avatar.png" alt="">
              <div class="msg-box bg-white text-right dark:bg-black">
                <!-- 用户发送文件 -->
                <div v-if="msg.files && msg.files.length > 0" class="files-container">
                  <FileCard
                    v-for="file in msg.files"
                    :key="file.id"
                    :file="file"
                    clickable
                    @click="handleFileClick(file)"
                  />
                </div>
                <!-- 用户文字内容 -->
                <div v-if="msg.content" class="mt-2" style="white-space: pre-wrap;">
                  {{ msg.content }}
                </div>
              </div>
            </div>
            <!-- 智能体对话框 -->
            <div v-else class="w-full flex items-start gap-20px">
              <img width="40" src="@/assets/img/logo-icon.png" alt="">
              <div class="msg-box bg-white dark:bg-black">
                <!-- 智能体文字内容 -->
                <div style="white-space: pre-wrap;">
                  {{ msg.content }}
                </div>
                <!-- 智能体发送文件 -->
                <div v-if="msg.files && msg.files.length > 0" class="files-container mt-2">
                  <FileCard
                    v-for="file in msg.files"
                    :key="file.id"
                    :file="file"
                    clickable
                    @click="handleFileClick(file)"
                  />
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- 在这里输入 -->
        <div class="input-container">
          <!-- 显示已上传文件 -->
          <div v-if="attachedFiles.length > 0" class="attached-files mb-2">
            <FileCard
              v-for="file in attachedFiles"
              :key="file.id"
              :file="file"
              :removable="true"
              @remove="removeFile"
            />
          </div>
          <!-- 文本输入区域 -->
          <div ref="containerRef" class="h-54px flex items-center">
            <div class="upload-btn" @click="handleUploadFile">
              <div class="i-carbon:add" />
            </div>
            <el-input
              ref="inputRef"
              v-model="input"
              class="h-full flex-1"
              :placeholder="$t('agents.qa.input_placeholder')"
            />
            <el-button type="primary" size="large" class="w-192px !h-full" @click="handleSend">
              {{ $t('agents.qa.send') }}
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.agent-header {
  border-bottom: 1px solid var(--app-border-regular);
}

.agent-content {
  padding: 13px 141px 46px 154px;
}

.msg-box {
  border-radius: 4px;
  box-shadow: 14px 27px 45px 4px rgba(102, 81, 240, 0.08);
  padding: 20px;
  width: 940px;
}

.files-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.attached-files {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.upload-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
  background-color: white;
  border-radius: 4px 0 0 4px;
  border: 1px solid #dcdfe6;
  border-right: none;
  cursor: pointer;

  &:hover {
    background-color: #f5f7fa;
  }

  .dark & {
    background-color: #141414;
    border-color: #4c4d4f;

    &:hover {
      background-color: #18181a;
    }
  }
}

.input-container {
  width: 100%;
}
</style>
