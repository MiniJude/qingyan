<script setup lang="ts">
import DocIcon from '@/assets/svg/doc.svg?component'
import LinkIcon from '@/assets/svg/link.svg?component'
import PictureIcon from '@/assets/svg/picture.svg?component'
import PptIcon from '@/assets/svg/ppt.svg?component'
import UrlIcon from '@/assets/svg/url.svg?component'
import WechatArticleIcon from '@/assets/svg/wechat-article.svg?component'
import WechatRecordsIcon from '@/assets/svg/wechat-records.svg?component'

const props = withDefaults(defineProps<{
  fileType: FileType
  size?: number
}>(), {
  size: 12,
})
</script>

<template>
  <div :style="{ width: `${props.size}px`, height: `${props.size}px` }">
    <DocIcon v-if="props.fileType === 'doc'" />
    <PptIcon v-else-if="props.fileType === 'ppt'" />
    <DocIcon v-else-if="props.fileType === 'excel'" />
    <WechatArticleIcon v-else-if="props.fileType === 'wechat-article'" />
    <WechatRecordsIcon v-else-if="props.fileType === 'wechat-records'" />
    <UrlIcon v-else-if="props.fileType === 'url'" />
    <PictureIcon v-else-if="props.fileType === 'picture'" />
    <LinkIcon v-else-if="props.fileType === 'link'" />
    <div v-else-if="props.fileType === 'video'" class="i-carbon:video-player" />
    <div v-else-if="props.fileType === 'txt'" class="i-carbon:txt" />
  </div>
</template>
