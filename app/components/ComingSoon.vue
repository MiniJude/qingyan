<template>
  <div h-full flex-center flex-col>
    <div class="coming-soon-container" flex-center flex-col>
      <h1 mb-16px text-30px text-tprimary font-bold>
        {{ $t('common.coming_soon.title') }}
      </h1>
      <p mx-auto max-w-500px text-center text-16px text-tsecondary>
        {{ $t('common.coming_soon.description') }}
      </p>
      <NuxtLink to="/">
        <el-button type="primary" size="large" mt-40px rounded>
          {{ $t('common.coming_soon.back_home') }}
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
