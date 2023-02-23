<template>
  <div class="cards">
    <slot/>
  </div>
</template>

<style lang="postcss" scoped>
@import '~/assets/styles/_mediaquery.pcss';

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