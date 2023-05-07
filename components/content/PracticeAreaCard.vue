<template>
  <NuxtLink class="card" :href="pa.link">
    <h3 class="title">{{ pa.title }}</h3>
  </NuxtLink>
</template>

<script setup lang="ts">
interface PracticeArea {
  title: string
  link: string
}

type Props = {
  pa: PracticeArea
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
  border: 2px solid #adadad;

  padding: 5px;
  background-color: #e7eeef;
  overflow: hidden;
  align-items: center;

  @media (--tablet) {
    width: 12rem;
  }

  &:hover {
  }

  .title {
    width: 100%;
    text-align: center;
    font-size: 21px;
    padding: 0 15%;
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
</style>
