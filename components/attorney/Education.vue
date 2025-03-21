<script setup lang="ts">
import Chronology from '~/components/attorney/Chronology.vue'

interface Event {
  date: string
  content: string
}

type Props = {
  title?: string
  education: Event[]
}

withDefaults(defineProps<Props>(), {
  title: 'Education',
})
</script>

<template>
  <Chronology :title="title" :events="education" />
</template>

<style scoped lang="postcss"></style>
