<template>
  <div class="page-footer">
    <div>
      Copyright © 2017-{{ year }} Des Gouttes & Associés -
      <a class="link" href="/pdf/privacy-policy-19-09-18.pdf" target="_blank">
        Privacy Policy
      </a>
    </div>
    <a href="https://jota.one" target="_blank" class="jota">
      <img src="/imgs/jota.svg" />
    </a>
  </div>
</template>

<script setup lang="ts">
const year = computed(() => new Date().getFullYear())
</script>

<style lang="postcss" scoped>
@import '/assets/styles/_mediaquery.pcss';

.page-footer {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--size-base-2);
  font-size: 13px;

  @media (--tablet) {
    flex-direction: row;
    align-items: center;
  }
}

.jota {
  align-self: flex-end;

  img {
    width: 100px;
    margin-top: var(--size-base);
  }
}
</style>
