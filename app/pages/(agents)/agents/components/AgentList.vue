<script setup lang="ts">
import { useRoute } from 'nuxt/app'
import FormDialog from './AgentForm.vue'

const route = useRoute()

interface Agent {
  name: string
  icon: string
  description: string
  dateTime: string
  path: string
}

const agents = ref<Agent[]>([
  {
    name: '知识库问答助手',
    icon: '',
    description: 'hi~ 我是你的知识库问答助手，有关知识库的问题都可以问我哦~',
    dateTime: '今天',
    path: '/agents/qa',
  },
  {
    name: 'AI文档助手',
    icon: '',
    description: 'hi~ 我是你基于多文档生成的私有大模型智能体，有关文档的问题都可以问我哦~',
    dateTime: '昨天',
    path: '/agents/doc',
  },
])

const activeAgentPath = computed(() => {
  return agents.value.find(agent => route.path.includes(agent.path))?.path ?? ''
})

const formDialogRef = ref<InstanceType<typeof FormDialog>>()
</script>

<template>
  <div class="agents-container" w-322px p="t-27px r-11px b-10px l-9px">
    <el-button type="primary" class="mb-24px w-full !text-18px !px-9px !h-44px !justify-start" @click="formDialogRef?.open()">
      <template #icon>
        <SvgoCirclePlus text="white" />
      </template>
      <span text-16px ml-8px>新建</span>
    </el-button>
    <ul>
      <NuxtLink v-for="agent in agents" :key="agent.name" :to="agent.path">
        <li
          class="agent-item dark:hover:bg-[#1d1e1f]"
          :class="{ 'is-active': activeAgentPath === agent.path }"
          p="l-21px r-14px y-25px"
          rounded-4px flex h-117px cursor-pointer items-center hover:bg-gray-100
        >
          <!-- <img :src="agent.icon" alt="agent icon"> -->
          <div i-carbon:logo-kubernetes text="primary 48px" />
          <div ml-18px mr-24px flex flex-1 flex-col gap-7px h-full self-start>
            <span line-height-20px line-clamp-1 class="text-[#323E4A] dark:text-white">{{ agent.name }}</span>
            <span text-14px text-tregular line-height-20px flex-1 min-h-0px line-clamp-2>{{ agent.description }}</span>
          </div>
          <span text-12px self-start style="color: #86909C;">{{ agent.dateTime }}</span>
        </li>
      </NuxtLink>
    </ul>
    <FormDialog ref="formDialogRef" />
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-button) {
  .el-icon {
    width: 18px;
    height: 18px;
  }
}

.agents-container {
  border-right: 1px solid var(--el-border-color);
}

.agent-item {
  transition: all 0.2s ease;
  margin-bottom: 4px;

  &.is-active {
    border-radius: 0px 4px 4px 0px;
    background: #f6f9ff;
    box-shadow: inset 5px 0px 0px #6651f0;
  }
}

html.dark {
  .agent-item {
    &.is-active {
      background: black;
      box-shadow: inset 5px 0px 0px var(--el-color-primary);
    }
  }
}
</style>
