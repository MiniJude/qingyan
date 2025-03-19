<template>
  <div class="side-bar" flex flex-col w-242px>
    <!-- logo -->
    <!-- <div flex gap-2 h-69px items-center p="l-13px">
      <div i-carbon:logo-kubernetes text="primary 48px" />
      <span text="primary font-bold 28px">清研</span>
    </div> -->

    <img src="@/assets/img/logo.png" alt="logo" m="t-5px l-13px" h-64px w-134px>

    <div flex flex-1 flex-col p="t-13px r-16px b-13px l-15px">
      <!-- 空间切换 -->
      <div m="l-1px b-12px t-10px" flex h-35px cursor-pointer items-center>
        <div text="white 10px" rounded-5px bg-primary flex-center h-36px w-36px>
          数智<br>空间
        </div>
        <span m="l-21px" flex-1>个人空间</span>
        <div i-carbon:chevron-right h-20px w-20px />
      </div>

      <el-menu pt-19px flex-1 !b-0 default-active="1">
        <el-menu-item index="1">
          <div i-carbon:folder h-20px w-20px />
          <span ml-30px>知识库</span>
        </el-menu-item>
        <el-menu-item index="2">
          <div i-carbon:ai-label h-20px w-20px />
          <span ml-30px>AI 助手</span>
        </el-menu-item>
      </el-menu>

      <el-divider !mb-12px !mt-12px />
      <LayoutStorageUsageBox />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.side-bar {
  background-color: #edeff3;
}
</style>
