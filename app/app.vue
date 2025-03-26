<script setup lang="ts">
import { APP_NAME } from '~/constants'

useHead({
  title: APP_NAME,
})
</script>

<template>
  <!-- <VitePwaManifest /> -->
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
html,
body,
#__nuxt {
  height: 100vh;
  margin: 0;
  padding: 0;
}

html.dark {
  color-scheme: dark;
}

/* 清空Svgo Icon 组件的默认下边距 */
.nuxt-icon {
  margin-bottom: 0 !important;
}
</style>
