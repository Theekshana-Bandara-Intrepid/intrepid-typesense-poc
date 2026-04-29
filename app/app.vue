<template>
  <div id="app">
    <LayoutAppHeader />
    <main class="main-content">
      <NuxtRouteAnnouncer />
      <NuxtPage />
    </main>
    <LayoutAppFooter />
  </div>
</template>

<style scoped>
.main-content {
  min-height: calc(100vh - var(--header-height) - 200px);
}
</style>
