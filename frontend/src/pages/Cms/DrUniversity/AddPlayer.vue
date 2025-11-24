<script setup lang="ts">
import { ref } from 'vue';
import { createPlayer } from '@/services/drUniversity/players/players.service';
import type { Player } from '@/services/drUniversity/players/players.model';
import PlayerForm from '@/components/Cms/PlayerForm/PlayerForm.vue';

const loading = ref(false);
const success = ref(false);
const errorMessage = ref('');

async function handleCreatePlayer(payload: Player) {
  loading.value = true;
  success.value = false;
  errorMessage.value = '';

  try {
    await createPlayer(payload);
    success.value = true;
  } catch (err: any) {
    console.error(err);
    errorMessage.value = err?.message || 'Failed to create player.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="pa-6 w-100" max-width="100%">
      <v-card-title class="text-h5 text-center mb-4"> Add New Player </v-card-title>

      <PlayerForm :onSubmit="handleCreatePlayer" :loading="loading" />

      <v-alert v-if="errorMessage" type="error" variant="tonal" class="mt-4 text-center">
        {{ errorMessage }}
      </v-alert>

      <v-alert v-if="success" type="success" variant="tonal" class="mt-4 text-center"> Player created successfully. </v-alert>
    </v-card>
  </v-container>
</template>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
