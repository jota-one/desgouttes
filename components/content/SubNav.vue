<template>
  <div class="sub-nav">
    <nav class="nav">
      <button
        v-for="(item, index) in nav"
        :key="item"
        class="item"
        @click="navigate(index)"
      >
        {{ item }}
      </button>
    </nav>
    <div ref="container" class="content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
enum CSS_CLASS {
  ITEM = 'sub-nav-item',
  OPENED = 'opened',
}

const container = ref(null)
const nav = ref<string[]>([])

const getItems = (): HTMLElement[] | undefined => {
  if (!container.value) {
    return
  }

  const containerEl: HTMLElement = container.value
  return Array.from(containerEl.querySelectorAll(`.${CSS_CLASS.ITEM}`))
}

const navigate = (index: number) => {
  const childrenEl = getItems()

  if (!childrenEl) {
    return
  }

  childrenEl.forEach((itemEl: HTMLElement, i: number) => {
    itemEl.classList.remove(CSS_CLASS.OPENED)

    if (i === index) {
      itemEl.classList.add(CSS_CLASS.OPENED)
    }
  })
}

onMounted(async () => {
  const childrenEl = getItems()

  if (!childrenEl) {
    return
  }

  const children = []

  for (let i = 0; i < childrenEl.length; i++) {
    const child = childrenEl[i] as HTMLElement
    children.push(child.title)

    if (i === 0) {
      child.classList.add(CSS_CLASS.OPENED)
    }
  }

  await nextTick()
  nav.value = children
})
</script>

<style lang="postcss" scoped>
@import '/assets/styles/_mediaquery.pcss';

.sub-nav {
  display: flex;
  flex-direction: column;

  @media (--tablet) {
    flex-direction: row;
  }
}

.content {
  display: flex;
  flex-direction: column;
  padding-top: var(--size-base);
  overflow: hidden;

  @media (--tablet) {
    flex: 3;
    padding-top: var(--size-base-8);
  }

  @media (--desktop) {
    padding-top: var(--size-base-3);
  }
}

.nav {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: var(--size-base-5) var(--size-base-5);

  @media (--tablet) {
    flex: 1;
    padding-top: var(--size-base-8);
  }

  @media (--desktop) {
    padding-top: var(--size-base-3);
  }
}

.item {
  padding: var(--size-base-2) var(--size-base-3);
  font-family: inherit;
  font-size: 20px;
  cursor: pointer;

  &:hover {
    color: rgb(var(--color-primary));
  }
}
</style>
