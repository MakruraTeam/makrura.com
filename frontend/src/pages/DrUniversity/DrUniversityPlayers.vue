<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

import { getAllPlayers } from '@/services/drUniversity/players/players.service';
import type { PlayerResponse } from '@/services/drUniversity/players/players.model';

import liquipediaIcon from '@/assets/imgs/liquipedia.png';
import youtubeIcon from '@/assets/imgs/youtube.png';
import tiktokIcon from '@/assets/imgs/tiktok.png';
import soopIcon from '@/assets/imgs/soop.png';
import twitchIcon from '@/assets/imgs/twitch.png';
import instagramIcon from '@/assets/imgs/instagram.webp';
import twitterIcon from '@/assets/imgs/twitter.png';
import redditIcon from '@/assets/imgs/reddit.png';
import w3championsIcon from '@/assets/imgs/w3c.png';

import humanIcon from '@/assets/imgs/human.webp';
import orcIcon from '@/assets/imgs/orc.webp';
import undeadIcon from '@/assets/imgs/undead.webp';
import nightelfIcon from '@/assets/imgs/nightelf.webp';

const players = ref<PlayerResponse[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    players.value = await getAllPlayers();
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
});

const sortKey = ref<'name' | 'mmr' | 'country'>('name');
const sortDirection = ref<'asc' | 'desc'>('asc');

function sortBy(key: 'name' | 'mmr' | 'country') {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortDirection.value = 'asc';
  }
}

const sortedPlayers = computed(() => {
  return [...players.value].sort((a, b) => {
    const dir = sortDirection.value === 'asc' ? 1 : -1;

    if (sortKey.value === 'mmr') {
      return ((a.mmr ?? 0) - (b.mmr ?? 0)) * dir;
    }

    const v1 = (a[sortKey.value] ?? '').toString().toLowerCase();
    const v2 = (b[sortKey.value] ?? '').toString().toLowerCase();

    return v1.localeCompare(v2) * dir;
  });
});

const raceIcons: Record<string, string> = {
  human: humanIcon,
  orc: orcIcon,
  undead: undeadIcon,
  nightelf: nightelfIcon,
};

const socialIcons: Record<string, string> = {
  liquipedia: liquipediaIcon,
  youtube: youtubeIcon,
  tiktok: tiktokIcon,
  soop: soopIcon,
  twitch: twitchIcon,
  instagram: instagramIcon,
  twitter: twitterIcon,
  reddit: redditIcon,
  w3champions: w3championsIcon,
};
</script>

<template>
  <v-container class="ma-5">
    <v-progress-circular v-if="loading" indeterminate color="primary" class="d-flex mx-auto my-6" />

    <v-table v-else class="ma-5">
      <thead>
        <tr>
          <th class="text-center" style="width: 5%">#</th>

          <th class="text-left cursor-pointer" style="width: 35%" @click="sortBy('name')">
            Name
            <v-icon size="16" v-if="sortKey === 'name'">
              {{ sortDirection === 'asc' ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
            </v-icon>
          </th>

          <th class="text-center" style="width: 20%">Race</th>

          <th class="text-center cursor-pointer" style="width: 10%" @click="sortBy('mmr')">
            MMR
            <v-icon size="16" v-if="sortKey === 'mmr'">
              {{ sortDirection === 'asc' ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
            </v-icon>
          </th>

          <th class="text-center cursor-pointer" style="width: 10%" @click="sortBy('country')">
            Country
            <v-icon size="16" v-if="sortKey === 'country'">
              {{ sortDirection === 'asc' ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
            </v-icon>
          </th>

          <th class="text-center" style="width: 20%">Links</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(player, index) in sortedPlayers" :key="player.id">
          <td class="text-center">{{ index + 1 }}</td>

          <td>{{ player.name }}</td>

          <td class="text-center d-flex justify-center align-center ga-2">
            <template v-for="(active, race) in player.race" :key="race">
              <img v-if="active" :src="raceIcons[race]" width="28" height="28" />
            </template>
          </td>

          <td class="text-center">{{ player.mmr }}</td>
          <td class="text-center">{{ player.country }}</td>

          <td class="text-center d-flex justify-center align-center ga-2">
            <template v-for="(item, idx) in player.links" :key="idx">
              <a :href="item.url" target="_blank" rel="noopener noreferrer">
                <v-img v-if="socialIcons[item.platform]" :src="socialIcons[item.platform]" width="24" height="24" rounded="circle" />
              </a>
            </template>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
