<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  modelValue: 'personal' | 'team'
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: 'personal' | 'team'): void
}>()

const { t } = useI18n()
</script>

<template>
  <div>
    <div class="space-type-selection">
      <div
        class="space-type-card"
        :class="{ active: props.modelValue === 'personal' }"
        @click="emit('update:modelValue', 'personal')"
      >
        <div i-carbon:user h-48px w-48px text-primary />
        <div mt-16px text-16px font-500>
          {{ t('space.create_dialog.personal') }}
        </div>
        <div mt-8px text-14px color-gray-500>
          {{ t('space.create_dialog.personal_desc') }}
        </div>
      </div>

      <div
        class="space-type-card"
        :class="{ active: props.modelValue === 'team' }"
        @click="emit('update:modelValue', 'team')"
      >
        <div i-carbon:group h-48px w-48px text-primary />
        <div mt-16px text-16px font-500>
          {{ t('space.create_dialog.team') }}
        </div>
        <div mt-8px text-14px color-gray-500>
          {{ t('space.create_dialog.team_desc') }}
        </div>
      </div>
    </div>
    <div>
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.space-type-selection {
  display: flex;
  gap: 24px;
  padding: 24px;
}

.space-type-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.space-type-card:hover {
  border-color: var(--el-color-primary);
}

.space-type-card.active {
  border-color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
}
</style>
