<template>
  <nav class="nav">
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
const { navigation, page } = useContent()

const i18nNavigation = computed(() =>
  navigation.value
    .find(item => item._path === '/en')
    .children.map(subItem => {
      subItem.active = page.value._path.includes(subItem._path)
      return subItem
    }),
)
</script>
<style scoped>
.item {
  @apply my-2 tracking-widest text-right;
  padding: 0 18px 0 0;
}
.active {
  color: rgb(var(--color-primary));
  border-right: 2px solid rgb(var(--color-primary));
}
</style>
