<template>
    <div>
        <h1>this is the content page</h1>
        <p>{{ user }}</p>
        <button @click="signOut">signOut</button>
    </div>
</template>
<script setup lang="ts">
import { useAuth } from "~/composables/auth";
import { useUser } from "~/composables/user";

const { user } = useUser();

const signOut = async (): Promise<void> => {
    await useAuth().signOut();
    await navigateTo('/signIn')
}
</script>