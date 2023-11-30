<template>
    <div>
        <h1>this is the login page </h1>
        <button class="google-button" @click="googleSignUp"><span>Googleで登録</span></button>
    </div>
</template>
<script setup lang="ts">
import { useAuth } from '../composables/useAuth';

const googleSignUp = () => {
    const { googleSignUp } = useAuth()
    googleSignUp()
}
</script>