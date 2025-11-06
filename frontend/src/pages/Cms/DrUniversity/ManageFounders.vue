<script setup lang="ts">
import { FounderCardProps } from '@/components/DrUniversity/FounderCard/FounderCard.model';
import { getAllFounders, deleteFounder } from '@/services/drUniversity/founders/founder.service';
import { onMounted, ref } from 'vue';

const founders = ref<FounderCardProps[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const dialog = ref(false);
const selectedFounder = ref<FounderCardProps | null>(null);

async function loadFounders() {
  loading.value = true;
  error.value = null;

  try {
    founders.value = await getAllFounders();
  } catch (err: any) {
    console.error(err);
    error.value = err?.message || 'Failed to load founders.';
  } finally {
    loading.value = false;
  }
}

function openDeleteDialog(founder: FounderCardProps) {
  selectedFounder.value = founder;
  dialog.value = true;
}

async function confirmDelete() {
  if (!selectedFounder.value) return;

  try {
    await deleteFounder(selectedFounder.value.id);
    dialog.value = false;
    selectedFounder.value = null;
    await loadFounders();
  } catch (err: any) {
    console.error(err);
    error.value = err?.message || 'Failed to delete founder.';
    dialog.value = false;
  }
}

function cancelDelete() {
  selectedFounder.value = null;
  dialog.value = false;
}

onMounted(loadFounders);
</script>

<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card max-width="600" class="w-100 pa-7">
      <v-card-title class="text-h5 text-center mb-4">Manage Founders</v-card-title>

      <v-progress-circular v-if="loading" indeterminate color="primary" class="d-flex mx-auto my-6" />

      <div v-else-if="error" class="text-error text-center my-4">
        {{ error }}
      </div>

      <v-list v-else>
        <v-list-item v-for="founder in founders" :key="founder.id" class="hover:bg-grey-lighten-4 rounded-lg my-1">
          <v-list-item-title> {{ founder.name }} - {{ founder.role }} </v-list-item-title>

          <template #append>
            <v-btn icon variant="text" color="primary">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon variant="text" color="error" @click="openDeleteDialog(founder)">
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
          <strong>{{ selectedFounder?.name }}</strong
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
