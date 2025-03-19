<template>
  <div>
    <div flex justify-between>
      <span>空间容量</span>
      <span text="14px primary" flex gap-8px cursor-pointer items-center>
        <SvgoSetting text="20px" />
        设置
      </span>
    </div>
    <el-progress mb-8px mt-15px :text-inside="true" :stroke-width="10" :show-text="false" :percentage="45" />
    <div text="14px">
      <span class="storage-usage-text">4.5G/10G</span>
      <span text-primary ml-12px cursor-pointer>扩容</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.storage-usage-text {
  color: #86909c;
}
</style>
