<template>
  <div class="sub-nav-item" :title="title">
    <h2 class="title">{{ title }}</h2>
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
}

defineProps<Props>()
</script>

<style lang="postcss" scoped>
.sub-nav-item {
  max-height: 0;
  overflow: hidden;

  &.opened {
    max-height: 1000vh;
  }

  .title {
    margin: 0;
    font-size: 36px;
  }
}
</style>
