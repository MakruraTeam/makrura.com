<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { MatchupTableSummary } from '@/services/drUniversity/matchups/matchups.model';
import { getAllMatchupTables, deleteMatchupTableById } from '@/services/drUniversity/matchups/matchups.service';

const router = useRouter();

const matchups = ref<MatchupTableSummary[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const dialog = ref(false);
const selectedMatchup = ref<MatchupTableSummary | null>(null);

async function loadMatchups() {
  loading.value = true;
  error.value = null;

  try {
    matchups.value = await getAllMatchupTables();
  } catch (err: any) {
    error.value = err?.message || 'Failed to load matchup tables.';
  } finally {
    loading.value = false;
  }
}

function openEdit(id: number) {
  router.push({ name: 'cms-edit-matchup-table', params: { id } });
}

function openDelete(m: MatchupTableSummary) {
  selectedMatchup.value = m;
  dialog.value = true;
}

async function confirmDelete() {
  if (!selectedMatchup.value) return;

  try {
    await deleteMatchupTableById(selectedMatchup.value.id);
    dialog.value = false;
    selectedMatchup.value = null;
    await loadMatchups();
  } catch (err: any) {
    error.value = err?.message || 'Failed to delete matchup table.';
    dialog.value = false;
  }
}

function cancelDelete() {
  selectedMatchup.value = null;
  dialog.value = false;
}

onMounted(loadMatchups);
</script>

<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card max-width="600" class="w-100 pa-7">
      <v-card-title class="text-h5 text-center mb-4"> Manage Matchup Tables </v-card-title>
      <v-progress-circular v-if="loading" indeterminate color="primary" class="d-flex mx-auto my-6" />

      <div v-else-if="error" class="text-error text-center my-4">
        {{ error }}
      </div>

      <v-list v-else>
        <v-list-item v-for="m in matchups" :key="m.id" class="hover:bg-grey-lighten-4 rounded-lg my-1">
          <v-list-item-title>
            {{ m.name }}
          </v-list-item-title>

          <template #append>
            <v-btn icon variant="text" color="primary" @click="openEdit(m.id)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>

            <v-btn icon variant="text" color="error" @click="openDelete(m)">
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
          <strong>{{ selectedMatchup?.name }}</strong
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
