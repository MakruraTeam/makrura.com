<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import PlayerForm from '@/components/Cms/PlayerForm/PlayerForm.vue';
import { getPlayerById, patchPlayerById } from '@/services/drUniversity/players/players.service';
import type { Player, PlayerResponse } from '@/services/drUniversity/players/players.model';

const route = useRoute();

const player = ref<PlayerResponse | undefined>(undefined);

const loading = ref(true);
const saving = ref(false);
const success = ref(false);
const errorMessage = ref('');

onMounted(async () => {
  try {
    const id = Number(route.params.id);
    if (!id) throw new Error('Invalid player ID');
    player.value = await getPlayerById(id);
  } catch (err: any) {
    console.error(err);
    errorMessage.value = err?.message || 'Failed to load player.';
  } finally {
    loading.value = false;
  }
});

async function handleUpdate(payload: Player) {
  if (!player.value?.id) return;

  saving.value = true;
  success.value = false;
  errorMessage.value = '';

  try {
    await patchPlayerById(player.value.id, payload);
    success.value = true;
  } catch (err: any) {
    console.error(err);
    errorMessage.value = err?.message || 'Failed to update player.';
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="pa-6 w-100" max-width="100%">
      <v-card-title class="text-h5 text-center mb-4">Edit Player</v-card-title>

      <v-progress-circular v-if="loading" indeterminate color="primary" class="d-flex mx-auto my-6" />

      <template v-else>
        <PlayerForm :initialData="player" :onSubmit="handleUpdate" :loading="saving" />

        <v-alert v-if="errorMessage" type="error" variant="tonal" class="mt-4 text-center">
          {{ errorMessage }}
        </v-alert>

        <v-alert v-if="success" type="success" variant="tonal" class="mt-4 text-center"> Player updated successfully. </v-alert>
      </template>
    </v-card>
  </v-container>
</template>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
