// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  ssr: false,
  nitro: {
    preset: 'github-pages'
  },
  runtimeConfig: {
    public: {
      supabaseUrl: '',
      supabaseAnonKey: ''
    }
  }
})
