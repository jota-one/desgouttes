<template>
  <pre>{{ data }}</pre>
</template>

<script setup lang="ts">
const { data } = await useAsyncData('pa', () => queryContent('/en/practice-areas/').only(['title', '_path']).find())

</script>

<style scoped>

</style>
