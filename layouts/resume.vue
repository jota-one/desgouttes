<template>
  <div>
    <NuxtLink href="/en/team">&lt; back</NuxtLink>
  </div>
  <picture>
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
  </picture>
  <Summary
    :activities="page.activities"
    :firstname="page.firstname"
    :lastname="page.lastname"
    :languages="page.languages"
    :email="page.email"
    :phone="page.phone"
    :initials="page.initials"
  />
  <Expertise :practice-areas="practiceAreas" :domains="page.expertiseDomains" />
  <Chronology title="Education" :events="page.education" />
  <Chronology title="Professional Experience" :events="page.experience" />
  <Chronology title="Other Activities" :events="page.others" />
  <SimpleList title="Practice Areas" :items="myPracticeAreas" />
  <SimpleList title="Memberships" :items="memberships" />
  <Extended :initials="page.initials" :version="page.cvVersion" />
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
    if (!ed.practiceArea) {
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
</script>
