<script setup lang="ts">
// 定义组件的props
interface Props {
  /** 侧边栏是否折叠 */
  isCollapsed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isCollapsed: false,
})

const usedStorage = '4.5G'
const totalStorage = '10G'

const spaceSettingDialogVisible = ref(false)
function showSpaceSettingDialog() {
  spaceSettingDialogVisible.value = true
}
</script>

<template>
  <div class="storage-usage-container">
    <!-- 使用v-show和css类组合控制显示 -->
    <div
      v-show="!props.isCollapsed"
      class="storage-content"
      :class="{ visible: !props.isCollapsed }"
    >
      <div flex justify-between>
        <span whitespace-nowrap>{{ $t('storage.capacity') }}</span>
        <span text="14px primary" flex cursor-pointer items-center gap-8px @click="showSpaceSettingDialog">
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

    <!-- 收起状态只显示设置图标 -->
    <div
      v-show="props.isCollapsed"
      class="setting-icon-only flex justify-center"
      :class="{ visible: props.isCollapsed }"
    >
      <SvgoSetting class="cursor-pointer text-20px text-primary" @click="showSpaceSettingDialog" />
    </div>
  </div>
  <!-- <SpaceDialog v-model="spaceSettingDialogVisible" /> -->
  <SpaceSetting v-model="spaceSettingDialogVisible" />
</template>

<style lang="scss" scoped>
.storage-usage-text {
  color: #86909c;
}

.storage-usage-container {
  position: relative;
  overflow: hidden;
}

.storage-content {
  opacity: 0;
  max-height: 0;
  transition:
    opacity 0.3s ease 0.2s,
    max-height 0.3s ease;

  &.visible {
    opacity: 1;
    max-height: 100px;
  }
}

.setting-icon-only {
  opacity: 0;
  transition: opacity 0.3s ease 0.2s;

  &.visible {
    opacity: 1;
  }
}
</style>
