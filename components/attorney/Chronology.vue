<template>
  <div>
    <h2 class="title">{{ title }}</h2>
    <dl class="list">
      <template v-for="({ date, content }, index) in events" :key="index">
        <dt class="list-title">{{ date }}</dt>
        <dd class="list-detail">{{ content }}</dd>
      </template>
    </dl>
  </div>
</template>

<script setup lang="ts">
interface Event {
  date: string
  content: string
}

type Props = {
  title: string
  events: Event[]
}

defineProps<Props>()
</script>

<style lang="postcss" scoped>
@import '/assets/styles/_mediaquery.pcss';

.title {
  margin: 0;
  padding-top: var(--size-base-5);
  font-size: 30px;
}

.list {
  @media (--mobile-only) {
    display: flex;
    flex-direction: column;
  }

  @media (--resume-2-cols) {
    display: grid;
    grid-template-columns: var(--size-base-20) 1fr;
  }
}

.list-title {
  font-size: 20px;

  @media (--resume-2-cols) {
    font-size: inherit;
    grid-column: 1;
  }
}

.list-detail {
  padding: 0;
  margin: 0;
  padding-bottom: var(--size-base-3);
  font-size: 18px;

  @media (--resume-2-cols) {
    grid-column: 2;
  }
}
</style>
