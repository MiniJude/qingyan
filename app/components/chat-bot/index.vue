<script setup lang="ts">
import type { ElInput } from 'element-plus'
import type { FileInfo } from '~/types/file'
import { ArrowDown } from '@element-plus/icons-vue'
import UploadSourceDialog from '~/components/UploadSourceDialog.vue'
import { useFileUpload } from '~/composables/useFileUpload'

const { t } = useI18n()

const input = ref('')
const { setupPasteListener } = useFileUpload()

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

// 文件点击处理
function handleFileClick(file: FileInfo) {
  if (file.url) {
    // 对于txt文件，使用特殊处理以解决编码问题
    if (file.name.toLowerCase().endsWith('.txt')) {
      handleTextFile(file)
      return
    }
    // 其他文件类型直接打开
    window.open(file.url, '_blank')
  }
}

// 处理文本文件，解决编码问题
async function handleTextFile(file: FileInfo) {
  if (!file.url)
    return

  try {
    // 获取文本内容
    const response = await fetch(file.url)
    const blob = await response.blob()

    // 使用FileReader正确处理编码
    const reader = new FileReader()
    reader.onload = function (e) {
      if (e.target?.result) {
        // 创建一个新的blob，明确指定为utf-8编码
        const textContent = e.target.result as string
        const utf8Blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' })
        const url = URL.createObjectURL(utf8Blob)

        // 新窗口打开
        window.open(url, '_blank')
      }
    }
    // 以文本形式读取文件
    reader.readAsText(blob, 'utf-8')
  }
  catch (error) {
    console.error('打开文本文件出错:', error)
    ElMessage.error('无法打开文本文件')
  }
}

// 上传选择对话框
const uploadDialogRef = ref<InstanceType<typeof UploadSourceDialog> | null>(null)

// 打开上传对话框
function openUploadDialog() {
  uploadDialogRef.value?.open()
}

// 处理上传选择
function handleUploadSelect(selection: { source: string, files: any[] }) {
  if (selection.files && selection.files.length > 0) {
    attachedFiles.value.push(...selection.files)
  }
}

// 处理上传取消
function handleUploadCancel() {
  // 处理取消逻辑
}

// 移除已上传文件
function removeFile(fileId: string) {
  const index = attachedFiles.value.findIndex(f => f.id === fileId)
  if (index !== -1) {
    attachedFiles.value.splice(index, 1)
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
  <div class="h-full w-full flex flex-col">
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

    <div class="agent-content min-h-0 flex flex-1 flex-col">
      <div class="date-display mb-4 mt-43px flex items-center justify-center gap-17px text-14px" style="color: #86909C;">
        <span>{{ $t('agents.qa.date') }}</span>
        <el-icon class="cursor-pointer">
          <ArrowDown />
        </el-icon>
      </div>

      <!-- 内容容器 -->
      <div class="chat-container">
        <!-- 可滚动的对话区域，保持内容居中而滚动条靠右 -->
        <div class="chat-messages-wrapper">
          <div class="chat-messages">
            <template v-for="(msg, index) in messages" :key="index">
              <!-- 用户对话框 -->
              <div v-if="msg.role === 'user'" class="message-row user-message-row">
                <img width="40" src="@/assets/img/avatar.png" alt="" class="avatar">
                <div class="message-container user-message">
                  <!-- 用户发送文件 -->
                  <div v-if="msg.files && msg.files.length > 0" class="files-container mb-2">
                    <FileCard
                      v-for="file in msg.files"
                      :key="file.id"
                      :file="file"
                      clickable
                      @click="handleFileClick(file)"
                    />
                  </div>
                  <!-- 用户文字内容 -->
                  <div v-if="msg.content" class="msg-bubble">
                    {{ msg.content }}
                  </div>
                </div>
              </div>
              <!-- 智能体对话框 -->
              <div v-else class="message-row agent-message-row">
                <img width="40" src="@/assets/img/logo-icon.png" alt="" class="avatar">
                <div class="message-container agent-message">
                  <!-- 智能体文字内容 -->
                  <div v-if="msg.content" class="msg-bubble">
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
        </div>

        <!-- 在这里输入 -->
        <div class="input-container-wrapper">
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
            <div ref="containerRef" class="input-area-wrapper h-54px">
              <div class="upload-btn-wrapper">
                <div class="upload-btn" @click="openUploadDialog">
                  <div class="i-carbon:add" />
                </div>
              </div>
              <el-input
                ref="inputRef"
                v-model="input"
                class="h-full flex-1"
                :placeholder="$t('agents.qa.input_placeholder')"
              />
              <el-button type="primary" size="large" class="send-btn" @click="handleSend">
                {{ $t('agents.qa.send') }}
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 上传选择对话框 -->
    <UploadSourceDialog
      ref="uploadDialogRef"
      @select="handleUploadSelect"
      @cancel="handleUploadCancel"
    />
  </div>
</template>

<style lang="scss" scoped>
.agent-header {
  border-bottom: 1px solid var(--app-border-regular);
}

.agent-content {
  height: calc(100vh - 80px); // 减去头部高度
  overflow: hidden; // 避免整体出现滚动条
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: calc(100% - 80px); // 减去日期显示区域高度
  position: relative;
}

.chat-messages-wrapper {
  flex: 1;
  overflow-y: auto;
  width: 100%;
  padding: 0 40px; // 左右留出空间
  scrollbar-width: thin; // Firefox支持

  // 自定义滚动条样式
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }
}

.chat-messages {
  max-width: 980px; // 控制最大宽度
  margin: 0 auto; // 居中显示
  padding: 23px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-row {
  display: flex;
  gap: 20px;
  width: 100%;

  .avatar {
    align-self: flex-start;
  }
}

.user-message-row {
  flex-direction: row-reverse;
}

.agent-message-row {
  flex-direction: row;
}

.message-container {
  max-width: 80%;
  display: flex;
  flex-direction: column;
}

.user-message {
  align-items: flex-end;
}

.agent-message {
  align-items: flex-start;
}

.msg-bubble {
  display: inline-block;
  padding: 12px 16px;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
  word-break: break-word;
  white-space: pre-wrap;
  max-width: 100%;

  .dark & {
    background-color: #1a1a1a;
  }
}

.files-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 100%;
}

.input-container-wrapper {
  padding: 0 40px 40px;
  margin-top: 16px;
}

.input-container {
  max-width: 980px;
  margin: 0 auto;
  width: 100%;
}

.attached-files {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.input-area-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;
}

.upload-btn-wrapper {
  position: relative;
  margin-right: 10px;
}

.upload-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background-color: white;
  border-radius: 50%;
  border: 1px solid #dcdfe6;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: #f5f7fa;
    transform: scale(1.05);
  }

  .dark & {
    background-color: #141414;
    border-color: #4c4d4f;

    &:hover {
      background-color: #18181a;
    }
  }

  .i-carbon\\:add {
    font-size: 24px;
    color: var(--el-color-primary);
  }
}

.send-btn {
  width: 192px;
  height: 54px;
}
</style>
