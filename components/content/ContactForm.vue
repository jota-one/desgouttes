<template>
  <div class="contact-form">
    <div class="infos">
      <slot />
      <div class="map">
        <slot name="map" />
      </div>
    </div>
    <form class="form" @submit.prevent="sendEmail">
      <div class="form-item">
        <label class="field">
          <span class="label">Name</span>
          <input v-model="form.name" type="text" required class="input" />
        </label>
      </div>
      <div class="form-item">
        <label class="field">
          <span class="label">E-mail</span>
          <input v-model="form.email" type="text" required class="input" />
        </label>
      </div>
      <div class="form-item">
        <label class="field">
          <span class="label">Phone</span>
          <input v-model="form.phone" type="text" class="input" />
        </label>
      </div>
      <div class="form-item">
        <label class="field">
          <select v-model="form.dest" class="dropdown">
            <option value="">Des Gouttes Administration</option>
            <option
              v-for="attorney in attorneys"
              :key="attorney.initials"
              :value="attorney.initials"
            >
              {{ attorney.firstname }} {{ attorney.lastname }}
            </option>
          </select>
        </label>
      </div>
      <div class="form-item">
        <label class="field">
          <span class="label">Message</span>
          <textarea
            v-model="form.message"
            class="textarea"
            name="message"
            rows="8"
            maxlength="5000"
          />
        </label>
      </div>
      <button type="submit" :disabled="!formValid" class="button">Send</button>
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
  queryContent('/en/team/')
    .only(['title', 'initials', 'firstname', 'lastname'])
    .find(),
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

<style lang="postcss" scoped>
@import '/assets/styles/_mediaquery.pcss';

.contact-form {
  display: flex;
  flex-direction: column;
  padding-top: var(--size-base-5);

  @media (--tablet) {
    padding-top: 0;
    flex-direction: row;
    gap: var(--size-base-6);
  }
}

.infos {
  @media (--tablet) {
    flex: 1;
  }
}

.form {
  @media (--tablet) {
    flex: 2;
  }
}

.map {
  padding: var(--size-base-4) 0;
  font-size: 15px;
  color: rgb(var(--color-neutral-dark));

  :deep(img) {
    border-radius: var(--size-base-2);
  }
}
</style>
