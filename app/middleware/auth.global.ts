import type { RouteLocationNormalized } from "vue-router";
import { useUser } from "~/composables/user";

export default defineNuxtRouteMiddleware(async (to: RouteLocationNormalized) => {
    if (to.path == '/signIn') return;

    const { user } = useUser();

    if (!user.value) {
        console.log('not authenticated')
        return await navigateTo('/signIn')
    }
});