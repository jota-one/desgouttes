<template>
  <nav :class="['nav', { opened }]">
    <button class="close" @click="$emit('close')" />
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
}

.active {
  color: rgb(var(--color-primary));
  border-color: rgb(var(--color-primary));
}

.close {
  align-self: flex-start;
  margin: var(--size-base-2) var(--size-base-2) var(--size-base-10);
  width: var(--size-base-6);
  height: var(--size-base-6);
  background: gray;
  cursor: pointer;

  @media (--tablet) {
    display: none;
  }
}
</style>
