<template>
  <div>
    <h2>{{ title }}</h2>
    <dl>
      <template v-for="({ date, content }, index) in events" :key="index">
        <dt>{{ date }}</dt>
        <dd>{{ content }}</dd>
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

<style scoped></style>
