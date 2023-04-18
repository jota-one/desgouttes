<template>
  <div class="big-image"></div>
  <div class="website">
    <header class="sidebar">
      <div class="logo">
        <NuxtLink href="/"
          ><img class="img-responsive" src="/imgs/logo.png" alt=""
        /></NuxtLink>
      </div>
      <Navigation class="nav" />
    </header>
    <main class="main">
      <div class="welcome">
        <slot />
      </div>
    </main>
  </div>
</template>
<style lang="postcss" scoped>
.big-image {
  background-image: url(/imgs/homepage.jpg);
  background-size: cover;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 25%;
  right: 0;
  overflow: hidden;
  z-index: -1;
}

.website {
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100%;
}

.sidebar {
  background-color: #e7eeef;
  width: 25%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 7vh 3vw 0 0;
}

.logo {
  width: 55%;
  margin-bottom: 6rem;
}

.nav {
  display: flex;
  flex-direction: column;
  text-transform: uppercase;
  align-items: flex-end;
  width: 150px;
}

.main {
  flex: 1;
}

.welcome {
  background-color: rgba(var(--color-primary), 0.6);
  @apply flex-1 text-2xl relative text-white py-6 pl-36;
  left: -25%;
  letter-spacing: 0.5em;
  margin-top: 460px;
  width: 95%;

  :deep(p) {
    margin: 0;
  }
}
</style>
