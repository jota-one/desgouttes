<template>
  <NuxtLink class="card" :href="pa.link">
    <h3 class="title">{{ pa.title }}</h3>
  </NuxtLink>
</template>

<script setup lang="ts">
interface PracticeArea {
  title: string
  link: string
}

type Props = {
  pa: PracticeArea
}

defineProps<Props>()
</script>

<style lang="postcss" scoped>
@import '/assets/styles/_mediaquery.pcss';

.card {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 14px;
  line-height: 1.2;
  border: 2px solid rgb(var(--color-neutral));
  transition: all 0.2s ease-in-out;

  &:nth-child(even) {
    border-color: rgb(var(--color-white));
  }

  &:hover {
    color: rgb(var(--color-white));
    background: rgba(var(--color-primary), 0.9);
    border-color: rgba(var(--color-primary), 0.9);
  }

  @media (--mobile-only) {
    margin: 0 auto;
    width: 80vw;
    padding: var(--size-base-12) var(--size-base-4);
  }

  @media (--tablet) {
    padding: var(--size-base-4);

    &:nth-child(2n + 5) {
      border-color: rgb(var(--color-white));
    }

    &:nth-child(2n + 6) {
      border-color: rgb(var(--color-neutral));
    }

    &:nth-child(2n + 10) {
      border-color: rgb(var(--color-white));
    }

    &:nth-child(2n + 9) {
      border-color: rgb(var(--color-neutral));
    }
  }

  @media (--laptop) {
    position: relative;
    height: 0;
    padding: 0;
    padding-bottom: 100%;

    .title {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      padding: var(--size-base-4);
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  @media (--desktop) {
    font-size: 17px;
    height: 0;
    padding: 0;
    padding-bottom: 100%;
  }
}
</style>
