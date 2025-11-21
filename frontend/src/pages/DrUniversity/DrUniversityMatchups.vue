<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';

import { getAllMatchupTables, getMatchupTableById } from '@/services/drUniversity/matchups/matchups.service';

import type { MatchupTableSummary, MatchupTableFull, MatchupCellResponse } from '@/services/drUniversity/matchups/matchups.model';

import liquipediaIcon from '@/assets/imgs/liquipedia.png';
import youtubeIcon from '@/assets/imgs/youtube.png';
import tiktokIcon from '@/assets/imgs/tiktok.png';
import soopIcon from '@/assets/imgs/soop.png';
import twitchIcon from '@/assets/imgs/twitch.png';
import instagramIcon from '@/assets/imgs/instagram.webp';
import twitterIcon from '@/assets/imgs/twitter.png';
import redditIcon from '@/assets/imgs/reddit.png';
import w3championsIcon from '@/assets/imgs/w3c.png';
import { getClassicWc3Races } from '@/services/wc3/wc3.service';

const platformIconMap: Record<string, string> = {
  tiktok: tiktokIcon,
  youtube: youtubeIcon,
  liquipedia: liquipediaIcon,
  soop: soopIcon,
  twitch: twitchIcon,
  instagram: instagramIcon,
  twitter: twitterIcon,
  reddit: redditIcon,
  w3champions: w3championsIcon,
};

const races = ref<{ id: number; name: string; short: string }[]>([]);

function createRaceShort(name: string) {
  const n = name.toLowerCase();

  if (n.includes('human')) return 'HU';
  if (n.includes('undead')) return 'UD';
  if (n.includes('orc')) return 'ORC';
  if (n.includes('night elf')) return 'NE';

  return name.substring(0, 2).toUpperCase();
}

const desiredOrder = ['HU', 'UD', 'ORC', 'NE'];
const tables = ref<MatchupTableSummary[]>([]);
const selectedIndex = ref(0);
const selectedTable = ref<MatchupTableFull | null>(null);
const loading = ref(true);

async function loadSelectedTable() {
  const table = tables.value[selectedIndex.value];
  if (!table) return;

  loading.value = true;
  selectedTable.value = await getMatchupTableById(table.id);
  loading.value = false;
}

onMounted(async () => {
  const raceData = await getClassicWc3Races();
  races.value = raceData.map((r) => ({
    ...r,
    short: createRaceShort(r.name),
  }));

  races.value.sort((a, b) => desiredOrder.indexOf(a.short) - desiredOrder.indexOf(b.short));

  tables.value = await getAllMatchupTables();

  if (tables.value.length > 0) {
    await loadSelectedTable();
  }
});

watch(selectedIndex, loadSelectedTable);

const grid = computed(() => {
  if (!selectedTable.value || races.value.length === 0) return [];

  const lookup = new Map<string, MatchupCellResponse>();

  selectedTable.value.cells.forEach((row) => {
    row.cols.forEach((col) => {
      const rowRace = races.value.find((r) => r.id === row.rowRaceId);
      const colRace = races.value.find((r) => r.id === col.colRaceId);

      if (!rowRace || !colRace) return;

      const key = `${rowRace.short}_${colRace.short}`;

      const fullCell: MatchupCellResponse = {
        cellId: col.cellId,
        rowRaceId: row.rowRaceId,
        rowRaceName: row.rowRaceName,
        colRaceId: col.colRaceId,
        colRaceName: col.colRaceName,
        links: col.links,
      };

      lookup.set(key, fullCell);
    });
  });

  return races.value.map((rowRace) =>
    races.value.map((colRace) => {
      const key = `${rowRace.short}_${colRace.short}`;
      return lookup.get(key) || null;
    })
  );
});
</script>

<template>
  <div class="mt-6">
    <v-tabs v-model="selectedIndex" dark align-tabs="center">
      <v-tab v-for="t in tables" :key="t.id">
        {{ t.name }}
      </v-tab>
    </v-tabs>

    <v-progress-circular v-if="loading" indeterminate color="primary" class="d-flex mx-auto my-6" />

    <div v-else-if="selectedTable" class="mt-6 px-6">
      <v-table class="matchup-grid rounded-lg" density="comfortable">
        <thead>
          <tr>
            <th></th>
            <th v-for="race in races" :key="race.id">
              {{ race.short }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(row, rIdx) in grid" :key="rIdx">
            <th>{{ races[rIdx].short }}</th>

            <td v-for="(cell, cIdx) in row" :key="cIdx">
              <div v-if="cell && cell.links.length" class="links pa-2">
                <div v-for="link in cell.links" class="link-item" :key="link.url">
                  <img v-if="link.platform && platformIconMap[link.platform]" :src="platformIconMap[link.platform]" class="icon" />
                  <a :href="link.url" target="_blank">
                    {{ link.text || link.platform }}
                  </a>
                </div>
              </div>

              <div v-else class="text-black font-weight-bold">—</div>
            </td>
          </tr>
        </tbody>
      </v-table>
    </div>

    <div v-else>
      <h3>No table loaded</h3>
    </div>
  </div>
</template>

<style scoped>
:deep(.v-table) {
  width: 100%;
  border-collapse: collapse !important;
}

:deep(.v-table__wrapper) {
  overflow-x: auto !important;
  overflow-y: visible !important;
}

:deep(.v-table > .v-table__wrapper > table) {
  min-width: 700px; /* Increase if needed */
  border-collapse: collapse !important;
  table-layout: fixed !important;
}

:deep(.v-table thead th),
:deep(.v-table tbody td),
:deep(.v-table tbody th) {
  padding: 8px !important;
  text-align: center !important;
  vertical-align: middle !important;
  height: 70px !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
}

:deep(.v-table tbody th:first-child),
:deep(.v-table thead th:first-child) {
  width: 80px !important;
}

:deep(.v-table tbody td),
:deep(.v-table thead th:not(:first-child)) {
  min-width: 150px !important;
  max-width: 150px !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

.matchup-grid {
  width: 100%;
}

.icon {
  width: 20px;
  height: 20px;
  margin-right: 4px;
}

.links {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.link-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
}

a {
  color: black;
  font-weight: bold;
  text-decoration: none;
}

:deep(tbody tr:nth-child(4n + 1) td) {
  background-color: #c9daf8 !important;
}
:deep(tbody tr:nth-child(4n + 2) td) {
  background-color: #d9d2e9 !important;
}
:deep(tbody tr:nth-child(4n + 3) td) {
  background-color: #f4cccc !important;
}

:deep(tbody tr:nth-child(4n + 4) td) {
  background-color: #d9ead3 !important;
}
</style>
