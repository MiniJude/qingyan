<script setup lang="ts">
import { ref } from 'vue'

defineProps({
  recentEmojis: {
    type: Array as () => string[],
    default: () => ['👌', '✌️'],
  },
})

const emit = defineEmits(['select'])

// 表情列表
const emojis = [
  '👌',
  '✌️',
  '👍',
  '🔥',
  '👏',
  '👋',
  '🤝',
  '😀',
  '😄',
  '😝',
  '😂',
  '🤔',
  '😎',
  '🎁',
  '👀',
  '😮',
  '😍',
  '🤯',
  '🤡',
  '🤬',
  '😢',
  '🤩',
  '😱',
  '😵',
  '😰',
  '🤒',
  '🤕',
  '😭',
  '😇',
  '💩',
  '✅',
  '🎉',
  '🎂',
  '❤️',
  '💯',
  '+1',
  '❌',
  '👎',
  '🐷',
  '🙈',
]

const popoverRef = ref<any>(null)

// 选择表情时触发
function selectEmoji(emoji: string) {
  emit('select', emoji)
  // 选择后关闭弹窗
  if (popoverRef.value && typeof popoverRef.value.hide === 'function') {
    popoverRef.value.hide()
  }
}
</script>

<template>
  <el-popover
    ref="popoverRef"
    placement="bottom"
    :width="350"
    trigger="click"
    popper-class="emoji-popover"
  >
    <template #reference>
      <div class="action-btn">
        😀
      </div>
    </template>
    <!-- 表情选择内容 -->
    <div class="emoji-content">
      <div class="emoji-section">
        <div class="emoji-section-title">
          最近使用
        </div>
        <div class="emoji-grid">
          <div
            v-for="emoji in recentEmojis"
            :key="emoji"
            class="emoji-item"
            @click="selectEmoji(emoji)"
          >
            {{ emoji }}
          </div>
        </div>
      </div>
      <div class="emoji-section">
        <div class="emoji-section-title">
          默认表情
        </div>
        <div class="emoji-grid">
          <div
            v-for="emoji in emojis"
            :key="emoji"
            class="emoji-item"
            @click="selectEmoji(emoji)"
          >
            {{ emoji }}
          </div>
        </div>
      </div>
    </div>
  </el-popover>
</template>

<style lang="scss" scoped>
.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  .dark & {
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
}

.emoji-section {
  margin-bottom: 16px;
}

.emoji-section-title {
  font-size: 14px;
  color: #86909c;
  margin-bottom: 8px;
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 8px;
}

.emoji-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  font-size: 20px;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  .dark & {
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
}

.emoji-content {
  padding: 12px;
}
</style>
