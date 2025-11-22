<script setup lang="ts">
import { ref } from 'vue';
import { createMatchupTable } from '@/services/drUniversity/matchups/matchups.service';
import { CreateMatchupTableDto } from '@/services/drUniversity/matchups/matchups.model';
import MatchupsTableForm from '@/components/Cms/MatchupsTableForm/MatchupsTableForm.vue';

const loading = ref(false);
const success = ref(false);
const errorMessage = ref('');

async function handleCreateMatchupTable(payload: CreateMatchupTableDto) {
  loading.value = true;
  success.value = false;
  errorMessage.value = '';

  try {
    await createMatchupTable(payload);
    success.value = true;
  } catch (err: any) {
    console.error(err);
    errorMessage.value = err?.message || 'Failed to create matchup table.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="pa-6 w-100" max-width="100%">
      <v-card-title class="text-h5 text-center mb-4">Add Matchup Table</v-card-title>

      <MatchupsTableForm :onSubmit="handleCreateMatchupTable" :loading="loading" />

      <v-alert v-if="errorMessage" type="error" variant="tonal" class="mt-4 text-center">
        {{ errorMessage }}
      </v-alert>

      <v-alert v-if="success" type="success" variant="tonal" class="mt-4 text-center"> Matchup table created successfully. </v-alert>
    </v-card>
  </v-container>
</template>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
