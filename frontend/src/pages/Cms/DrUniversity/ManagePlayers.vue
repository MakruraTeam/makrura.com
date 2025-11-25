<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import { getAllPlayers, deletePlayer } from '@/services/drUniversity/players/players.service';
import type { PlayerResponse } from '@/services/drUniversity/players/players.model';

const players = ref<PlayerResponse[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const dialog = ref(false);
const selectedPlayer = ref<PlayerResponse | null>(null);

const router = useRouter();

async function loadPlayers() {
  loading.value = true;
  error.value = null;

  try {
    players.value = await getAllPlayers();
  } catch (err: any) {
    console.error(err);
    error.value = err?.message || 'Failed to load players.';
  } finally {
    loading.value = false;
  }
}

function openDeleteDialog(player: PlayerResponse) {
  selectedPlayer.value = player;
  dialog.value = true;
}

async function confirmDelete() {
  if (!selectedPlayer.value) return;

  try {
    await deletePlayer(selectedPlayer.value.id);
    dialog.value = false;
    selectedPlayer.value = null;
    await loadPlayers();
  } catch (err: any) {
    console.error(err);
    error.value = err?.message || 'Failed to delete player.';
    dialog.value = false;
  }
}

function cancelDelete() {
  selectedPlayer.value = null;
  dialog.value = false;
}

function openEditPage(id: number) {
  router.push({ name: 'cms-edit-player', params: { id } });
}

onMounted(loadPlayers);
</script>

<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card max-width="600" class="w-100 pa-7">
      <v-card-title class="text-h5 text-center mb-4">Manage Players</v-card-title>

      <v-progress-circular v-if="loading" indeterminate color="primary" class="d-flex mx-auto my-6" />

      <div v-else-if="error" class="text-error text-center my-4">
        {{ error }}
      </div>

      <v-list v-else>
        <v-list-item v-for="player in players" :key="player.id" class="hover:bg-grey-lighten-4 rounded-lg my-1">
          <v-list-item-title>
            {{ player.name }}
          </v-list-item-title>

          <template #append>
            <v-btn icon variant="text" color="primary" @click="openEditPage(player.id)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>

            <v-btn icon variant="text" color="error" @click="openDeleteDialog(player)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-list-item>
      </v-list>
    </v-card>

    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-text>
          Are you sure you want to permanently delete
          <strong>{{ selectedPlayer?.name }}</strong
          >?
        </v-card-text>

        <v-card-actions class="justify-end">
          <v-btn text color="grey" @click="cancelDelete">Cancel</v-btn>
          <v-btn color="error" @click="confirmDelete">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
