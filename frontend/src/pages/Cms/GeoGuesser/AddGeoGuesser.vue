<script setup lang="ts">
import { ref } from 'vue';
import { createGeoGuesser } from '@/services/geoGuesser/geoGuesser.service';
import type { CreateGeoGuesserRequest } from '@/services/geoGuesser/geoGuesser.model';
import GeoGuesserForm from '@/components/Cms/GeoGuesserForm/GeoGuesserForm.vue';

const loading = ref(false);
const success = ref(false);
const errorMessage = ref('');

async function handleCreate(payload: CreateGeoGuesserRequest) {
  loading.value = true;
  success.value = false;
  errorMessage.value = '';

  try {
    await createGeoGuesser(payload);
    success.value = true;
  } catch (err: any) {
    errorMessage.value = err?.message || 'Failed to create GeoGuesser.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="pa-6 w-100">
      <v-card-title class="text-h5 text-center mb-4">Add GeoGuesser</v-card-title>

      <GeoGuesserForm :onSubmit="handleCreate" :loading="loading" />

      <v-alert v-if="success" type="success" variant="tonal" class="mt-4 text-center"> GeoGuesser created successfully. </v-alert>

      <v-alert v-if="errorMessage" type="error" variant="tonal" class="mt-4 text-center">
        {{ errorMessage }}
      </v-alert>
    </v-card>
  </v-container>
</template>
