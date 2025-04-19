<script setup lang="ts">
import type { FileInfo } from '~/types/file'
import { ArrowDown } from '@element-plus/icons-vue'
import UploadSourceDialog from '~/components/UploadSourceDialog.vue'
import { useFileUpload } from '~/composables/useFileUpload'
import MessageBubble from './MessageBubble.vue'
import MessageInput from './MessageInput.vue'

const { t: $t } = useI18n()

// 输入框中的文件
const attachedFiles = ref<FileInfo[]>([])

// 对话记录列表
interface Message {
  id: string
  role: 'agent' | 'user'
  content: string
  time: string
  dateTime: string
  files?: FileInfo[]
  comments?: Comment[]
  reactions?: { emoji: string, count: number }[]
  isDeleted?: boolean
  replyTo?: number
  isLiked?: boolean
  isDisliked?: boolean
}

interface Comment {
  id: string
  content: string
  time: string
  dateTime: string
}

const messages = ref<Message[]>([
  {
    id: '1',
    role: 'agent',
    content: 'hi~ 我是你的知识库问答助手，有关知识库的问题都可以问我哦~',
    time: '09:00',
    dateTime: '2025-03-31 09:00',
    reactions: [],
    comments: [],
    isLiked: false,
    isDisliked: false,
  },
  {
    id: '2',
    role: 'user',
    content: '请介绍一下人工智能的优势',
    time: '09:01',
    dateTime: '2025-03-31 09:01',
    reactions: [],
    comments: [],
    isLiked: false,
    isDisliked: false,
  },
  {
    id: '3',
    role: 'agent',
    content: '人工智能(AI)具有许多优势:\n1. 自动化处理:可以处理大量数据和执行重复任务,节省时间和人力\n2. 决策支持:能分析大量数据识别模式,做出准确决策\n3. 提高准确性:在图像识别、自然语言处理等任务中表现出高精度\n4. 24/7工作:不知疲倦地持续工作,适合制造、监控等场景',
    time: '09:02',
    dateTime: '2025-03-31 09:02',
    reactions: [],
    comments: [],
    isLiked: false,
    isDisliked: false,
  },
])

// 获取当前时间字符串
function getCurrentTime() {
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  const year = now.getFullYear()
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')

  return {
    time: `${hours}:${minutes}`,
    dateTime: `${year}-${month}-${day} ${hours}:${minutes}`,
  }
}

// 表情相关配置可以保留在这个组件中，以便更新最近使用的表情列表
const recentEmojis = ref(['👌', '✌️'])

// 当前处理的消息
const replyToMessageIndex = ref<number | null>(null)

// 添加表情反应
function addReaction(index: number, emoji: string) {
  const message = messages.value[index]
  if (!message)
    return

  if (!message.reactions) {
    message.reactions = []
  }

  const existingReaction = message.reactions.find(r => r.emoji === emoji)

  if (existingReaction) {
    existingReaction.count++
  }
  else {
    message.reactions.push({ emoji, count: 1 })
  }

  // 更新最近使用的表情
  if (!recentEmojis.value.includes(emoji)) {
    recentEmojis.value.unshift(emoji)
    if (recentEmojis.value.length > 4) {
      recentEmojis.value = recentEmojis.value.slice(0, 4)
    }
  }
}

// 生成唯一ID的函数
function generateId(): string {
  return Date.now().toString() + Math.floor(Math.random() * 10000).toString()
}

// 处理发送消息
function handleSendMessage(text: string) {
  const { time, dateTime } = getCurrentTime()
  const replyToIndex = replyToMessageIndex.value !== null ? replyToMessageIndex.value : undefined

  // 发送消息
  messages.value.push({
    id: generateId(),
    role: 'user',
    content: text,
    time,
    dateTime,
    files: attachedFiles.value.length > 0 ? [...attachedFiles.value] : undefined,
    reactions: [],
    comments: [],
    replyTo: replyToIndex, // 如果是回复，添加回复索引
    isLiked: false,
    isDisliked: false,
  })

  // 清空输入和附件
  attachedFiles.value = []

  // 清除回复状态
  if (replyToMessageIndex.value !== null) {
    replyToMessageIndex.value = null
  }

  // 模拟延迟响应
  setTimeout(() => {
    handleAgentAnswer()
  }, 1000)
}

// agent的回答
function handleAgentAnswer() {
  const { time, dateTime } = getCurrentTime()

  messages.value.push({
    id: generateId(),
    role: 'agent',
    content: '服务器繁忙，请稍后再试！',
    time,
    dateTime,
    reactions: [],
    comments: [],
    isLiked: false,
    isDisliked: false,
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
const containerRef = ref<HTMLDivElement | null>(null)
let pasteCleanup: (() => void) | null = null
const { setupPasteListener } = useFileUpload()

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

// 显示回复输入框
function showReplyInput(index: number) {
  replyToMessageIndex.value = index
}

// 确认对话框相关
const showDeleteDialog = ref(false)
const showRecallDialog = ref(false)
const messageToDeleteIndex = ref<number | null>(null)
const messageToRecallIndex = ref<number | null>(null)

// 显示删除确认对话框
function showDeleteConfirm(index: number) {
  messageToDeleteIndex.value = index
  showDeleteDialog.value = true
}

// 确认删除消息
function confirmDelete() {
  if (messageToDeleteIndex.value !== null) {
    const message = messages.value[messageToDeleteIndex.value]
    if (message) {
      message.isDeleted = true
    }
    messageToDeleteIndex.value = null
  }
  showDeleteDialog.value = false
}

// 显示撤回确认对话框
function showRecallConfirm(index: number) {
  messageToRecallIndex.value = index
  showRecallDialog.value = true
}

// 确认撤回消息
function confirmRecall() {
  if (messageToRecallIndex.value !== null) {
    const message = messages.value[messageToRecallIndex.value]
    if (message) {
      message.isDeleted = true
    }
    messageToRecallIndex.value = null
  }
  showRecallDialog.value = false
}

// 处理点赞
function handleLike(messageId: string) {
  if (!messageId)
    return

  const msgIndex = messages.value.findIndex(msg => msg.id === messageId)
  if (msgIndex !== -1) {
    const message = messages.value[msgIndex]
    if (!message)
      return

    // 设置反馈状态
    if (message.isDisliked) {
      message.isDisliked = false
    }
    message.isLiked = !message.isLiked

    ElMessage.success(`${message.isLiked ? '点赞' : '取消点赞'}成功`)
  }
}

// 处理踩
function handleDislike(messageId: string) {
  if (!messageId)
    return

  const msgIndex = messages.value.findIndex(msg => msg.id === messageId)
  if (msgIndex !== -1) {
    const message = messages.value[msgIndex]
    if (!message)
      return

    // 设置反馈状态
    if (message.isLiked) {
      message.isLiked = false
    }
    message.isDisliked = !message.isDisliked

    ElMessage.success(`${message.isDisliked ? '反馈已提交' : '取消反馈'}成功`)
  }
}

// 处理复制
function handleCopy(message: string) {
  // 复制逻辑在组件中已处理，这里只需要处理额外的业务逻辑
  // 例如：记录用户复制行为、发送分析数据等
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
            <MessageBubble
              v-for="(msg, index) in messages"
              :key="index"
              :role="msg.role"
              :content="msg.content"
              :date-time="msg.dateTime"
              :message-id="msg.id"
              :files="msg.files"
              :comments="msg.comments"
              :reactions="msg.reactions"
              :is-deleted="msg.isDeleted"
              :reply-to-content="msg.replyTo !== undefined ? messages[msg.replyTo]?.content : undefined"
              :recent-emojis="recentEmojis"
              :is-liked="msg.isLiked"
              :is-disliked="msg.isDisliked"
              @reaction="(emoji) => addReaction(index, emoji)"
              @reply="showReplyInput(index)"
              @delete="showDeleteConfirm(index)"
              @recall="showRecallConfirm(index)"
              @file-click="handleFileClick"
              @like="handleLike"
              @dislike="handleDislike"
              @copy="handleCopy"
            />
          </div>
        </div>

        <!-- 删除确认对话框 -->
        <el-dialog
          v-model="showDeleteDialog"
          title="确定要移除发言吗?"
          width="380px"
        >
          <span>移除后所有人都不能看到此发言的内容了</span>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="showDeleteDialog = false">取消</el-button>
              <el-button type="primary" @click="confirmDelete">确定</el-button>
            </span>
          </template>
        </el-dialog>

        <!-- 撤回确认对话框 -->
        <el-dialog
          v-model="showRecallDialog"
          title="确定要撤回发言吗?"
          width="380px"
        >
          <span>撤回后所有人都不能看到此发言的内容了</span>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="showRecallDialog = false">取消</el-button>
              <el-button type="primary" @click="confirmRecall">确定</el-button>
            </span>
          </template>
        </el-dialog>

        <!-- 在这里输入 -->
        <div class="input-container-wrapper">
          <div ref="containerRef" class="input-container">
            <MessageInput
              :reply-to-message="replyToMessageIndex !== null ? messages[replyToMessageIndex]?.content : ''"
              :attached-files="attachedFiles"
              :placeholder="$t('agents.qa.input_placeholder')"
              :send-button-text="$t('agents.qa.send')"
              @send="handleSendMessage"
              @cancel-reply="replyToMessageIndex = null"
              @open-upload="openUploadDialog"
              @remove-file="removeFile"
            />
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

.input-container-wrapper {
  padding: 0 40px 40px;
  margin-top: 16px;
}

.input-container {
  max-width: 980px;
  margin: 0 auto;
  width: 100%;
}
</style>

<style>
/* 全局样式，让表情选择器样式正确渲染 */
.emoji-popover .el-popover__title {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 8px;
}
</style>
