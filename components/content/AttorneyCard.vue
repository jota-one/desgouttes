<template>
  <NuxtLink class="card" :href="person.link">
    <img class="image" :src="`/imgs/people/${person.initials}.jpg`" />
    <div class="overlay">
      {{ person.name }}
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
export interface Person {
  initials: string
  name: string
  link: string
}

type Props = {
  person: Person
}

defineProps<Props>()
</script>

<style lang="postcss" scoped>
@import '/assets/styles/_mediaquery.pcss';

.card {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  max-width: 15rem;

  @media (--tablet) {
    width: 12rem;
  }

  &:hover {
    .overlay {
      opacity: 1;
    }

    .image {
      filter: grayscale();
    }
  }
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: rgb(var(--color-white));
  background: rgb(var(--color-primary), 0.7);
  opacity: 0;
  transition: opacity 0.1s linear;
}

.image {
  width: 100%;
  height: 100%;
}
</style>
