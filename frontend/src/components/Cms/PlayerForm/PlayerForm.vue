<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import type { Player, PlayerResponse } from '@/services/drUniversity/players/players.model';

import { getClassicWc3Races } from '@/services/wc3/wc3.service';
import { getSocialPlatforms } from '@/services/common/common.service';
import type { Wc3Races } from '@/services/wc3/wc3.model';
import type { SocialPlatform } from '@/services/common/common.model';

interface Props {
  initialData?: PlayerResponse;
  onSubmit: (payload: Player) => Promise<void>;
  loading?: boolean;
}

const props = defineProps<Props>();

const name = ref('');
const mmr = ref<number | null>(null);
const country = ref('');
const selectedRaces = ref<number[]>([]);

const socialLinks = ref<{ platformId: number | null; url: string }[]>([]);

const races = ref<Wc3Races[]>([]);
const socialPlatforms = ref<SocialPlatform[]>([]);

const pageLoading = ref(true);
const errorMessage = ref('');

function fillFormFromInitialData(data: PlayerResponse) {
  name.value = data.name;
  mmr.value = data.mmr;
  country.value = data.country ?? '';

  const raceMap = { human: 1, orc: 2, undead: 3, nightelf: 4 };
  selectedRaces.value = Object.entries(data.race)
    .filter(([_, active]) => active)
    .map(([key]) => raceMap[key as keyof typeof raceMap]);

  socialLinks.value = data.links.map((l) => ({
    platformId: socialPlatforms.value.find((p) => p.name.toLowerCase() === l.platform)?.id ?? null,
    url: l.url,
  }));
}

onMounted(async () => {
  try {
    const [racesRes, platformsRes] = await Promise.all([getClassicWc3Races(), getSocialPlatforms()]);

    races.value = racesRes ?? [];
    socialPlatforms.value = platformsRes ?? [];

    if (props.initialData) {
      fillFormFromInitialData(props.initialData);
    }
  } catch (err) {
    console.error(err);
    errorMessage.value = 'Failed to load required data.';
  } finally {
    pageLoading.value = false;
  }
});

watch(
  () => props.initialData,
  (val) => val && fillFormFromInitialData(val)
);

function addSocialLink() {
  socialLinks.value.push({ platformId: null, url: '' });
}

function removeSocialLink(index: number) {
  socialLinks.value.splice(index, 1);
}

async function handleSubmit() {
  errorMessage.value = '';

  if (!name.value) {
    errorMessage.value = 'Name is required.';
    return;
  }

  const payload: Player = {
    name: name.value,
    mmr: mmr.value,
    country: country.value || null,
    races: selectedRaces.value,

    socialLinks: socialLinks.value
      .filter((l) => l.platformId && l.url)
      .map((l) => ({
        id: l.platformId!,
        link: l.url,
      })),
  };

  try {
    await props.onSubmit(payload);
  } catch (err: any) {
    console.error(err);
    errorMessage.value = err?.message || 'Failed to save player.';
  }
}
</script>

<template>
  <v-progress-circular v-if="pageLoading" indeterminate color="primary" class="d-flex mx-auto my-6" />

  <v-form v-else @submit.prevent="handleSubmit">
    <v-text-field v-model="name" label="Name" outlined required />

    <v-text-field v-model.number="mmr" type="number" label="MMR" outlined clearable />

    <v-text-field v-model="country" label="Country" outlined clearable />

    <v-select v-model="selectedRaces" :items="races" item-title="name" item-value="id" label="Races" multiple chips outlined class="mt-4" />

    <!-- MULTIPLE SOCIAL LINKS -->
    <div class="text-h6 mt-6 mb-3">Social Links</div>

    <div class="d-flex justify-center mb-4">
      <v-btn color="secondary" variant="elevated" @click="addSocialLink"> <v-icon start>mdi-plus</v-icon> Add Social Link </v-btn>
    </div>

    <v-row v-if="socialLinks.length" dense>
      <v-col v-for="(link, index) in socialLinks" :key="index" cols="12" class="py-2">
        <v-card class="pa-4 d-flex align-center flex-wrap gap-4" elevation="1" rounded="lg">
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

          <v-btn icon color="error" variant="tonal" class="delete-btn" @click="removeSocialLink(index)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <v-alert v-if="errorMessage" type="error" variant="tonal" class="mt-2">
      {{ errorMessage }}
    </v-alert>

    <v-btn :loading="props.loading" type="submit" color="primary" block class="mt-4"> Save Player </v-btn>
  </v-form>
</template>

<style scoped>
.social-input {
  min-width: 240px;
  flex: 1 1 240px;
}
.delete-btn {
  align-self: center;
}
</style>
