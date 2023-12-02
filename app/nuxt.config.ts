export default defineNuxtConfig({
  devtools: { enabled: true },
  plugins: [
    'plugins/firebase.client.ts'
  ],
  ssr: false,
  runtimeConfig: {
    public: {
      apiKey: "AIzaSyCRSR9taHw2VeE2Ft27o5LtS_twKx1D0WI",
      authDomain: "nuxt3-ec8df.firebaseapp.com",
      projectId: "nuxt3-ec8df",
      storageBucket: "nuxt3-ec8df.appspot.com",
      messagingSenderId: "840302904340",
      appId: "1:840302904340:web:fb3dd9ff99f159350d1301"
    }
  }
})