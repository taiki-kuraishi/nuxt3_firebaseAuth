export default defineNuxtConfig({
  devtools: { enabled: true },
  plugins: [
    'plugins/firebase.client.ts'
  ],
  nitro: {
    firebase: {
      gen: 2
    }
  }
})