<script setup lang="ts">
import DocSideBar from './knowledge-base/components/docSideBar/index.vue'

definePageMeta({
  middleware: ['auth', 'space-loader'],
})
</script>

<template>
  <div flex="~" h-full>
    <DocSideBar />
    <div min-w-0 flex-1>
      <!-- 使用NuxtPage作为嵌套路由出口 -->
      <NuxtPage />
    </div>
  </div>
</template>
