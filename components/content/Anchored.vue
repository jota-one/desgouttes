<template>
  <div class="anchored">
    <div class="heading">
      <div class="heading-sticky">
        <h1 class="title">{{ title }}</h1>
        <nav v-if="nav.length" class="nav">
          <a
            v-for="item in nav"
            :key="item.anchor"
            :href="`#${item.anchor}`"
            class="item"
          >
            {{ item.title }}
          </a>
        </nav>
      </div>
    </div>
    <div ref="container" class="content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  on: string
}

interface NavItem {
  anchor: string
  title: string
}

const props = defineProps<Props>()

const container = ref(null)
const nav = ref<NavItem[]>([])

const getItems = (): HTMLElement[] | undefined => {
  if (!container.value) {
    return
  }

  const containerEl: HTMLElement = container.value
  return Array.from(containerEl.querySelectorAll(props.on))
}

onMounted(async () => {
  const childrenEl = getItems()

  if (!childrenEl) {
    return
  }

  const children = []

  for (let i = 0; i < childrenEl.length; i++) {
    const child = childrenEl[i] as HTMLElement
    children.push({ title: child.innerText, anchor: child.id })
  }

  await nextTick()
  nav.value = children
})
</script>

<style lang="postcss" scoped>
@import '/assets/styles/_mediaquery.pcss';

.anchored {
  padding: var(--size-base-6);

  @media (--tablet) {
    display: flex;
    gap: var(--size-base-5);
    padding: 0;
  }
}

.heading {
  @media (--tablet) {
    flex: 1;
  }
}

.heading-sticky {
  position: sticky;
  top: var(--size-base-2);

  @media (--desktop) {
    top: var(--size-base-6);
  }
}

.content {
  margin-top: var(--size-base-5);

  @media (--tablet) {
    flex: 2;
  }
}

.title {
  margin: 0 0 var(--size-base-3);
}

.nav {
  display: flex;
  flex-direction: column;
  padding: var(--size-base-5);
  margin-bottom: var(--size-base-8);
  background: rgb(var(--color-bg));
}

.item {
  display: flex;
  align-items: flex-start;
  margin-left: calc(-1 * var(--size-base));
  padding-bottom: var(--size-base-2);
  font-size: 16px;

  &:hover:before {
    border-color: rgb(var(--color-black));
  }

  &:before {
    flex-shrink: 0;
    margin-top: var(--size-base);
    margin-right: var(--size-base-3);
    content: '';
    width: calc(1.75 * var(--size-base));
    height: calc(1.75 * var(--size-base));
    border-left: 2px solid;
    border-bottom: 2px solid;
    transform: rotate(-45deg) translate(var(--size-base));
    transform-origin: center;
    opacity: 0.6;
  }
}
</style>
