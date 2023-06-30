<template>
  <h1 class="title">{{ displayName }}</h1>
  <div class="details">
    <ul class="activities">
      <li v-for="(activity, index) in activities" :key="index">
        {{ activity }}
      </li>
    </ul>
    <div class="contact">
      <div class="block">
        <h4 class="block-title">
          <img src="/imgs/icons/language-icon.png" alt="language" /> Languages
        </h4>
        {{ spokenLanguages }}
      </div>
      <div class="block">
        <h4 class="block-title">
          <img src="/imgs/icons/contact-icon.png" alt="contact" /> Contact
          details
        </h4>
        <a :href="`mailto:${email}`"> {{ email }} </a>
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
  no: 'Norwegian',
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

<style lang="postcss" scoped>
@import '/assets/styles/_mediaquery.pcss';

.title {
  padding-bottom: var(--size-base-3);
  font-size: 18px;
  letter-spacing: var(--size-base);
  text-transform: uppercase;
  color: rgb(var(--color-primary));

  @media (--resume-2-cols) {
    font-size: 24px;
  }

  @media (--desktop) {
    font-size: 26px;
  }
}

.details {
  display: flex;
  flex-direction: column;
  gap: var(--size-base-6);

  @media (--desktop) {
    flex-direction: row;
  }
}

.activities {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--size-base-2);

  @media (--desktop) {
    flex: 1;
    padding: var(--size-base-2) 0;
  }
}

.contact {
  border: 1px solid rgb(var(--color-neutral));

  @media (--desktop) {
    flex: 2;
  }
}

.block {
  display: flex;
  flex-direction: column;
  padding: var(--size-base-4) var(--size-base-5);
}

.block-title {
  margin: 0 0 0 calc(-1 * var(--size-base-2));
  padding-bottom: var(--size-base);
  display: flex;
  align-items: center;
  gap: var(--size-base);
  font-size: 20px;

  img {
    width: var(--size-base-5);
    height: auto;

    @media (--desktop) {
      width: var(--size-base-8);
    }
  }
}
</style>
