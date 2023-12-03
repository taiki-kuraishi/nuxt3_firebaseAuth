<template>
    <div>
        <h1>signIn page </h1>
        <button @click="signIn()">signIn</button>
    </div>
</template>
<script setup lang="ts">
import { useAuth } from '../composables/auth';

const signIn = async (): Promise<void> => {
    await useAuth().signIn();
    await navigateTo('/content')
}
</script>