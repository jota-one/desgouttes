<template>
  <div>
    <h2 class="title">Expertise</h2>
    <template v-for="(domain, index) in formattedDomains" :key="index">
      <h3 class="sub-title" v-html="domain.title"></h3>
      <ContentRendererMarkdown :value="domain.content" />
      <div v-if="domain.publications" class="disclaimer">
        For a list of publications and conferences, see below under Extended
        Profile
      </div>
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
  publications?: boolean
}
interface FormattedDomain {
  title: string
  content: string
  publications: boolean
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
  return domain.expertise
    ? parseMarkdown(domain.expertise)
    : Promise.resolve('')
}

const formatDomains = async () => {
  const formatted: FormattedDomain[] = []
  for (const domain of props.domains) {
    const title = getTitle(domain)
    const content = await getContent(domain)
    if (content) {
      formatted.push({ title, content, publications: domain.publications })
    }
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

.disclaimer {
  font-size: 16px;
  font-style: italic;
}
</style>
