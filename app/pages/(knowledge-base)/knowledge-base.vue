<script setup lang="ts">
import DocSideBar from './knowledge-base/components/docSideBar/index.vue'
</script>

<template>
  <div flex="~" h-full>
    <DocSideBar />
    <div flex-1 min-h-0>
      <!-- 使用NuxtPage作为嵌套路由出口 -->
      <NuxtPage />
    </div>
  </div>
</template>
