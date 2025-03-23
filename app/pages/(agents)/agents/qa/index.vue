<script setup lang="ts">
import { ArrowDown } from '@element-plus/icons-vue'

const input = ref('')

// 对话记录列表
interface Message {
  role: 'agent' | 'user'
  content: string
  time: string
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

function handleSend() {
  if (!input.value) {
    ElMessage.warning('请输入内容')
    return
  }

  messages.value.push({
    role: 'user',
    content: input.value,
    time: '09:03',
  })
  input.value = ''

  setTimeout(() => {
    handleAgentAnswer()
  }, 1000)
}

// agent的回答
function handleAgentAnswer() {
  messages.value.push({
    role: 'agent',
    content: '服务器繁忙，请稍后再试！',
    time: '09:03',
  })
}
</script>

<template>
  <div flex flex-col>
    <div class="agent-header" pl-37px pr-53px flex h-80px items-center justify-between>
      <div flex gap-8px items-center>
        <img width="48" src="@/assets/img/logo-icon.png" alt="">
        <span text-20px text-tprimary>知识库问答助手</span>
      </div>
      <div text-20px flex gap-20px items-center style="color: #4E5969;">
        <SvgoNotice cursor-pointer />
        <SvgoClear cursor-pointer />
        <SvgoInfo cursor-pointer />
      </div>
    </div>

    <div class="agent-content" flex flex-1 flex-col min-h-0 items-center>
      <div style="color: #86909C;" text-14px mt-43px flex gap-17px items-center justify-center>
        <span>2025-01-10</span>
        <el-icon class="cursor-pointer">
          <ArrowDown />
        </el-icon>
      </div>
      <div flex flex-1 flex-col gap-24px min-h-0 w-1060px overflow-y-auto>
        <!-- 这里是对话记录 -->
        <div pt-23px flex flex-1 flex-col gap-16px min-h-0 overflow-y-auto>
          <template v-for="(msg, index) in messages" :key="index">
            <!-- 用户对话框 -->
            <div v-if="msg.role === 'user'" flex flex-row-reverse gap-20px w-full items-start>
              <img width="40" src="@/assets/img/avatar.png" alt="">
              <div class="msg-box" text-right>
                {{ msg.content }}
              </div>
            </div>
            <!-- 智能体对话框 -->
            <div v-else flex gap-20px w-full items-start>
              <img width="40" src="@/assets/img/logo-icon.png" alt="">
              <div class="msg-box">
                {{ msg.content }}
              </div>
            </div>
          </template>
        </div>

        <!-- 在这里输入 -->
        <div flex h-54px items-center>
          <el-input v-model="input" class="h-full" placeholder="请输入内容" />
          <el-button type="primary" size="large" class="w-192px !h-full" @click="handleSend">
            发送
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.agent-header {
  border-bottom: 1px solid var(--el-border-color);
}

.agent-content {
  padding: 13px 141px 46px 154px;
}

.msg-box {
  border-radius: 4px;
  background: #ffffff;
  box-shadow: 14px 27px 45px 4px rgba(102, 81, 240, 0.08);
  padding: 20px;
  width: 940px;
}
</style>
