<template>
  <article
    :class="[
      'article',
      { 'hide-h1': page?.hideTitle, 'homepage': page?.homepage },
    ]"
  >
    <header class="header">
      <button
        v-if="!page?.homepage"
        class="hamburger"
        @click="navigationOpened = true"
      />
      <NuxtLink href="/" class="logo">
        <img src="/imgs/logo.png" alt="" />
      </NuxtLink>
      <Navigation
        class="navigation"
        :homepage="Boolean(page?.homepage)"
        :opened="navigationOpened"
        @close="navigationOpened = false"
      />
      <img
        v-if="page.navBanner"
        :src="`/imgs/generic/${navBannerImage}`"
        width="160"
        height="160"
        class="nav-banner"
      />
    </header>
    <div v-if="page?.homepage" class="homepage-welcome">
      <slot />
    </div>
    <div class="wrapper">
      <div class="banner">
        <img v-if="page.banner" :src="`/imgs/hero/${page.banner}`" />
      </div>
      <main class="main">
        <div :class="['body', { transparent: !page.bodyBg }]">
          <slot v-if="!page?.homepage" />
          <NuxtLink
            v-if="page.backOnClose"
            :href="page.backOnClose"
            class="close"
          />
        </div>
        <PageFooter v-if="!page.noFooter && !page?.homepage" class="footer" />
      </main>
    </div>
  </article>
</template>
<script setup lang="ts">
const { page } = useContent()
const navigationOpened = ref(false)
const navBannerImage = computed(() =>
  page.value.navBanner?.replace(
    'RANDOM',
    (Math.random() * 15).toString().split('.')[0],
  ),
)
</script>

<style lang="postcss" scoped>
@import '/assets/styles/_mediaquery.pcss';

.article {
  min-height: 100vh;
  height: 100%;
  max-width: var(--size-page-max-width);
  margin: 0 auto;

  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto 1fr;
  grid-template-areas:
    'header'
    'banner'
    'body';

  @media (--tablet) {
    grid-template-columns: 25% auto;
    grid-template-rows: auto 1fr;
    grid-template-areas:
      'header banner'
      'header body';
  }

  &.homepage {
    @media (--mobile-only) {
      display: flex;
      flex-direction: column;
    }

    @media (--tablet) {
      position: relative;
    }
  }
}

.header {
  grid-area: header;
  display: flex;

  @media (--mobile-only) {
    justify-content: space-between;
  }

  @media (--tablet) {
    flex-direction: column;
    align-items: flex-end;
    padding: var(--size-base-10) 0;
  }

  .homepage & {
    background: rgb(var(--color-bg));

    @media (--mobile-only) {
      position: absolute;
      width: 75vw;
      top: var(--size-base-12);
      left: 12.5vw;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--size-base-9);
      background: rgba(var(--color-bg), 0.85);
      box-shadow: 0 0 var(--size-base-6) rgba(var(--color-black), 0.5);
    }
  }

  .logo {
    display: flex;
    justify-content: flex-end;
    margin: var(--size-base-6);
    height: var(--size-base-9);

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    @media (--tablet) {
      margin: 0 var(--size-base-6) var(--size-base-12);
      width: 70%;
      max-width: 180px;
      height: auto;
    }

    @media (--desktop) {
      width: 180px;
      margin-right: var(--size-base-15);
      margin-bottom: var(--size-base-18);
    }

    .homepage & {
      @media (--mobile-only) {
        margin: 0;
        width: 100%;
        max-width: 400px;
        height: auto;
        margin-bottom: var(--size-base-8);
      }
    }
  }

  .nav-banner {
    margin: var(--size-base-5) calc(-1 * var(--size-base-4)) 0 0;
    width: auto;
    max-width: 100%;
    max-height: 320px;
    height: auto;
    z-index: 2;

    @media (--mobile-only) {
      display: none;
    }
  }
}

.homepage-welcome {
  @media (--mobile-only) {
    display: none;
  }

  @media (--tablet) {
    position: absolute;
    top: 0;
    left: 0;
    margin: 450px 100px 100px 100px;
    padding: var(--size-base-2) var(--size-base-8);
    letter-spacing: var(--size-base-2);
    color: rgb(var(--color-white));
    background: rgba(var(--color-primary), 0.6);

    :deep(h1) {
      font-size: 20px;
    }
  }

  @media (--tablet) {
    margin: 450px 160px 100px 70px;
    padding: var(--size-base-2) 60px;
  }

  @media (--desktop) {
    padding: var(--size-base-2) 160px;

    :deep(h1) {
      font-size: 24px;
    }
  }
}

.hamburger {
  position: relative;
  margin: var(--size-base-7) var(--size-base-6) var(--size-base-6);
  width: var(--size-base-6);
  height: var(--size-base-4);
  border-top: 2px solid rgb(var(--color-neutral));
  border-bottom: 2px solid rgb(var(--color-neutral));
  cursor: pointer;
  transition: border-color 0.1s ease-in-out;

  @media (--tablet) {
    display: none;
  }

  &:after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: calc(50% - 1px);
    height: 2px;
    background: rgb(var(--color-neutral));
    transition: background 0.1s ease-in-out;
  }

  &:hover {
    border-color: rgb(var(--color-primary));

    &:after {
      background: rgb(var(--color-primary));
    }
  }
}

.banner {
  grid-area: banner;
  min-height: 80px;

  @media (--tablet) {
    position: sticky;
    top: 0;
    min-height: 220px;
  }

  img {
    display: block;
    width: 100%;
    height: auto;
    object-fit: cover;
  }
}

.wrapper {
  background: rgb(var(--color-bg));

  @media (--tablet) {
    overflow: auto;
    height: 100vh;
  }

  .homepage & {
    background-image: url(/imgs/homepage.jpg);
    background-size: cover;

    @media (--mobile-only) {
      height: 100vh;
    }
  }
}

.main {
  position: relative;
  grid-area: body;
  display: flex;
  flex-direction: column;
  padding-bottom: var(--size-base-6);
  z-index: 1;

  @media (--tablet) {
    padding-bottom: var(--size-base-6);
  }

  @media (--desktop) {
    padding-bottom: var(--size-base-12);
  }

  .homepage & {
    padding: var(--size-base-3);
    color: rgb(var(--color-white));
    background: transparent;

    @media (--mobile-only) {
      display: none;
    }
  }
}

.body,
.footer {
  background: rgb(255, 255, 255, 0.9);
  margin: 0 var(--size-base-4);
  padding: var(--size-base-4);

  @media (--tablet) {
    margin: 0 var(--size-base-6);
    padding: var(--size-base-4);
  }

  @media (--desktop) {
    margin: 0 var(--size-base-12);
    padding: var(--size-base-12);
  }

  &.transparent {
    padding-left: var(--size-base-4);
    padding-right: var(--size-base-4);
    background: transparent;
  }
}

.body {
  position: relative;
  flex-grow: 1;
  margin-top: calc(-1 * var(--size-base-12));

  @media (--tablet) {
    margin-top: calc(-1 * var(--size-base-9));
    padding-bottom: 0;
  }

  .close {
    position: absolute;
    top: var(--size-base-4);
    right: var(--size-base-4);
    width: var(--size-base-6);
    height: var(--size-base-6);
    transform: rotate(45deg);
    transform-origin: center;
    cursor: pointer;

    &:before,
    &:after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: calc(50% - 1px);
      height: 2px;
      background: rgb(var(--color-neutral));
      transition: background 0.2s ease-in-out;
    }

    &:after {
      transform: rotate(90deg);
      transform-origin: center;
    }

    &:hover:before,
    &:hover:after {
      background: rgb(var(--color-primary));
    }
  }
}

.footer {
  @media (--tablet) {
    padding-top: var(--size-base-10);
    padding-bottom: var(--size-base-10);
  }
}
</style>
