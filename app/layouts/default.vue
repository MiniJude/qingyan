<template>
  <main h-full w-full flex>
    <LayoutSideBar />
    <div min-w-0 flex flex-1 flex-col>
      <LayoutHeader />
      <div min-h-0 flex-1>
        <slot />
      </div>
    </div>
  </main>
</template>
