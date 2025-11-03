<script setup lang="ts">
import { ref } from 'vue';
import { register } from '@/services/auth/auth.service';
import type { RegisterPayload } from '@/services/auth/auth.model';
import { useAuthStore } from '@/stores/auth';

const login = ref('');
const email = ref('');
const password = ref('');
const repeatPassword = ref('');
const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const auth = useAuthStore();

const handleSubmit = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  if (!login.value || !email.value || !password.value || !repeatPassword.value) {
    errorMessage.value = 'Please fill in all fields.';
    return;
  }

  loading.value = true;
  try {
    const payload: RegisterPayload = {
      login: login.value,
      email: email.value,
      password: password.value,
      repeatPassword: repeatPassword.value,
    };

    const token = auth.getToken;
    if (!token) {
      throw new Error('You must be logged in to add a new user.');
    }

    await register(payload);
    successMessage.value = 'User created successfully.';
  } catch (err: any) {
    errorMessage.value = err?.message || 'Failed to create user.';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="pa-6" width="400">
      <v-card-title class="text-h5 text-center mb-4">Add New User</v-card-title>

      <v-card-text>
        <v-form @submit.prevent="handleSubmit">
          <v-text-field v-model="login" label="Login" prepend-inner-icon="mdi-account" outlined required />

          <v-text-field v-model="email" label="Email" prepend-inner-icon="mdi-email" outlined required />

          <v-text-field v-model="password" label="Password" type="password" prepend-inner-icon="mdi-lock" outlined required />

          <v-text-field v-model="repeatPassword" label="Repeat Password" type="password" prepend-inner-icon="mdi-lock-check" outlined required />

          <v-alert v-if="errorMessage" type="error" variant="tonal" class="mt-2">
            {{ errorMessage }}
          </v-alert>

          <v-alert v-if="successMessage" type="success" variant="tonal" class="mt-2">
            {{ successMessage }}
          </v-alert>

          <v-btn :loading="loading" type="submit" color="primary" block class="mt-4"> Add User </v-btn>
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
