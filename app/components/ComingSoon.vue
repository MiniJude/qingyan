<template>
  <div flex-center flex-col h-full>
    <div class="coming-soon-container" flex-center flex-col>
      <h1 text-30px text-tprimary font-bold mb-16px>
        功能开发中
      </h1>
      <p text-16px text-tsecondary mx-auto text-center max-w-500px>
        敬请期待~
      </p>
      <NuxtLink to="/">
        <el-button type="primary" size="large" mt-40px rounded>
          返回首页
        </el-button>
      </NuxtLink>
    </div>
  </div>
</template>

  <style lang="scss" scoped>
  .coming-soon-container {
  position: relative;
  padding: 60px;
  border-radius: 10px;
  backdrop-filter: blur(4px);
  z-index: 1;
}

.dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  z-index: 0;
}
</style>
