<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import { getMatchupTableById, patchMatchupTableById } from '@/services/drUniversity/matchups/matchups.service';

import type { MatchupTableFull, MatchupCell, CreateMatchupTableDto } from '@/services/drUniversity/matchups/matchups.model';
import MatchupsTableForm from '@/components/Cms/MatchupsTableForm/MatchupsTableForm.vue';

const route = useRoute();

const table = ref<CreateMatchupTableDto | undefined>(undefined);
const loading = ref(true);
const saving = ref(false);
const success = ref(false);
const errorMessage = ref('');

function transformToFlatCells(full: MatchupTableFull): MatchupCell[] {
  const cells: MatchupCell[] = [];

  for (const row of full.cells) {
    for (const col of row.cols) {
      cells.push({
        rowRaceId: row.rowRaceId,
        colRaceId: col.colRaceId,
        links: col.links,
      });
    }
  }
  return cells;
}

onMounted(async () => {
  try {
    const id = Number(route.params.id);
    if (!id) throw new Error('Invalid matchup table ID');

    const full = await getMatchupTableById(id);

    table.value = {
      name: full.name,
      cells: transformToFlatCells(full),
    };
  } catch (err: any) {
    errorMessage.value = err?.message ?? 'Failed to load matchup table.';
  } finally {
    loading.value = false;
  }
});

async function handleUpdate(payload: CreateMatchupTableDto) {
  const id = Number(route.params.id);
  if (!id) return;

  saving.value = true;
  success.value = false;
  errorMessage.value = '';

  try {
    await patchMatchupTableById(id, payload);
    success.value = true;
  } catch (err: any) {
    errorMessage.value = err?.message ?? 'Failed to update matchup table.';
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="pa-6 w-100" max-width="1200px">
      <v-card-title class="text-h5 text-center mb-4"> Edit Matchup Table </v-card-title>

      <v-progress-circular v-if="loading" indeterminate color="primary" class="d-flex mx-auto my-6" />

      <template v-else>
        <MatchupsTableForm :initialData="table" :onSubmit="handleUpdate" :loading="saving" />

        <v-alert v-if="errorMessage" type="error" variant="tonal" class="mt-4 text-center">
          {{ errorMessage }}
        </v-alert>

        <v-alert v-if="success" type="success" variant="tonal" class="mt-4 text-center"> Matchup table updated successfully. </v-alert>
      </template>
    </v-card>
  </v-container>
</template>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
