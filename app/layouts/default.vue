<template>
  <main flex h-full w-full>
    <LayoutSideBar />
    <div>
      <LayoutHeader />
      <slot />
      <LayoutFooter />
    </div>
  </main>
</template>
