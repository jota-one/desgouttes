<template>
  <article :class="['article', { 'hide-h1': page?.hideTitle }]">
    <header class="header">
      <button class="hamburger" @click="navigationOpened = true" />
      <img class="logo" src="/imgs/logo.png" alt="" />
      <Navigation
        class="navigation"
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
    <div class="wrapper">
      <div class="banner">
        <img v-if="page.banner" :src="`/imgs/hero/${page.banner}`" />
      </div>
      <main class="main">
        <div :class="['body', { transparent: !page.bodyBg }]">
          <slot />
          <NuxtLink
            v-if="page.backOnClose"
            :href="page.backOnClose"
            class="close"
          />
        </div>
        <div v-if="!page.noFooter" class="footer">
          <div>
            Copyright © 2017-{{ year }} Des Gouttes & Associés -
            <a
              class="link"
              href="/pdf/privacy-policy-19-09-18.pdf"
              target="_blank"
            >
              Privacy Policy
            </a>
          </div>
          <a href="https://jota.one" target="_blank" class="jota">
            <img src="/imgs/jota.svg" />
          </a>
        </div>
      </main>
    </div>
  </article>
</template>
<script setup lang="ts">
const year = computed(() => new Date().getFullYear())
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
  max-width: 1600px;
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

  .logo {
    margin: var(--size-base-6);
    height: var(--size-base-9);
    width: auto;

    @media (--tablet) {
      margin: 0 var(--size-base-6) var(--size-base-12);
      width: 70%;
      max-width: 180px;
      height: auto;
    }

    @media (--desktop) {
      width: 180px;
      margin-right: var(--size-base-14);
      margin-bottom: var(--size-base-18);
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
  display: flex;
  justify-content: space-between;
  font-size: 13px;

  @media (--tablet) {
    padding-top: var(--size-base-10);
    padding-bottom: var(--size-base-10);
  }
}

.jota {
  img {
    width: 100px;
  }
}
</style>
