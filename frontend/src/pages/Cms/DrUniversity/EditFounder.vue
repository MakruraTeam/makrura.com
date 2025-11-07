<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import FounderForm from '@/components/Cms/FounderForm/FounderForm.vue';
import { getFounderById, patchFounderById } from '@/services/drUniversity/founders/founder.service';
import type { Founder } from '@/services/drUniversity/founders/founder.model';
import { FounderCardProps } from '@/components/DrUniversity/FounderCard/FounderCard.model';

const route = useRoute();

const founder = ref<FounderCardProps | undefined>(undefined);
const loading = ref(true);
const saving = ref(false);
const success = ref(false);
const errorMessage = ref('');

onMounted(async () => {
  try {
    const id = Number(route.params.id);
    if (!id) throw new Error('Invalid founder ID');
    founder.value = await getFounderById(id);
  } catch (err: any) {
    console.error(err);
    errorMessage.value = err?.message || 'Failed to load founder.';
  } finally {
    loading.value = false;
  }
});

async function handleUpdate(payload: Founder) {
  if (!founder.value?.id) return;

  saving.value = true;
  success.value = false;
  errorMessage.value = '';

  try {
    await patchFounderById(founder.value.id, payload);
    success.value = true;
  } catch (err: any) {
    console.error(err);
    errorMessage.value = err?.message || 'Failed to update founder.';
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="pa-6 w-100" max-width="100%">
      <v-card-title class="text-h5 text-center mb-4">Edit Founder</v-card-title>

      <v-progress-circular v-if="loading" indeterminate color="primary" class="d-flex mx-auto my-6" />

      <template v-else>
        <FounderForm :initialData="founder" :onSubmit="handleUpdate" :loading="saving" />

        <v-alert v-if="errorMessage" type="error" variant="tonal" class="mt-4 text-center">
          {{ errorMessage }}
        </v-alert>

        <v-alert v-if="success" type="success" variant="tonal" class="mt-4 text-center"> Founder updated successfully. </v-alert>
      </template>
    </v-card>
  </v-container>
</template>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
