<script setup lang="ts">
import { ArrowDown } from '@element-plus/icons-vue'

const { t } = useI18n()

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
    ElMessage.warning(t('agents.qa.input_placeholder'))
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
    <div class="agent-header" h-80px flex items-center justify-between pl-37px pr-53px>
      <div flex items-center gap-8px>
        <img width="48" src="@/assets/img/logo-icon.png" alt="">
        <span text-20px text-tprimary>{{ $t('agents.kb_qa_assistant.name') }}</span>
      </div>
      <div flex items-center gap-20px text-20px style="color: #4E5969;">
        <SvgoNotice cursor-pointer />
        <SvgoClear cursor-pointer />
        <SvgoInfo cursor-pointer />
      </div>
    </div>

    <div class="agent-content" min-h-0 flex flex-1 flex-col items-center>
      <div style="color: #86909C;" mt-43px flex items-center justify-center gap-17px text-14px>
        <span>{{ $t('agents.qa.date') }}</span>
        <el-icon class="cursor-pointer">
          <ArrowDown />
        </el-icon>
      </div>
      <div min-h-0 w-1060px flex flex-1 flex-col gap-24px overflow-y-auto>
        <!-- 这里是对话记录 -->
        <div min-h-0 flex flex-1 flex-col gap-16px overflow-y-auto pt-23px>
          <template v-for="(msg, index) in messages" :key="index">
            <!-- 用户对话框 -->
            <div v-if="msg.role === 'user'" w-full flex flex-row-reverse items-start gap-20px>
              <img width="40" src="@/assets/img/avatar.png" alt="">
              <div class="msg-box bg-white dark:bg-black" text-right>
                {{ msg.content }}
              </div>
            </div>
            <!-- 智能体对话框 -->
            <div v-else w-full flex items-start gap-20px>
              <img width="40" src="@/assets/img/logo-icon.png" alt="">
              <div class="msg-box bg-white dark:bg-black">
                {{ msg.content }}
              </div>
            </div>
          </template>
        </div>

        <!-- 在这里输入 -->
        <div h-54px flex items-center>
          <el-input v-model="input" class="h-full" :placeholder="$t('agents.qa.input_placeholder')" />
          <el-button type="primary" size="large" class="w-192px !h-full" @click="handleSend">
            {{ $t('agents.qa.send') }}
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
  box-shadow: 14px 27px 45px 4px rgba(102, 81, 240, 0.08);
  padding: 20px;
  width: 940px;
}
</style>
