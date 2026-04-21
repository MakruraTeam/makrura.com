<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { updateGeoGuesser, getGeoGuesserAdminById } from '@/services/geoGuesser/geoGuesser.service';
import GeoGuesserForm from '@/components/Cms/GeoGuesserForm/GeoGuesserForm.vue';

const route = useRoute();

const geo = ref<any | null>(null);
const loading = ref(true);
const saving = ref(false);
const success = ref(false);
const errorMessage = ref('');

onMounted(async () => {
  try {
    geo.value = await getGeoGuesserAdminById(Number(route.params.id));
  } catch {
    errorMessage.value = 'Failed to load GeoGuesser.';
  } finally {
    loading.value = false;
  }
});

async function handleUpdate(payload: any) {
  saving.value = true;
  success.value = false;

  try {
    await updateGeoGuesser(Number(route.params.id), payload);
    success.value = true;
  } catch (err: any) {
    errorMessage.value = 'Failed to update GeoGuesser.';
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="pa-6 w-100">
      <v-card-title class="text-h5 text-center mb-4">Edit GeoGuesser</v-card-title>

      <v-progress-circular v-if="loading" indeterminate class="mx-auto my-6" />

      <GeoGuesserForm v-else :initialData="geo" :onSubmit="handleUpdate" :loading="saving" />

      <v-alert v-if="success" type="success" variant="tonal" class="mt-4 text-center"> GeoGuesser updated successfully. </v-alert>

      <v-alert v-if="errorMessage" type="error" variant="tonal" class="mt-4 text-center">
        {{ errorMessage }}
      </v-alert>
    </v-card>
  </v-container>
</template>
