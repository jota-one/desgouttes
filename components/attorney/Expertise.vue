<template>
  <div>
    <h2 class="title">Expertise</h2>
    <template v-for="(domain, index) in formattedDomains" :key="index">
      <h3 class="sub-title" v-html="domain.title"></h3>
      <ContentRendererMarkdown v-if="domain.content" :value="domain.content" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { parseMarkdown } from '~/helpers/md'

export interface PracticeArea {
  id: string
  link: string
  title: string
}

interface ExpertiseDomain {
  practiceArea?: string
  title?: string
  expertise: string
}
interface FormattedDomain {
  title: string
  content: string
}
type Props = {
  practiceAreas: PracticeArea[]
  domains: ExpertiseDomain[]
}
const props = defineProps<Props>()
const formattedDomains = ref<FormattedDomain[]>([])

const getTitle = (domain: ExpertiseDomain) => {
  const foundPa =
    domain.practiceArea &&
    props.practiceAreas.find(pa => pa.id === domain.practiceArea)
  if (foundPa) {
    return `<a href="${foundPa.link}">${domain.title || foundPa.title}</a>`
  }
  return domain.title || domain.practiceArea || ''
}

const getContent = (domain: ExpertiseDomain) => {
  return parseMarkdown(domain.expertise)
}

const formatDomains = async () => {
  const formatted: FormattedDomain[] = []
  for (const domain of props.domains) {
    const title = getTitle(domain)
    const content = await getContent(domain)
    formatted.push({ title, content })
  }
  return formatted
}

onMounted(async () => {
  formattedDomains.value = await formatDomains()
})
</script>

<style lang="postcss" scoped>
@import '/assets/styles/_mediaquery.pcss';

.title {
  margin-bottom: calc(-1 * var(--size-base-6));
  font-size: 30px;
}

.sub-title {
  padding-top: var(--size-base-5);

  @media (--resume-2-cols) {
    font-size: 24px;
  }
}
</style>
