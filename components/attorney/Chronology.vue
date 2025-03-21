<template>
  <div>
    <component
      :is="subSection ? 'h3' : 'h2'"
      :class="{ title: !subSection, subtitle: subSection }"
      >{{ title }}</component
    >
    <dl v-if="events.length > 0" class="list">
      <template v-for="({ date, content }, index) in sortedEvents" :key="index">
        <dt class="list-title">{{ date }}</dt>
        <dd class="list-detail" v-html="content" />
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
  subSection?: boolean
  events: Event[]
}

const props = defineProps<Props>()

const sortedEvents = computed(() => [...props.events].reverse())
</script>

<style lang="postcss" scoped>
@import '/assets/styles/_mediaquery.pcss';

.title {
  margin: 0;
  padding-top: var(--size-base-5);
  font-size: 30px;
}

.subtitle {
  margin: 0;
  padding-top: var(--size-base-5);
  font-size: 24px;
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
