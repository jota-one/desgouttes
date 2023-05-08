<template>
  <div>
    <h2 class="title">Extended Profile</h2>
    <a class="download-link" :href="url" target="_blank">
      <img src="/imgs/icons/pdf-icon.png" alt="contact" />
      PDF version
    </a>
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

<style lang="postcss" scoped>
.title {
  padding-top: var(--size-base-5);
  font-size: 30px;
}

.download-link {
  display: flex;
  align-items: center;
  gap: var(--size-base-2);
  font-size: 20px;
  color: rgb(var(--color-neutral-dark));

  &:hover {
    color: rgb(var(--color-primary));
  }

  img {
    height: var(--size-base-8);
  }
}
</style>
