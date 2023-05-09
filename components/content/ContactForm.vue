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
        <label class="field required">
          <span class="label">Name</span>
          <input
            v-model="form.name"
            type="text"
            required
            class="input"
            name="name"
            autocomplete="on"
          />
        </label>
      </div>
      <div class="form-item">
        <label class="field required">
          <span class="label">E-mail</span>
          <input
            v-model="form.email"
            type="text"
            required
            class="input"
            name="email"
            autocomplete="on"
          />
        </label>
      </div>
      <div class="form-item">
        <label class="field">
          <span class="label">Phone</span>
          <input
            v-model="form.phone"
            type="text"
            class="input"
            name="phone"
            autocomplete="on"
          />
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
        <label class="field required">
          <span class="label">Message</span>
          <textarea
            v-model="form.message"
            class="textarea"
            name="message"
            rows="8"
            maxlength="5000"
            required
          />
        </label>
      </div>
      <div class="form-action">
        <button type="submit" :disabled="!formValid" class="button">
          Send
        </button>
        <div class="mandatory-fields-info">
          <span class="asterisk">*</span> mandatory fields
        </div>
      </div>
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

.form-action {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--size-base-2);
  font-size: 15px;
  color: rgb(var(--color-neutral));
}

.mandatory-fields-info {
  display: flex;
  align-items: center;
  gap: var(--size-base-2);

  .asterisk {
    color: rgb(var(--color-primary));
    font-size: 18px;
  }
}
</style>
