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
  dateTime: string
  files?: FileInfo[]
  comments?: Comment[]
  reactions?: { emoji: string, count: number }[]
  isDeleted?: boolean
}

interface Comment {
  id: string
  content: string
  time: string
  dateTime: string
}

const messages = ref<Message[]>([
  {
    role: 'agent',
    content: 'hi~ 我是你的知识库问答助手，有关知识库的问题都可以问我哦~',
    time: '09:00',
    dateTime: '2025-03-31 09:00',
    reactions: [],
    comments: [],
  },
  {
    role: 'user',
    content: '请介绍一下人工智能的优势',
    time: '09:01',
    dateTime: '2025-03-31 09:01',
    reactions: [],
    comments: [],
  },
  {
    role: 'agent',
    content: '人工智能(AI)具有许多优势:\n1. 自动化处理:可以处理大量数据和执行重复任务,节省时间和人力\n2. 决策支持:能分析大量数据识别模式,做出准确决策\n3. 提高准确性:在图像识别、自然语言处理等任务中表现出高精度\n4. 24/7工作:不知疲倦地持续工作,适合制造、监控等场景',
    time: '09:02',
    dateTime: '2025-03-31 09:02',
    reactions: [],
    comments: [],
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

// 处理发送消息
function handleSend() {
  // 检查是否有文本或文件
  if (!input.value && attachedFiles.value.length === 0) {
    ElMessage.warning(t('agents.qa.input_placeholder'))
    return
  }

  const { time, dateTime } = getCurrentTime()

  // 发送消息
  messages.value.push({
    role: 'user',
    content: input.value,
    time,
    dateTime,
    files: attachedFiles.value.length > 0 ? [...attachedFiles.value] : undefined,
    reactions: [],
    comments: [],
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
  const { time, dateTime } = getCurrentTime()

  messages.value.push({
    role: 'agent',
    content: '服务器繁忙，请稍后再试！',
    time,
    dateTime,
    reactions: [],
    comments: [],
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

// 最近使用的表情
const recentEmojis = ref(['👌', '✌️'])

// 表情相关
const emojis = [
  '👌',
  '✌️',
  '👍',
  '🔥',
  '👏',
  '👋',
  '🤝',
  '😀',
  '😄',
  '😝',
  '😂',
  '🤔',
  '😎',
  '🎁',
  '👀',
  '😮',
  '😍',
  '🤯',
  '🤡',
  '🤬',
  '😢',
  '🤩',
  '😱',
  '😵',
  '😰',
  '🤒',
  '🤕',
  '😭',
  '😇',
  '💩',
  '✅',
  '🎉',
  '🎂',
  '❤️',
  '💯',
  '+1',
  '❌',
  '👎',
  '🐷',
  '🙈',
]

// 当前处理的消息
const commentInput = ref('')
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

// 发送评论
function sendComment() {
  if (replyToMessageIndex.value === null || !commentInput.value.trim())
    return

  const { time, dateTime } = getCurrentTime()
  const message = messages.value[replyToMessageIndex.value]
  if (!message)
    return

  if (!message.comments) {
    message.comments = []
  }

  message.comments.push({
    id: Date.now().toString(),
    content: commentInput.value,
    time,
    dateTime,
  })

  commentInput.value = ''
  replyToMessageIndex.value = null
}

// 显示回复输入框
function showReplyInput(index: number) {
  replyToMessageIndex.value = index
}

// 关闭回复输入框
function closeReplyInput() {
  replyToMessageIndex.value = null
  commentInput.value = ''
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
                  <!-- 消息时间 -->
                  <div class="message-time">
                    {{ msg.dateTime }}
                  </div>

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

                  <!-- 显示评论 -->
                  <div v-if="msg.comments && msg.comments.length > 0" class="comments-container mb-2">
                    <div v-for="comment in msg.comments" :key="comment.id" class="comment">
                      <div class="comment-content">
                        {{ comment.content }}
                      </div>
                      <div class="comment-time">
                        {{ comment.time }}
                      </div>
                    </div>
                  </div>

                  <!-- 用户文字内容 -->
                  <div v-if="msg.content && !msg.isDeleted" class="msg-bubble-container">
                    <div class="msg-bubble user-bubble">
                      {{ msg.content }}
                    </div>
                    <!-- 悬浮操作栏 -->
                    <div class="msg-actions user-actions">
                      <el-popover
                        placement="bottom"
                        :width="350"
                        trigger="click"
                        popper-class="emoji-popover"
                      >
                        <template #reference>
                          <div class="action-btn">
                            😀
                          </div>
                        </template>
                        <!-- 表情选择内容 -->
                        <div class="emoji-content">
                          <div class="emoji-section">
                            <div class="emoji-section-title">
                              最近使用
                            </div>
                            <div class="emoji-grid">
                              <div
                                v-for="emoji in recentEmojis"
                                :key="emoji"
                                class="emoji-item"
                                @click="addReaction(index, emoji)"
                              >
                                {{ emoji }}
                              </div>
                            </div>
                          </div>
                          <div class="emoji-section">
                            <div class="emoji-section-title">
                              默认表情
                            </div>
                            <div class="emoji-grid">
                              <div
                                v-for="emoji in emojis"
                                :key="emoji"
                                class="emoji-item"
                                @click="addReaction(index, emoji)"
                              >
                                {{ emoji }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </el-popover>
                      <div class="action-btn" @click="showReplyInput(index)">
                        💬
                      </div>
                      <div class="action-btn" @click="showRecallConfirm(index)">
                        ↩️
                      </div>
                    </div>
                  </div>

                  <!-- 已撤回消息 -->
                  <div v-if="msg.isDeleted" class="deleted-message">
                    此消息已被撤回
                  </div>

                  <!-- 表情反应 -->
                  <div v-if="msg.reactions && msg.reactions.length > 0" class="reactions-container">
                    <div v-for="(reaction, rIndex) in msg.reactions" :key="rIndex" class="reaction">
                      {{ reaction.emoji }} {{ reaction.count }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- 智能体对话框 -->
              <div v-else class="message-row agent-message-row">
                <img width="40" src="@/assets/img/logo-icon.png" alt="" class="avatar">
                <div class="message-container agent-message">
                  <!-- 消息时间 -->
                  <div class="message-time">
                    {{ msg.dateTime }}
                  </div>

                  <!-- 显示评论 -->
                  <div v-if="msg.comments && msg.comments.length > 0" class="comments-container mb-2">
                    <div v-for="comment in msg.comments" :key="comment.id" class="comment">
                      <div class="comment-content">
                        {{ comment.content }}
                      </div>
                      <div class="comment-time">
                        {{ comment.time }}
                      </div>
                    </div>
                  </div>

                  <!-- 智能体文字内容 -->
                  <div v-if="msg.content && !msg.isDeleted" class="msg-bubble-container">
                    <div class="msg-bubble agent-bubble">
                      {{ msg.content }}
                    </div>
                    <!-- 悬浮操作栏 -->
                    <div class="msg-actions agent-actions">
                      <el-popover
                        placement="bottom"
                        :width="350"
                        trigger="click"
                        popper-class="emoji-popover"
                      >
                        <template #reference>
                          <div class="action-btn">
                            😀
                          </div>
                        </template>
                        <!-- 表情选择内容 -->
                        <div class="emoji-content">
                          <div class="emoji-section">
                            <div class="emoji-section-title">
                              最近使用
                            </div>
                            <div class="emoji-grid">
                              <div
                                v-for="emoji in recentEmojis"
                                :key="emoji"
                                class="emoji-item"
                                @click="addReaction(index, emoji)"
                              >
                                {{ emoji }}
                              </div>
                            </div>
                          </div>
                          <div class="emoji-section">
                            <div class="emoji-section-title">
                              默认表情
                            </div>
                            <div class="emoji-grid">
                              <div
                                v-for="emoji in emojis"
                                :key="emoji"
                                class="emoji-item"
                                @click="addReaction(index, emoji)"
                              >
                                {{ emoji }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </el-popover>
                      <div class="action-btn" @click="showReplyInput(index)">
                        💬
                      </div>
                      <div class="action-btn" @click="showDeleteConfirm(index)">
                        🗑️
                      </div>
                    </div>
                  </div>

                  <!-- 已删除消息 -->
                  <div v-if="msg.isDeleted" class="deleted-message">
                    此消息已被管理组移除
                  </div>

                  <!-- 表情反应 -->
                  <div v-if="msg.reactions && msg.reactions.length > 0" class="reactions-container">
                    <div v-for="(reaction, rIndex) in msg.reactions" :key="rIndex" class="reaction">
                      {{ reaction.emoji }} {{ reaction.count }}
                    </div>
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

        <!-- 回复输入框 -->
        <div v-if="replyToMessageIndex !== null" class="reply-container">
          <div class="reply-header">
            <span>正在回复消息</span>
            <div class="close-btn" @click="closeReplyInput">
              ×
            </div>
          </div>
          <div class="reply-input-area">
            <el-input v-model="commentInput" placeholder="请输入回复内容..." />
            <el-button type="primary" @click="sendComment">
              发送
            </el-button>
          </div>
        </div>

        <!-- 删除确认对话框 -->
        <el-dialog
          v-model="showDeleteDialog"
          title="确定要移除发言吗?"
          width="30%"
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
          width="30%"
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

// 消息时间样式
.message-time {
  font-size: 12px;
  color: #86909c;
  margin-bottom: 4px;
}

// 消息气泡容器
.msg-bubble-container {
  position: relative;
  display: inline-block;
  max-width: 100%;

  &:hover {
    .msg-actions {
      opacity: 1;
      transform: translateY(0);
    }
  }
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

// 消息操作按钮
.msg-actions {
  position: absolute;
  top: -40px;
  display: flex;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
  padding: 6px;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
  z-index: 10;

  .dark & {
    background-color: #2a2a2a;
  }
}

.user-actions {
  right: 0;
}

.agent-actions {
  left: 0;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  .dark & {
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
}

// 表情反应区域
.reactions-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
}

.reaction {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 12px;
  background-color: rgba(0, 0, 0, 0.05);
  font-size: 14px;

  .dark & {
    background-color: rgba(255, 255, 255, 0.1);
  }
}

// 已删除/撤回消息
.deleted-message {
  padding: 10px 16px;
  color: #86909c;
  font-style: italic;
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 8px;

  .dark & {
    background-color: rgba(255, 255, 255, 0.05);
  }
}

// 评论区域
.comments-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.comment {
  padding: 8px 12px;
  border-radius: 6px;
  background-color: rgba(0, 0, 0, 0.02);
  border-left: 3px solid var(--el-color-primary);

  .dark & {
    background-color: rgba(255, 255, 255, 0.05);
  }
}

.comment-content {
  word-break: break-word;
}

.comment-time {
  font-size: 12px;
  color: #86909c;
  margin-top: 4px;
  text-align: right;
}

// 回复输入框
.reply-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 980px;
  margin: 0 auto 16px;
  padding: 16px;

  .dark & {
    background-color: #1a1a1a;
  }
}

.reply-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  color: #86909c;
}

.close-btn {
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
}

.reply-input-area {
  display: flex;
  gap: 12px;
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

// 表情选择样式
.emoji-section {
  margin-bottom: 16px;
}

.emoji-section-title {
  font-size: 14px;
  color: #86909c;
  margin-bottom: 8px;
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 8px;
}

.emoji-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  font-size: 20px;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  .dark & {
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
}

.emoji-content {
  padding: 12px;
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
