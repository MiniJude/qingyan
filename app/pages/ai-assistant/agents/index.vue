<script setup lang="ts">
interface Agent {
  name: string
  icon: string
  description: string
  dateTime: string
}

const agents = ref<Agent[]>([
  {
    name: '知识库问答助手',
    icon: 'https://img.yzcdn.cn/vant/ipad.png',
    description: 'hi~ 我是你的知识库问答助手，有关知识库的问题都可以问我哦~',
    dateTime: '今天',
  },
  {
    name: 'Agent 2',
    icon: 'https://img.yzcdn.cn/vant/ipad.png',
    description: 'Agent 2 description',
    dateTime: '昨天',
  },
])
</script>

<template>
  <div class="agents-container" w-322px p="t-27px r-11px b-10px l-9px">
    <el-button type="primary" class="mb-24px w-full !px-9px !h-44px !justify-start">
      <template #icon>
        <SvgoCirclePlus text="white 18px" />
      </template>
      <span text-16px ml-8px>新建</span>
    </el-button>
    <ul>
      <li
        v-for="agent in agents" :key="agent.name" p="l-21px r-14px y-25px" rounded-4px flex h-117px cursor-pointer
        items-center hover:bg-gray-100
      >
        <!-- <img :src="agent.icon" alt="agent icon"> -->
        <div i-carbon:logo-kubernetes text="primary 48px" />
        <div ml-18px mr-24px flex flex-1 flex-col gap-7px h-full>
          <span line-clamp-1 style="color: #323E4A">{{ agent.name }}</span>
          <span text-tregular text-14px flex-1 min-h-0px line-clamp-2>{{ agent.description }}</span>
        </div>
        <span text-12px self-start style="color: #86909C;">{{ agent.dateTime }}</span>
      </li>
    </ul>
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
</style>
