<script setup lang="ts">
import { LoginPayload } from '@/services/auth/auth.model';
import { login } from '@/services/auth/auth.service';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const rememberMe = ref(false);
const loading = ref(false);
const errorMessage = ref('');

const router = useRouter();

const handleSubmit = async () => {
  errorMessage.value = '';
  loading.value = true;

  try {
    const payload: LoginPayload = {
      login: username.value,
      password: password.value,
    };

    await login(payload, rememberMe.value);

    router.push('/cms');
    // router.push('/dashboard'); // or wherever your app should go
  } catch (err: any) {
    errorMessage.value = err?.message || 'Login failed. Please check your credentials.';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="pa-6" width="400">
      <v-card-title class="text-h5 text-center mb-4">Login</v-card-title>

      <v-card-text>
        <v-form @submit.prevent="handleSubmit">
          <v-text-field v-model="username" label="Username" prepend-inner-icon="mdi-account" outlined required />

          <v-text-field v-model="password" label="Password" type="password" prepend-inner-icon="mdi-lock" outlined required />

          <v-checkbox v-model="rememberMe" label="Remember Me" class="mt-2" color="primary" />

          <v-alert v-if="errorMessage" type="error" variant="tonal" class="mt-2">
            {{ errorMessage }}
          </v-alert>

          <v-btn :loading="loading" type="submit" color="primary" block class="mt-4"> Login </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
