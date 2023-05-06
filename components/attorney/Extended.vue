<template>
  <div>
    <h2>Extended Profile</h2>
    <div class="flex items-center">
      <img src="/imgs/icons/pdf-icon.png" alt="contact" class="mr-2" />
      <a :href="url" target="_blank">PDF version</a>
    </div>
  </div>
</template>

<script setup lang="ts">
type Props = {
  initials: string
  version?: string
}
const props = defineProps<Props>()

const url = computed(() => {
  return `/pdf/${props.initials.toUpperCase()}${
    props.version ? '-' + props.version : ''
  }.pdf`
})
</script>

<style scoped></style>
