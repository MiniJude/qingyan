<template>
  <main flex h-full w-full>
    <LayoutSideBar />
    <div flex flex-1 flex-col min-w-0>
      <LayoutHeader />
      <div flex-1 min-h-0>
        <slot />
      </div>
    </div>
  </main>
</template>
