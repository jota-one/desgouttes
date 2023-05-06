<template>
  <div>
    <h2>{{ title }}</h2>
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

<style scoped></style>
