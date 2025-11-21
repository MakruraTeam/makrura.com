<script setup lang="ts">
import { ref, onMounted } from 'vue';

import { getClassicWc3Races } from '@/services/wc3/wc3.service';
import { getSocialPlatforms } from '@/services/common/common.service';
import type { CreateMatchupTableDto, MatchupCell, MatchupLink } from '@/services/drUniversity/matchups/matchups.model';

import liquipediaIcon from '@/assets/imgs/liquipedia.png';
import youtubeIcon from '@/assets/imgs/youtube.png';
import tiktokIcon from '@/assets/imgs/tiktok.png';
import soopIcon from '@/assets/imgs/soop.png';
import twitchIcon from '@/assets/imgs/twitch.png';
import instagramIcon from '@/assets/imgs/instagram.webp';
import twitterIcon from '@/assets/imgs/twitter.png';
import redditIcon from '@/assets/imgs/reddit.png';
import w3championsIcon from '@/assets/imgs/w3c.png';

interface Props {
  initialData?: CreateMatchupTableDto;
  onSubmit: (payload: CreateMatchupTableDto) => Promise<void>;
  loading?: boolean;
}

const props = defineProps<Props>();

const name = ref('');

const races = ref<{ id: number; name: string }[]>([]);
const socialPlatforms = ref<{ id: number; name: string }[]>([]);

const cells = ref<Record<string, MatchupCell>>({});

const dialogVisible = ref(false);
const editingKey = ref<string | null>(null);
const tempLinks = ref<MatchupLink[]>([]);

const platformIcons: Record<string, string> = {
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

onMounted(async () => {
  const [racesRes, platformsRes] = await Promise.all([getClassicWc3Races(), getSocialPlatforms()]);
  races.value = racesRes ?? [];
  socialPlatforms.value = platformsRes ?? [];

  for (const r1 of races.value) {
    for (const r2 of races.value) {
      const key = `${r1.id}-${r2.id}`;
      cells.value[key] = {
        rowRaceId: r1.id,
        colRaceId: r2.id,
        links: [],
      };
    }
  }

  if (props.initialData) {
    name.value = props.initialData.name;

    for (const cell of props.initialData.cells) {
      const key = `${cell.rowRaceId}-${cell.colRaceId}`;
      cells.value[key].links = cell.links ?? [];
    }
  }
});

function openDialog(key: string) {
  editingKey.value = key;
  tempLinks.value = JSON.parse(JSON.stringify(cells.value[key].links || []));
  dialogVisible.value = true;
}

function saveDialog() {
  if (editingKey.value) {
    cells.value[editingKey.value].links = JSON.parse(JSON.stringify(tempLinks.value));
  }
  dialogVisible.value = false;
}

function addLink() {
  tempLinks.value.push({
    platformId: socialPlatforms.value[0]?.id ?? null,
    url: '',
    text: '',
  });
}

function removeLink(index: number) {
  tempLinks.value.splice(index, 1);
}

async function handleSubmit() {
  const payload: CreateMatchupTableDto = {
    name: name.value,
    cells: Object.values(cells.value),
  };

  await props.onSubmit(payload);
}

function getPlatformIcon(platformId: number | undefined) {
  const platform = socialPlatforms.value.find((p) => p.id === platformId);
  if (!platform) return;
  return platformIcons[platform.name.toLowerCase()];
}
</script>

<template>
  <v-text-field v-model="name" label="Name" outlined required />

  <div class="matchup-grid">
    <div class="corner"></div>
    <div v-for="race in races" :key="race.id" class="header">{{ race.name }}</div>

    <template v-for="rowRace in races" :key="'row-' + rowRace.id">
      <div class="header">{{ rowRace.name }}</div>

      <div v-for="colRace in races" :key="`cell-${rowRace.id}-${colRace.id}`" class="cell" @click="openDialog(`${rowRace.id}-${colRace.id}`)">
        <div v-if="cells[`${rowRace.id}-${colRace.id}`].links?.length === 0" class="plus">+</div>

        <div v-else class="links">
          <v-chip
            v-for="(l, index) in cells[`${rowRace.id}-${colRace.id}`].links"
            :key="index"
            size="small"
            class="d-flex align-center justify-center"
          >
            <v-img :src="getPlatformIcon(l.platformId)" :height="18" :width="18" />
          </v-chip>
        </div>
      </div>
    </template>
  </div>

  <v-btn :loading="props.loading" @click="handleSubmit" block color="primary" class="mt-4"> Save Matchup Table </v-btn>

  <v-dialog v-model="dialogVisible" width="840" persistent>
    <v-card class="pa-4">
      <div class="d-flex justify-center flex-column align-center ga-4">
        <v-card-title>Edit Links</v-card-title>
        <v-btn class="mb-3" :width="200" color="secondary" variant="elevated" @click="addLink"> <v-icon start>mdi-plus</v-icon> Add Link </v-btn>
      </div>
      <v-row v-for="(link, i) in tempLinks" :key="i" class="py-2" dense>
        <v-col cols="12">
          <v-card class="pa-4 d-flex align-center flex-wrap ga-2" elevation="1" rounded="lg">
            <v-select
              v-model="link.platformId"
              :items="socialPlatforms"
              item-title="name"
              item-value="id"
              label="Platform"
              outlined
              hide-details
              class="social-input"
            />

            <v-text-field v-model="link.url" label="URL" outlined hide-details class="social-input" />

            <v-text-field v-model="link.text" label="Description" outlined hide-details class="social-input" />

            <v-btn icon color="error" variant="tonal" class="delete-btn" @click="removeLink(i)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-card>
        </v-col>
      </v-row>
      <div class="d-flex justify-center align-center ga-4">
        <v-btn color="primary" :width="200" class="mt-4" @click="saveDialog"> Save </v-btn>
        <v-btn color="surface" :width="200" class="mt-4" @click="dialogVisible = false"> Cancel </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.matchup-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
  margin-top: 20px;
}

.header {
  padding: 10px;
  text-align: center;
  font-weight: bold;
  border-radius: 6px;
}

.cell {
  height: 80px;
  border: 1px solid #ddd;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.plus {
  font-size: 28px;
  color: #999;
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: center;
}

.social-input {
  min-width: 200px;
  flex: 1 1 200px;
}
.delete-btn {
  align-self: center;
}
</style>
