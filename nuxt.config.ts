// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  app: {
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [{ rel: 'stylesheet', href: '/fonts/Folks.css' }],
      script: [
        {
          'defer': true,
          'data-domain': 'desgouttes.ch',
          'src': 'https://plausible.io/js/script.js',
        },
      ],
    },
  },

  modules: ['@nuxt/content'],

  content: {
    documentDriven: true,
    markdown: {
      externalLinks: {
        target: '_blank',
        rel: false,
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

  compatibilityDate: '2024-11-17',
})
