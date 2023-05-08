<template>
  <div>
    <h2 class="title">{{ title }}</h2>
    <ul>
      <li v-for="({ link, label }, index) in items" :key="index">
        <NuxtLink v-if="link" :href="link">{{ label }}</NuxtLink>
        <template v-else>{{ label }}</template>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
interface Item {
  link: string
  label: string
}
type Props = {
  title: string
  items: Item[]
}
defineProps<Props>()
</script>

<style lang="postcss" scoped>
.title {
  padding-top: var(--size-base-5);
  font-size: 30px;
}
</style>
