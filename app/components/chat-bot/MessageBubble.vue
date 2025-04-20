<script setup lang="ts">
import type { FileInfo } from '~/types/file'
import EmojiPicker from './EmojiPicker.vue'
import MessageActions from './MessageActions.vue'

interface Comment {
  id: string
  content: string
  time: string
  dateTime: string
}

interface Props {
  role: 'agent' | 'user'
  content: string
  dateTime: string
  messageId?: string
  files?: FileInfo[]
  comments?: Comment[]
  reactions?: { emoji: string, count: number }[]
  isDeleted?: boolean
  replyToContent?: string
  recentEmojis?: string[]
  isLiked?: boolean
  isDisliked?: boolean
  examples?: string[]
}

withDefaults(defineProps<Props>(), {
  messageId: '',
  isLiked: false,
  isDisliked: false,
})

const emit = defineEmits<{
  (e: 'reaction', emoji: string): void
  (e: 'reply'): void
  (e: 'delete'): void
  (e: 'recall'): void
  (e: 'fileClick', file: FileInfo): void
  (e: 'like', messageId: string): void
  (e: 'dislike', messageId: string): void
  (e: 'copy', message: string): void
  (e: 'exampleClick', question: string): void
}>()

function handleFileClick(file: FileInfo) {
  emit('fileClick', file)
}

function handleExampleClick(question: string) {
  emit('exampleClick', question)
}
</script>

<template>
  <div class="message-row" :class="[role === 'user' ? 'user-message-row' : 'agent-message-row']">
    <img
      width="40"
      :src="role === 'user' ? '@/assets/img/avatar.png' : '@/assets/img/logo-icon.png'"
      alt=""
      class="avatar"
    >
    <div class="message-container" :class="[role === 'user' ? 'user-message' : 'agent-message']">
      <!-- 消息时间 -->
      <div class="message-time">
        {{ dateTime }}
      </div>

      <!-- 显示评论 -->
      <div v-if="comments && comments.length > 0" class="comments-container mb-2">
        <div v-for="comment in comments" :key="comment.id" class="comment">
          <div class="comment-content">
            {{ comment.content }}
          </div>
          <div class="comment-time">
            {{ comment.time }}
          </div>
        </div>
      </div>

      <!-- 用户/智能体发送文件 -->
      <div v-if="files && files.length > 0" :class="role === 'user' ? 'mb-2' : 'mt-2'" class="files-container">
        <FileCard
          v-for="file in files"
          :key="file.id"
          :file="file"
          clickable
          @click="handleFileClick(file)"
        />
      </div>

      <!-- 文字内容 -->
      <div v-if="content && !isDeleted" class="msg-bubble-container">
        <!-- 回复引用 -->
        <div v-if="replyToContent" class="reply-quote">
          <div class="reply-label">
            回复:
          </div>
          <div class="reply-content">
            {{ replyToContent }}
          </div>
        </div>
        <div class="msg-bubble" :class="[role === 'user' ? 'user-bubble' : 'agent-bubble']">
          {{ content }}

          <!-- 示例问题选项 -->
          <div v-if="examples && examples.length > 0" class="example-questions">
            <div
              v-for="(question, qIndex) in examples"
              :key="qIndex"
              class="example-question"
              @click="handleExampleClick(question)"
            >
              {{ question }}
            </div>
          </div>
        </div>
        <!-- 悬浮操作栏 -->
        <div class="msg-actions" :class="[role === 'user' ? 'user-actions' : 'agent-actions']">
          <EmojiPicker :recent-emojis="recentEmojis" @select="(emoji) => $emit('reaction', emoji)" />
          <div class="action-btn" @click="$emit('reply')">
            💬
          </div>
          <div v-if="role === 'user'" class="action-btn" @click="$emit('recall')">
            ↩️
          </div>
          <div v-else class="action-btn" @click="$emit('delete')">
            🗑️
          </div>
        </div>
      </div>

      <!-- AI助手消息操作按钮（点赞、踩、复制） -->
      <MessageActions
        v-if="role === 'agent' && content && !isDeleted"
        :message="content"
        :message-id="messageId"
        :liked="isLiked"
        :disliked="isDisliked"
        @like="$emit('like', $event)"
        @dislike="$emit('dislike', $event)"
        @copy="$emit('copy', $event)"
      />

      <!-- 已删除/撤回消息 -->
      <div v-if="isDeleted" class="deleted-message">
        {{ role === 'user' ? '此消息已被撤回' : '此消息已被管理组移除' }}
      </div>

      <!-- 表情反应 -->
      <div v-if="reactions && reactions.length > 0" class="reactions-container">
        <div v-for="(reaction, rIndex) in reactions" :key="rIndex" class="reaction">
          {{ reaction.emoji }} {{ reaction.count }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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

.files-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 100%;
}

.reply-quote {
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 6px;
  padding: 8px 12px;
  margin-bottom: 8px;
  border-left: 3px solid var(--el-color-primary);
  font-size: 0.9em;
  max-width: 100%;

  .dark & {
    background-color: rgba(255, 255, 255, 0.05);
  }
}

.reply-label {
  color: var(--el-color-primary);
  font-weight: 500;
  margin-bottom: 4px;
}

.reply-content {
  color: #86909c;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.example-questions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.example-question {
  background-color: #f0f2f5;
  padding: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  color: #333;
  font-size: 14px;

  &:hover {
    background-color: #e8eaed;
  }
}
</style>
