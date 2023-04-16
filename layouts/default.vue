<template>
  <header class="container">
    <img class="image" src="/imgs/logo.png" width="300" height="77.5" alt="" />
    <Navigation class="nav" />
  </header>
  <main class="container">
    <slot />
  </main>
  <footer>
    Copyright © 2017-{{ year }} Des Gouttes & Associés -
    <a href="/pdf/privacy-policy-19-09-18.pdf" target="_blank"
      >Privacy Policy</a
    >
  </footer>
</template>
<script setup lang="ts">
const year = computed(() => new Date().getFullYear())
</script>
<style lang="postcss" scoped>
@import '/assets/styles/_mediaquery.pcss';

.image {
  margin: 3rem;
}

.nav {
  display: flex;
  flex-direction: column;
}

.container {
  margin: 0 auto;
  max-width: 1400px;
}
</style>
