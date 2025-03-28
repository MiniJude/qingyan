<script setup lang="ts">
import { SvgoAiDoc, SvgoAiGenerate, SvgoAiMindmap, SvgoAiMore, SvgoAiQa, SvgoAiRewrite, SvgoAiTalk } from '#components'

const features = [
  {
    title: useNuxtApp().$i18n.t('agents.index.features.chat.title'),
    description: useNuxtApp().$i18n.t('agents.index.features.chat.description'),
    icon: SvgoAiTalk,
  },
  {
    title: useNuxtApp().$i18n.t('agents.index.features.doc.title'),
    description: useNuxtApp().$i18n.t('agents.index.features.doc.description'),
    icon: SvgoAiDoc,
  },
  {
    title: useNuxtApp().$i18n.t('agents.index.features.mindmap.title'),
    description: useNuxtApp().$i18n.t('agents.index.features.mindmap.description'),
    icon: SvgoAiMindmap,
  },
  {
    title: useNuxtApp().$i18n.t('agents.index.features.rewrite.title'),
    description: useNuxtApp().$i18n.t('agents.index.features.rewrite.description'),
    icon: SvgoAiRewrite,
  },
  {
    title: useNuxtApp().$i18n.t('agents.index.features.generate.title'),
    description: useNuxtApp().$i18n.t('agents.index.features.generate.description'),
    icon: SvgoAiGenerate,
  },
  {
    title: useNuxtApp().$i18n.t('agents.index.features.qa.title'),
    description: useNuxtApp().$i18n.t('agents.index.features.qa.description'),
    icon: SvgoAiQa,
  },
  {
    title: useNuxtApp().$i18n.t('agents.index.features.more.title'),
    description: useNuxtApp().$i18n.t('agents.index.features.more.description'),
    icon: SvgoAiMore,
  },
]
</script>

<template>
  <div min-h-0 flex flex-1 flex-col>
    <p ml-32px mt-149px text-24px text-tprimary font-bold line-height-32px>
      {{ $t('agents.index.welcome_message') }}
    </p>
    <div my-40px min-h-0 flex-1 overflow-y-auto>
      <ul class="box-container">
        <li
          v-for="feature in features" :key="feature.title" class="box-item bg-[#edeff3] dark:bg-black" p="x-24px y-16px"
          h-120px flex cursor-pointer items-center rounded-4px
        >
          <component :is="feature.icon" mr-21px text="40px primary" />
          <div flex flex-col gap-3px>
            <p text-16px>
              {{ feature.title }}
            </p>
            <p text-14px text-tsecondary style="color: #86909C;">
              {{ feature.description }}
            </p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.box-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 60px 24px;
  padding: 20px 75px 6px 32px;

  .box-item {
    transition: all 0.3s ease;
    &:hover {
      transform: translateY(-6px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }
  }
}
</style>
