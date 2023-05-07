<template>
  <nav :class="['nav', { opened, homepage }]">
    <button v-if="!homepage" class="close" @click="$emit('close')" />
    <NuxtLink
      v-for="({ _path: path, title, active }, index) in i18nNavigation"
      :key="index"
      :href="path"
      class="item"
      :class="{ active }"
      >{{ title }}</NuxtLink
    >
  </nav>
  <!--  <pre>{{ page }}</pre>-->
  <!--  <pre>{{ i18nNavigation }}</pre>-->
</template>

<script setup lang="ts">
interface Props {
  opened: boolean
  homepage: boolean
}

defineProps<Props>()
defineEmits(['close'])

const { navigation, page } = useContent()

const i18nNavigation = computed(() =>
  navigation.value
    .find((item: any) => item._path === '/en')
    .children.map((subItem: any) => {
      subItem.active = page.value._path.includes(subItem._path)
      return subItem
    }),
)
</script>

<style lang="postcss" scoped>
@import '/assets/styles/_mediaquery.pcss';

.nav {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--size-base-4);
  padding: var(--size-base-4);

  &:not(.homepage) {
    @media (--mobile-only) {
      position: fixed;
      height: 100vh;
      width: 250px;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(var(--size-base-2));
      box-shadow: 0 0 var(--size-base-4) transparent;
      transform: translateX(-250px);
      transition: all 0.15s ease-in-out;
      z-index: 10;

      &.opened {
        transform: translateX(0);
        box-shadow: 0 0 var(--size-base-10) rgba(100, 100, 100, 0.5);
      }
    }

    @media (--desktop) {
      padding-right: var(--size-base-10);
    }
  }

  &.homepage {
    @media (--mobile-only) {
      align-items: center;
      gap: var(--size-base-3);
      background: rgba(var(--color-bg), 0.8);
      width: 100%;
    }
  }
}

.item {
  padding: 0 var(--size-base) 0 0;
  text-transform: uppercase;
  text-align: right;
  font-size: 15px;
  letter-spacing: 0.2em;
  border-right: 2px solid transparent;

  @media (--desktop) {
    padding-right: var(--size-base-4);
  }

  .homepage & {
    @media (--mobile-only) {
      padding: 0;
      text-align: center;
    }

    @media (--desktop) {
      padding-right: var(--size-base-10);
    }
  }
}

.active {
  color: rgb(var(--color-primary));
  border-color: rgb(var(--color-primary));
}

.close {
  position: relative;
  align-self: flex-start;
  margin: var(--size-base-2) var(--size-base-2) var(--size-base-10);
  width: var(--size-base-6);
  height: var(--size-base-6);
  transform: rotate(45deg);
  transform-origin: center;
  cursor: pointer;

  @media (--tablet) {
    display: none;
  }

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
</style>
