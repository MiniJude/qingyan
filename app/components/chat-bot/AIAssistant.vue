<script setup lang="ts">
import ChatBot from '~/components/chat-bot/index.vue'

// 抽屉显示状态
const showChatDrawer = ref(false)
</script>

<template>
  <div class="ai-assistant-wrapper">
    <!-- AI助手按钮 -->
    <el-button
      type="primary"
      size="large"
      class="ai-assistant-btn"
      @click="showChatDrawer = true"
    >
      <SvgoAi class="ai-icon text-24px" />
      <span ml-22px>{{ $t('knowledge_base.doc_view.document_assistant') }}</span>
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
.ai-assistant-wrapper {
  position: relative;
  z-index: 1999;
  position: absolute;
  right: 0;
  top: 100px;
}

.ai-assistant-btn {
  width: 145px;
  transition: all 0.3s ease;
  overflow: hidden;
  border-radius: 50px 0 0 50px;

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
}

:deep(.chat-drawer) {
  .el-drawer__body {
    padding: 0;
    height: 100%;
    overflow: hidden;
  }
}
</style>
