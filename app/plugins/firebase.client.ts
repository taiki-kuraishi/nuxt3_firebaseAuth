import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(async () => {

    const runtimeConfig = useRuntimeConfig();

    const firebaseConfig = {
        apiKey: runtimeConfig.public.apiKey as string,
        authDomain: runtimeConfig.public.authDomain as string,
        projectId: runtimeConfig.public.projectId as string,
        storageBucket: runtimeConfig.public.storageBucket as string,
        messagingSenderId: runtimeConfig.public.messagingSenderId as string,
        appId: runtimeConfig.public.appId as string
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    await setPersistence(auth, browserLocalPersistence);
});