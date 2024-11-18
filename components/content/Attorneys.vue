<template>
  <div class="cards">
    <AttorneyCard
      v-for="person in attorneys"
      :key="person.initials"
      :person="person"
      class="card"
    />
  </div>
</template>
<script setup lang="ts">
const { data } = await useAsyncData('attorneys', () =>
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
    grid-template-columns: repeat(6, 1fr);

    .card {
      grid-column: span 2;
    }

    .card:last-child:nth-child(3n - 1) {
      grid-column-end: -2;
    }

    .card:nth-last-child(2):nth-child(3n + 1) {
      grid-column-end: 4;
    }

    /* Dealing with single orphan */
    card:last-child:nth-child(3n - 2) {
      grid-column-end: 5;
    }
  }

  @media (--laptop) {
    grid-template-columns: repeat(8, 1fr);

    .card:last-child:nth-child(4n - 1) {
      grid-column-end: -2;
    }

    .card:nth-last-child(3):nth-child(4n + 1) {
      grid-column-end: 4;
    }

    .card:nth-last-child(2):nth-child(3n + 1) {
      grid-column-end: 6;
    }

    /* Dealing with single orphan */
    card:last-child:nth-child(4n - 2) {
      grid-column-end: 7;
    }
  }
}
</style>
