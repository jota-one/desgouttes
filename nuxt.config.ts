// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  app: {
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [{ rel: 'stylesheet', href: '/fonts/Folks.css' }],
    },
  },

  modules: ['@nuxt/content', '@nuxtjs/tailwindcss'],
  content: {
    documentDriven: true,
  },
  tailwindcss: {
    config: {
      content: ['content/**/*.md'],
      corePlugins: {
        preflight: false,
      },
    },
  },

  css: ['@/assets/styles/main.pcss'],

  postcss: {
    plugins: {
      'postcss-import': {},
      'postcss-url': {},
      'postcss-nested': {},
      'postcss-custom-media': {},
    },
  },
})
