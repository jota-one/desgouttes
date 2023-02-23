<template>
  <header class="container">
    <img class="image" src="/imgs/logo.png" width="300" height="77.5"/>
    <nav class="nav">
      <NuxtLink href="/en/about">About us</NuxtLink>
      <NuxtLink href="/en/practice-areas">Practice areas</NuxtLink>
      <NuxtLink href="/en/team">Our team</NuxtLink>
      <a href="#">Careers</a>
      <a href="#">Contact</a>
    </nav>
  </header>
  <main class="container">
    <slot/>
  </main>
  <footer></footer>
</template>

<style lang="postcss" scoped>
@import '~/assets/styles/_mediaquery.pcss';

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