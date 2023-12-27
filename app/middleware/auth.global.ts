import type { RouteLocationNormalized } from "vue-router";
import { useUser } from "~/composables/user";
import { getAuth } from "firebase/auth";

export default defineNuxtRouteMiddleware(async (to: RouteLocationNormalized) => {
    const { setUser } = useUser();

    const auth = getAuth();
    const firebaseUser = auth.currentUser;

    if (firebaseUser) {
        setUser(firebaseUser);
        if (to.path == '/content') return;

        return await navigateTo('/content')
    }
    else {
        if (to.path == '/signIn') return;

        console.log('not authenticated')
        return await navigateTo('/signIn')
    }
});
