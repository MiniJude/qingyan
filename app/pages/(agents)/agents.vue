<script setup lang="ts">
import AgentList from './agents/components/AgentList.vue'
</script>

<template>
  <div h-full flex>
    <AgentList class="flex-shrink-0" />
    <NuxtPage class="flex-1" />
  </div>
</template>
