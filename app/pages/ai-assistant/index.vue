<script setup lang="ts">
import { SvgoAiDoc, SvgoAiGenerate, SvgoAiMindmap, SvgoAiMore, SvgoAiQa, SvgoAiRewrite, SvgoAiTalk } from '#components'
import Agents from './components/agents/index.vue'

const features = [
  {
    title: '智能对话',
    description: '智能理解对话，高效提供信息',
    icon: SvgoAiTalk,
  },
  {
    title: 'AI文档',
    description: '高效梳理内容，精准匹配需求',
    icon: SvgoAiDoc,
  },
  {
    title: '思维导图',
    description: '清晰梳理逻辑，高效呈现思维',
    icon: SvgoAiMindmap,
  },
  {
    title: '论文改写',
    description: '专业致力于文章的个性化重塑',
    icon: SvgoAiRewrite,
  },
  {
    title: '文案生成器',
    description: '一键生成高效文案，拥有自媒体素涵',
    icon: SvgoAiGenerate,
  },
  {
    title: '解题答疑',
    description: '传图解析，精准答疑',
    icon: SvgoAiQa,
  },
  {
    title: '更多功能',
    description: '陆续上线中，敬请期待~',
    icon: SvgoAiMore,
  },
]
</script>

<template>
  <div flex h-full>
    <Agents />
    <div flex flex-1 flex-col min-h-0>
      <p text-24px text-tprimary font-bold line-height-32px ml-32px mt-149px>
        hi~我是你的知识库智能体助手
        <br>
        我将基于选定的数据源
        <br>
        快速定位、提取和应用信息
      </p>
      <div my-40px flex-1 min-h-0 overflow-y-auto>
        <ul class="box-container">
          <li
            v-for="feature in features" :key="feature.title" class="box-item" p="x-24px y-16px"
            rounded-4px flex h-120px cursor-pointer items-center
          >
            <component :is="feature.icon" mr-21px text="40px primary" />
            <div flex flex-col gap-3px>
              <p text-16px text-black>
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
  </div>
</template>

<style lang="scss" scoped>
.box-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 60px 24px;
  padding: 20px 75px 6px 32px;

  .box-item {
    background-color: #edeff3;
    transition: all 0.3s ease;
    &:hover {
      transform: translateY(-6px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }
  }
}
</style>
