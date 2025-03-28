<script setup lang="ts">
const usedStorage = '4.5G'
const totalStorage = '10G'
</script>

<template>
  <div>
    <div flex justify-between>
      <span whitespace-nowrap>{{ $t('storage.capacity') }}</span>
      <span text="14px primary" flex cursor-pointer items-center gap-8px>
        <SvgoSetting text="20px" />
        {{ $t('storage.settings') }}
      </span>
    </div>
    <el-progress mb-8px mt-15px :text-inside="true" :stroke-width="10" :show-text="false" :percentage="45" />
    <div text="14px">
      <span class="storage-usage-text">{{ usedStorage }}/{{ totalStorage }}</span>
      <span ml-12px cursor-pointer text-primary>{{ $t('storage.expand') }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.storage-usage-text {
  color: #86909c;
}
</style>
