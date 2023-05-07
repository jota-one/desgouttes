<template>
  <div class="cards">
    <PracticeAreaCard v-for="pa in practiceAreas" :key="pa.link" :pa="pa" />
  </div>
</template>

<script setup lang="ts">
const { data } = await useAsyncData('pa', () =>
  queryContent('/en/practice-areas/').only(['title', '_path']).find(),
)

const practiceAreas = computed(() =>
  (data.value || []).map(item => ({
    title: item.title,
    link: item._path,
  })),
)
</script>

<style lang="postcss" scoped>
@import '/assets/styles/_mediaquery.pcss';

.cards {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  margin: 0 auto;
  gap: var(--size-base-4);

  @media (--tablet) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (--desktop) {
    gap: var(--size-base-6);
  }
}
</style>
