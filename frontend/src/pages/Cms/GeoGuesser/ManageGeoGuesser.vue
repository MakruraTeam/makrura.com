<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAllGeoGuesserIds, deleteGeoGuesser } from '@/services/geoGuesser/geoGuesser.service';

const ids = ref<number[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const router = useRouter();

const dialog = ref(false);
const selectedIndex = ref<number | null>(null);

async function load() {
  loading.value = true;
  error.value = null;

  try {
    ids.value = await getAllGeoGuesserIds();
  } catch (err: any) {
    console.error(err);
    error.value = err?.message || 'Failed to load GeoGuessers.';
  } finally {
    loading.value = false;
  }
}

function openEdit(index: number) {
  router.push({
    name: 'cms-edit-geoguesser',
    params: { id: ids.value[index] },
  });
}

function openDeleteDialog(index: number) {
  selectedIndex.value = index;
  dialog.value = true;
}

async function confirmDelete() {
  if (selectedIndex.value === null) return;

  try {
    await deleteGeoGuesser(ids.value[selectedIndex.value]);
    dialog.value = false;
    selectedIndex.value = null;
    await load();
  } catch (err: any) {
    console.error(err);
    error.value = err?.message || 'Failed to delete GeoGuesser.';
    dialog.value = false;
  }
}

function cancelDelete() {
  selectedIndex.value = null;
  dialog.value = false;
}

onMounted(load);
</script>

<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card max-width="600" class="w-100 pa-7">
      <v-card-title class="text-h5 text-center mb-4">Manage GeoGuessers</v-card-title>

      <v-progress-circular v-if="loading" indeterminate color="primary" class="d-flex mx-auto my-6" />

      <div v-else-if="error" class="text-error text-center my-4">
        {{ error }}
      </div>

      <v-list v-else>
        <v-list-item v-for="(_, index) in ids" :key="index" class="hover:bg-grey-lighten-4 rounded-lg my-1">
          <v-list-item-title> GeoGuesser #{{ index + 1 }} </v-list-item-title>

          <template #append>
            <v-btn icon variant="text" color="primary" @click="openEdit(index)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>

            <v-btn icon variant="text" color="error" @click="openDeleteDialog(index)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-list-item>
      </v-list>
    </v-card>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-text>
          Are you sure you want to permanently delete
          <strong> GeoGuesser #{{ selectedIndex !== null ? selectedIndex + 1 : '' }} </strong>?
        </v-card-text>

        <v-card-actions class="justify-end">
          <v-btn text color="grey" @click="cancelDelete"> Cancel </v-btn>
          <v-btn color="error" @click="confirmDelete"> OK </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
