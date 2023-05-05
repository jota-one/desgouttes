<template>
  <h1>{{ displayName }}</h1>
  <div>
    <ul>
      <li v-for="(activity, index) in activities" :key="index">
        {{ activity }}
      </li>
    </ul>
    <div>
      <div>
        <h4>
          <img src="/imgs/icons/language-icon.png" alt="language" /> Languages
        </h4>
        {{ spokenLanguages }}
      </div>
      <div>
        <h4>
          <img src="/imgs/icons/contact-icon.png" alt="contact" /> Contact
          details
        </h4>
        <a :href="`mailto:${email}`"> {{ email }} </a><br />
        T. {{ phone }}<br />
        <a :href="`/vcards/${initials.toUpperCase()}.vcf`">Download eCard</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const languageRefs: Record<string, string> = {
  en: 'English',
  fr: 'French',
  de: 'German',
  de_ch: '(Swiss-)German',
  it: 'Italian',
  es: 'Spanish',
  sp: 'Spanish',
  pt: 'Portuguese',
  ar_eg: 'Arabic (Egyptian)',
  tr: 'Turkish',
}
type Props = {
  activities: string[]
  firstname: string
  lastname: string
  languages: string[]
  email: string
  phone: string
  initials: string
}
const props = defineProps<Props>()

const displayName = computed(() => `${props.firstname} ${props.lastname}`)
const spokenLanguages = computed(() =>
  props.languages.map(ln => languageRefs[ln]).join(', '),
)
</script>

<style scoped></style>
