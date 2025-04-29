<script setup lang="ts">
// 引入国际化
import AIAssistant from '~/components/chat-bot/AIAssistant.vue'
import FileHeader from '../../components/FileHeader.vue'

const activeIndex = ref(0)
</script>

<template>
  <div p="t-29px r-53px b-27px l-19px" relative h-full flex flex-col gap-16px>
    <!-- 顶部区域 -->
    <FileHeader />

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

    <!-- AI助手组件 -->
    <AIAssistant />
  </div>
</template>
