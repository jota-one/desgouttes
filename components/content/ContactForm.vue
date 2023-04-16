<template>
  <div class="form-page">
    <div class="form-intro">
      <slot />
    </div>
    <form @submit.prevent="sendEmail">
      <div class="form-item">
        <label>
          <span>Name</span>
          <input v-model="form.name" type="text" required />
        </label>
      </div>
      <div class="form-item">
        <label>
          <span>E-mail</span>
          <input v-model="form.email" type="text" required />
        </label>
      </div>
      <div class="form-item">
        <label>
          <span>Phone</span>
          <input v-model="form.phone" type="text" />
        </label>
      </div>
      <div class="form-item">
        <label>
          <select v-model="form.dest">
            <option value="">- - Send to Des Gouttes Administration - -</option>
            <option
              v-for="attorney in attorneys"
              :key="attorney.initials"
              :value="attorney.initials"
            >
              {{ attorney.title }}
            </option>
          </select>
        </label>
      </div>
      <div class="form-item">
        <label>
          <span>Message</span>
          <textarea v-model="form.message" />
        </label>
      </div>
      <button type="submit" :disabled="!formValid">Send</button>
    </form>
  </div>
</template>

<script setup lang="ts">
export interface EmailForm {
  name: string
  email: string
  phone: string
  dest: string
  message: string
}
const form = ref<EmailForm>({
  name: '',
  email: '',
  phone: '',
  dest: '',
  message: '',
})

const { data: attorneys } = await useAsyncData('pa', () =>
  queryContent('/en/team/').only(['title', 'initials']).find(),
)

const formValid = computed(
  () =>
    form.value.name !== '' &&
    form.value.email !== '' &&
    form.value.message !== '',
)

const sendEmail = () => {
  console.log('send email', form.value)
}
</script>

<style scoped></style>
