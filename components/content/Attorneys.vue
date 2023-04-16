<template>
  <div class="cards">
    <AttorneyCard
      v-for="person in attorneys"
      :key="person.initials"
      :person="person"
    />
  </div>
</template>
<script setup lang="ts">
const { data } = await useAsyncData('pa', () =>
  queryContent('/en/team/').only(['title', 'initials', '_path']).find(),
)
const attorneys = computed(() =>
  (data.value || []).map(attorney => ({
    initials: attorney.initials,
    name: attorney.title,
    link: attorney._path,
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
