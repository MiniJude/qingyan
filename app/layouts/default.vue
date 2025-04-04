<template>
  <main h-full w-full flex>
    <SideBar />
    <div min-w-0 flex flex-1 flex-col>
      <Header />
      <div min-h-0 flex-1>
        <slot />
      </div>
    </div>
  </main>
</template>
