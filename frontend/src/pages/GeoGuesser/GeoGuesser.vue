<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getAllGeoGuesserIds } from '@/services/geoGuesser/geoGuesser.service';

const router = useRouter();
const ids = ref<number[]>([]);
const solvedIds = ref<number[]>([]);

function loadSolved() {
  try {
    solvedIds.value = JSON.parse(localStorage.getItem('geo-guesser-solved') || '[]');
  } catch {
    solvedIds.value = [];
  }
}

function isSolved(id: number) {
  return solvedIds.value.includes(id);
}

function openGuess(id: number) {
  router.push(`/geoguesser/${id}`);
}

onMounted(async () => {
  loadSolved();
  ids.value = await getAllGeoGuesserIds();
});
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="text-center">
        <h1>GeoGuesser</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col v-for="(id, index) in ids" :key="id" cols="4" sm="2" md="2" lg="1" class="text-center">
        <v-card elevation="2" class="pa-3" hover @click="openGuess(id)">
          <v-avatar size="56" class="mx-auto" :color="isSolved(id) ? 'green-lighten-2' : 'grey-lighten-3'">
            <v-icon v-if="isSolved(id)" color="green-darken-3"> mdi-check </v-icon>
          </v-avatar>

          <div class="mt-2 text-caption">#{{ index + 1 }}</div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
