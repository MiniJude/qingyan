<script setup lang="ts">
import ChatBot from '~/components/chat-bot/index.vue'

// 引入国际化
const { t } = useI18n()

const activeIndex = ref(0)
const showChatDrawer = ref(false)

// 处理AI助手按钮点击
function handleAiAssistClick() {
  showChatDrawer.value = true
}
</script>

<template>
  <div p="t-29px r-53px b-27px l-19px" relative h-full flex flex-col gap-58px>
    <!-- 顶部区域 -->
    <div flex items-center justify-between>
      <div flex flex-col gap-4px>
        <FileBreadCrumb />
        <span class="last-modify-time">{{ $t('knowledge_base.doc_view.last_modified', { date: '2025年1月1日' }) }}</span>
      </div>
      <div class="btn-group" flex gap-12px>
        <el-button plain size="large">
          <template #icon>
            <SvgoEdit />
          </template>
          {{ $t('knowledge_base.doc_view.edit') }}
        </el-button>
        <el-button plain size="large">
          <template #icon>
            <SvgoDownload />
          </template>
          {{ $t('knowledge_base.doc_view.download') }}
        </el-button>

        <el-dropdown>
          <el-button type="primary" size="large">
            {{ $t('knowledge_base.doc_view.share') }}
            <div ml-8px h-16px w-16px flex-center>
              <SvgoArrowBottomFilled text-6px />
            </div>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>{{ $t('knowledge_base.doc_view.copy_link') }}</el-dropdown-item>
              <el-dropdown-item>{{ $t('knowledge_base.doc_view.generate_qrcode') }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 内容区域 -->
    <div min-h-0 flex flex-1 flex-gap-67px pl-81px>
      <!-- 左侧内容区域 -->
      <div h-full min-w-895px flex-1 overflow-y-auto>
        <div v-for="i in 100" :key="i">
          {{ $t('knowledge_base.doc_view.content_placeholder') }}
        </div>
      </div>

      <!-- 使用封装的批注组件 -->
      <DocumentAnnotation
        v-model:active-index="activeIndex"
      />
    </div>

    <!-- AI助手按钮 -->
    <el-button
      type="primary"
      size="large"
      class="ai-assistant-btn absolute right-0 top-100px !rounded-lb-50px !rounded-lt-50px !rounded-rb-0 !rounded-rt-0"
      self-end
      @click="handleAiAssistClick"
    >
      <SvgoAi class="ai-icon text-24px" />
      <span ml-22px>{{ t('knowledge_base.doc_view.document_assistant') }}</span>
    </el-button>

    <!-- 聊天抽屉 -->
    <el-drawer
      v-model="showChatDrawer"
      direction="rtl"
      size="530px"
      :with-header="false"
      :before-close="() => showChatDrawer = false"
      custom-class="chat-drawer"
    >
      <div class="chat-drawer-container">
        <!-- 使用聊天机器人组件 -->
        <ChatBot />
      </div>
    </el-drawer>
  </div>
</template>

<style lang="scss" scoped>
.last-modify-time {
  color: var(--el-text-color-disabled);
}

.btn-group {
  .el-button {
    margin-left: 0;
  }
}

.ai-assistant-btn {
  width: 145px;
  transition: all 0.3s ease;
  overflow: hidden;
  position: absolute;
  right: 0;
  top: 100px;

  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(103, 88, 246, 0.8) 0%, rgba(56, 119, 238, 0) 70%);
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
    transition:
      transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275),
      opacity 0.6s;
    z-index: -1;
  }

  &:hover {
    transform: translateX(-5px);
    box-shadow: 0 0 15px rgba(81, 102, 235, 0.5);

    &::before {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
  }

  .ai-icon {
    animation: pulse 1.5s infinite alternate;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.2);
    opacity: 0.8;
  }
}

.chat-drawer-container {
  height: 100%;

  :deep(.el-drawer__body) {
    padding: 0;
    height: 100%;
    overflow: hidden;
  }
}

:deep(.chat-drawer) {
  .el-drawer__body {
    padding: 0;
    height: 100%;
    overflow: hidden;
  }
}
</style>
