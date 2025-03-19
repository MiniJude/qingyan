<template>
  <main flex h-full w-full>
    <LayoutSideBar />
    <div flex-1 min-w-0>
      <LayoutHeader />
      <slot />
    </div>
  </main>
</template>
