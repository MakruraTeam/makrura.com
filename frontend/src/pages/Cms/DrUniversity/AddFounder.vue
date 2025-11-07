<script setup lang="ts">
import { ref } from 'vue';
import { createFounder } from '@/services/drUniversity/founders/founder.service';
import type { Founder } from '@/services/drUniversity/founders/founder.model';
import FounderForm from '@/components/Cms/FounderForm/FounderForm.vue';

const loading = ref(false);
const success = ref(false);
const errorMessage = ref('');

async function handleCreateFounder(payload: Founder) {
  loading.value = true;
  success.value = false;
  errorMessage.value = '';

  try {
    await createFounder(payload);
    success.value = true;
  } catch (err: any) {
    console.error(err);
    errorMessage.value = err?.message || 'Failed to create founder.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="pa-6 w-100" max-width="100%">
      <v-card-title class="text-h5 text-center mb-4">Add New Founder</v-card-title>

      <FounderForm :onSubmit="handleCreateFounder" :loading="loading" />

      <v-alert v-if="errorMessage" type="error" variant="tonal" class="mt-4 text-center">
        {{ errorMessage }}
      </v-alert>

      <v-alert v-if="success" type="success" variant="tonal" class="mt-4 text-center"> Founder created successfully. </v-alert>
    </v-card>
  </v-container>
</template>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
