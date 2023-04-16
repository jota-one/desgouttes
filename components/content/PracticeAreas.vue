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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (--desktop) {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
