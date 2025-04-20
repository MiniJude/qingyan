<script setup lang="ts">
import AgentList from './agents/components/AgentList.vue'

definePageMeta({
  middleware: ['auth', 'space-loader'],
})
</script>

<template>
  <div h-full flex>
    <AgentList class="flex-shrink-0" />
    <NuxtPage class="flex-1" />
  </div>
</template>
