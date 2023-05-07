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
  queryContent('/en/team/')
    .only(['title', 'initials', 'firstname', 'lastname', '_path'])
    .find(),
)
const attorneys = computed(() =>
  (data.value || []).map(attorney => ({
    initials: attorney.initials,
    name: `${attorney.firstname} ${attorney.lastname}`,
    link: attorney._path,
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
    grid-template-columns: repeat(3, 1fr);
  }

  @media (--laptop) {
    grid-template-columns: repeat(5, 1fr);
  }
}
</style>
