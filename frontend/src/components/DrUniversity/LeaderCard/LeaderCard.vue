<script setup lang="ts">
import { LeaderCardProps } from './LeaderCard.model';

import liquipediaIcon from '@/assets/liquipedia.png';
import youtubeIcon from '@/assets/youtube.png';
import tiktokIcon from '@/assets/tiktok.png';
import soopIcon from '@/assets/soop.png';
import twitchIcon from '@/assets/twitch.png';
import instagramIcon from '@/assets/instagram.webp';

const props = defineProps<LeaderCardProps>();
</script>

<template>
  <v-card elevation="0" :width="300" variant="text" class="pa-6 d-flex flex-column align-center text-center">
    <v-avatar size="140">
      <v-img :src="props.image" :alt="props.name" cover />
    </v-avatar>

    <div class="d-flex justify-center mt-4 social-wrapper">
      <a v-if="props.tiktok" :href="props.tiktok" target="_blank">
        <v-img :src="tiktokIcon" class="social-icon-img" />
      </a>

      <a v-if="props.youtube" :href="props.youtube" target="_blank">
        <v-img :src="youtubeIcon" class="social-icon-img" />
      </a>

      <a v-if="props.liquipedia" :href="props.liquipedia" target="_blank">
        <v-img :src="liquipediaIcon" class="social-icon-img" />
      </a>

      <a v-if="props.soop" :href="props.soop" target="_blank">
        <v-img :src="soopIcon" class="social-icon-img" />
      </a>

      <a v-if="props.twitch" :href="props.twitch" target="_blank">
        <v-img :src="twitchIcon" class="social-icon-img" />
      </a>

      <a v-if="props.instagram" :href="props.instagram" target="_blank">
        <v-img :src="instagramIcon" class="social-icon-img" />
      </a>
    </div>

    <div class="mt-4 font-weight-bold text-h6">
      {{ props.name }}
    </div>

    <div class="mt-1 text-body-2" style="opacity: 0.8">
      {{ props.role }}
    </div>
  </v-card>
</template>

<style scoped>
.social-wrapper {
  gap: 14px;
}

.social-icon-img {
  width: 26px;
  height: 26px;
  object-fit: contain;
  filter: brightness(1) invert(0);
  transition: opacity 0.2s;
  border-radius: 50%;
}

.social-icon-img:hover {
  opacity: 0.7;
}
</style>
