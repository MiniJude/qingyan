<script setup lang="ts">
import { CircleCloseFilled } from '@element-plus/icons-vue'
</script>

<template>
  <main flex-center h-full>
    <div class="sys-layout" m-auto rounded-10px flex-center h-850px w-1351px relative>
      <img src="@/assets/img/logo.png" alt="logo" h-64px w-134px left-25px top-26px absolute>
      <CircleCloseFilled color="primary" h-40px w-40px cursor-pointer right-35px top-38px absolute />
      <div class="sys-form-container" rounded-10px bg-white max-w-200px min-h-200px>
        <slot />
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.sys-layout {
  background-color: #edeff3;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.16);
}

.sys-form-container {
  border-radius: 10px;
  background: #ffffff;
  backdrop-filter: blur(84px);
  box-shadow:
    0px 3px 6px rgba(0, 0, 0, 0.16),
    inset 0px 3px 6px rgba(0, 0, 0, 0.16);
}
</style>
