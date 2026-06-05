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
      supabaseUrl: 'https://jaiqygbjestxncypetxc.supabase.co',
      supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphaXF5Z2JqZXN0eG5jeXBldHhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1ODI4MTMsImV4cCI6MjA4OTE1ODgxM30.dFI3OxUTYjgzkAtSqKnE0bOVa4p1pbuNMLbNa_9HmZI'
    }
  }
})
