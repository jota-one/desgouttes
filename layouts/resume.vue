<template>
  <Summary
    :activities="page.activities"
    :firstname="page.firstname"
    :lastname="page.lastname"
    :languages="page.languages"
    :email="page.email"
    :phone="page.phone"
    :initials="page.initials"
  />
  <pre>{{ page }}</pre>
</template>
<script setup lang="ts">
import Summary from '~/components/attorney/Summary.vue'

const { page } = useContent()
</script>
