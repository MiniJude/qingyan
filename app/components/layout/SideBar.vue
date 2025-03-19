<template>
  <div class="side-bar" flex flex-col w-242px>
    <!-- logo -->
    <div flex gap-2 h-69px items-center p="l-13px">
      <div i-carbon:logo-kubernetes text="primary 48px" />
      <span text="primary font-bold 28px">清研</span>
    </div>

    <div flex flex-1 flex-col p="t-13px r-16px b-6px l-15px">
      <!-- 空间切换 -->
      <div m="l-1px b-12px t-10px" flex h-35px>
        <div text="white 10px" flex-center rounded-5px bg-primary h-36px w-36px>
          数智<br>空间
        </div>
        <span m="l-21px" flex-1>个人空间</span>
      </div>
    </div>
    <LayoutStorageUsageBox />
  </div>
</template>

<style lang="scss" scoped>
.side-bar {
  background-color: #edeff3;
}
</style>
