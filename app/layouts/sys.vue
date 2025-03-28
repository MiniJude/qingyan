<script setup lang="ts">
import { CircleCloseFilled } from '@element-plus/icons-vue'

const route = useRoute()
const { t } = useI18n()
const title = computed(() => t(route.meta.title as string))
</script>

<template>
  <main h-full flex-center>
    <div class="sys-layout bg-[#edeff3] dark:bg-black" relative m-auto h-850px w-1351px flex-center rounded-10px>
      <img src="@/assets/img/logo.png" alt="logo" absolute left-25px top-26px h-64px w-134px>
      <CircleCloseFilled color="primary" absolute right-35px top-38px h-40px w-40px cursor-pointer />

      <div relative>
        <div class="dot" left--10px top-20px style="background: #6CB5EE;" />
        <div class="dot" bottom-20px right--10px style="background: #25DFE2;" />
        <div class="dot" bottom-55px right--10px style="background: #8F67E8;" />
        <div class="dot" bottom-90px right--10px style="background: #1A61FA;" />
        <div class="absolute left-[50%] z-2 translate-x-[-50%] rounded-[0_0_30px_30px]" text="14px white" h-35px w-172px flex-center style="background: #660874;">
          {{ title }}
        </div>

        <div class="sys-form-container" relative min-h-200px min-w-200px rounded-10px bg-white dark:bg-overlay>
          <slot />
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.sys-layout {
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.16);
}

.sys-form-container {
  border-radius: 10px;
  backdrop-filter: blur(84px);
  box-shadow:
    0px 3px 6px rgba(0, 0, 0, 0.16),
    inset 0px 3px 6px rgba(0, 0, 0, 0.16);
  z-index: 1;
}

.dot {
  width: 20px;
  height: 20px;
  position: absolute;
  background-color: #000;
  border-radius: 50%;
  z-index: 0;
}
</style>
