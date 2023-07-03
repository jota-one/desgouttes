<template>
  <article class="article">
    <nav class="nav">
      <NuxtLink href="/en/team">back</NuxtLink>
    </nav>

    <header class="header">
      <picture class="picture">
        <source
          media="(max-width: 599px)"
          :srcset="`/imgs/people/${page.initials.toUpperCase()}-phone.jpg`"
        />
        <source
          media="(min-width: 600px)"
          :srcset="`/imgs/people/${page.initials.toUpperCase()}-landscape.jpg`"
        />
        <img
          class="img-responsive"
          :src="`/imgs/people/${page.initials.toUpperCase()}-landscape.jpg`"
          :alt="`${page.firstname}`"
        />
        <div class="overlay" />
      </picture>
      <div class="summary">
        <Summary
          :activities="page.activities"
          :firstname="page.firstname"
          :lastname="page.lastname"
          :languages="page.languages"
          :email="page.email"
          :phone="page.phone"
          :initials="page.initials"
        />
      </div>
    </header>

    <main class="main">
      <Expertise
        :practice-areas="practiceAreas"
        :domains="page.expertiseDomains"
        class="expertise"
      />
      <div class="chronology">
        <Chronology
          v-if="education.length"
          title="Education"
          :events="education"
        />
        <Chronology
          v-if="experience.length"
          title="Professional Experience"
          :events="experience"
        />
        <Chronology
          v-if="others.length"
          title="Other Activities"
          :events="others"
        />
        <SimpleList
          v-if="myPracticeAreas.length"
          title="Practice Areas"
          :items="myPracticeAreas"
        />
        <SimpleList
          v-if="memberships.length"
          title="Memberships"
          :items="memberships"
        />
        <hr class="sep" />
        <Extended :initials="page.initials" :version="page.cvVersion" />
      </div>
    </main>
    <footer class="footer">
      <PageFooter />
    </footer>
    <div class="bg" />
  </article>
</template>

<script setup lang="ts">
import Chronology from '~/components/attorney/Chronology.vue'
import Expertise from '~/components/attorney/Expertise.vue'
import Extended from '~/components/attorney/Extended.vue'
import SimpleList from '~/components/attorney/SimpleList.vue'
import Summary from '~/components/attorney/Summary.vue'

const { data } = await useAsyncData('pa', () =>
  queryContent('/en/practice-areas/').only(['title', '_path']).find(),
)

const practiceAreas = computed(() =>
  (data.value || []).map(item => ({
    title: item.title,
    link: item._path,
    id: item._path.split('/').pop(),
  })),
)
const { page } = useContent()

const myPracticeAreas = computed(() =>
  page.value.expertiseDomains.reduce((acc, ed) => {
    if (!ed.practiceArea || ed.hideFromPracticeAreas) {
      return acc
    }
    const { title: label, link } =
      practiceAreas.value.find(pa => pa.id === ed.practiceArea) || {}
    return acc.concat([{ label, link }])
  }, []),
)

const memberships = computed(() =>
  page.value.memberships.map(m => ({ label: m })),
)

const education = computed(() => [...page.value.education].reverse())
const experience = computed(() => [...page.value.experience].reverse())
const others = computed(() => [...page.value.others].reverse())

useHead({ title: `${page.value.firstname} ${page.value.lastname}` })
</script>

<style lang="postcss" scoped>
@import '/assets/styles/_mediaquery.pcss';

.article {
  max-width: var(--size-page-max-width);
  margin: 0 auto;

  @media (--resume-2-cols) {
    position: relative;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}

.nav,
.summary,
.expertise,
.chronology,
.footer {
  padding: var(--size-base-6);

  @media (--resume-2-cols) {
    padding-left: var(--size-base-8);
    padding-right: var(--size-base-8);
  }

  @media (--desktop) {
    padding-left: var(--size-base-14);
    padding-right: var(--size-base-14);
  }
}

.nav {
  display: flex;
  align-items: center;
  gap: var(--size-base-3);
  padding-top: var(--size-base-4);
  padding-bottom: var(--size-base-2);
  text-transform: uppercase;
  font-size: 18px;
  letter-spacing: var(--size-base-2);

  @media (--resume-2-cols) {
    padding-top: var(--size-base-10);
    padding-bottom: var(--size-base-2);
    font-size: 24px;
  }

  &:before {
    display: block;
    content: '';
    width: var(--size-base-2);
    height: var(--size-base-2);
    border-left: 2px solid rgba(var(--color-neutral-dark), 0.5);
    border-bottom: 2px solid rgba(var(--color-neutral-dark), 0.5);
    transform: rotate(45deg);
    transform-origin: center;
  }
}

.header,
.main {
  @media (--resume-2-cols) {
    grid-column: 1 / span 2;
    display: flex;

    & > * {
      flex-basis: 50%;
    }
  }
}

.header {
  @media (--resume-2-cols) {
    padding-bottom: var(--size-base-4);
  }
}

.picture {
  position: relative;
  display: block;
  margin-left: -10vw;
  margin-right: 10vw;

  @media (--resume-2-cols) {
    margin: 0 0 0 var(--size-base-8);
    flex-basis: calc(50% + var(--size-base-8));

    img {
      border: var(--size-base-2) solid rgb(var(--color-white));
    }
  }

  @media (--desktop) {
    margin: 0 0 0 var(--size-base-13);
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 0;
    padding-bottom: 50%;
    background: rgb(180, 180, 180, 0.1);
    mix-blend-mode: darken;

    @media (min-width: 600px) {
      padding-bottom: 40%;
    }

    @media (--resume-2-cols) {
      top: var(--size-base-2);
      left: var(--size-base-2);
      width: calc(100% - var(--size-base-4));
      padding-bottom: calc(40% - 8px);
    }
  }
}

.summary {
  @media (--resume-2-cols) {
    flex-basis: calc(50% - var(--size-base-8));
  }

  @media (--desktop) {
    padding-left: var(--size-base-10);
  }
}

.expertise {
  @media (--resume-2-cols) {
    order: 2;
  }
}

.chronology {
  background: rgb(var(--color-bg));

  @media (--resume-2-cols) {
    order: 1;
    background: transparent;
  }
}

.sep {
  appearance: none;
  margin-top: var(--size-base-10);
  border: 1px solid rgb(var(--color-white));
  background: none;
}

.footer {
  background: rgb(var(--color-bg));

  @media (--resume-2-cols) {
    grid-column: 1 / span 2;
    background: transparent;
  }

  @media (--desktop) {
    grid-column: 2;
  }
}

.bg {
  display: none;

  @media (--resume-2-cols) {
    display: block;
    grid-column: 1;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 50%;
    z-index: -1;
    background: rgb(var(--color-bg));
  }
}
</style>
