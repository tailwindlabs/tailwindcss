import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  compatibilityDate: '2024-08-30',
})