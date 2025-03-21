<script setup lang="ts">
import Chronology from '~/components/attorney/Chronology.vue'

type Event = {
  date: string
  content: string
}

type ExperienceSubSection = {
  title: string
  experience: Event[]
}

export type Experience = ExperienceSubSection[] | Event[]

type Props = {
  experience: Experience
}

const props = defineProps<Props>()

const hasSubSections = computed(() => {
  return (
    props.experience.length > 0 &&
    (props.experience[0] as ExperienceSubSection).title
  )
})
</script>

<template>
  <div>
    <template v-if="hasSubSections">
      <Chronology title="Career" :events="[]" />
      <Chronology
        v-for="(subSection, index) in (experience as ExperienceSubSection[])"
        :key="index"
        :title="subSection.title"
        :events="subSection.experience"
        sub-section
      />
    </template>
    <Chronology v-else title="Career" :events="experience as Event[]" />
  </div>
</template>

<style scoped lang="postcss"></style>
