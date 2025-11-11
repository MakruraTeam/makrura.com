<script setup lang="ts">
import { ref, computed } from 'vue';
import DOMPurify from 'dompurify';
import { FounderCardProps } from './FounderCard.model';

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

const props = defineProps<FounderCardProps>();

const showContribution = ref(false);

const safeContribution = computed(() => DOMPurify.sanitize(props.contribution || ''));
</script>

<template>
  <v-card elevation="0" :width="350" variant="text" class="pa-6 d-flex flex-column align-center text-center">
    <div class="d-flex justify-center ga-2 mb-2">
      <v-img v-if="props.race.human" :src="humanIcon" width="40" height="40" contain />
      <v-img v-if="props.race.orc" :src="orcIcon" width="40" height="40" contain />
      <v-img v-if="props.race.undead" :src="undeadIcon" width="40" height="40" contain />
      <v-img v-if="props.race.nightelf" :src="nightelfIcon" width="40" height="40" contain />
    </div>

    <div class="avatar-wrapper">
      <v-avatar size="140">
        <v-img :src="props.image" :alt="props.name" cover rounded="circle" />
      </v-avatar>

      <v-btn icon variant="flat" color="primary" v-if="props.contribution" class="avatar-contribution-btn" @click="showContribution = true">
        <v-icon size="22" color="white">mdi-book-open-page-variant</v-icon>
      </v-btn>
    </div>

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

      <a v-if="props.twitter" :href="props.twitter" target="_blank">
        <v-img :src="twitterIcon" class="social-icon-img" />
      </a>

      <a v-if="props.reddit" :href="props.reddit" target="_blank">
        <v-img :src="redditIcon" class="social-icon-img" />
      </a>

      <a v-if="props.w3champions" :href="props.w3champions" target="_blank">
        <v-img :src="w3championsIcon" class="social-icon-img" />
      </a>
    </div>

    <div class="mt-4 font-weight-bold text-h6">{{ props.name }}</div>
    <div class="mt-1 text-body-2" style="opacity: 0.8">{{ props.role }}</div>

    <v-dialog v-model="showContribution" max-width="600">
      <v-card>
        <v-card-title class="mt-2 text-h6 w-full d-flex align-center justify-center"> {{ props.name }} — Contribution </v-card-title>
        <v-card-text>
          <div v-html="safeContribution"></div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" color="primary" @click="showContribution = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<style scoped>
.avatar-wrapper {
  position: relative;
  display: inline-block;
}

.avatar-contribution-btn {
  position: absolute;
  bottom: 6px;
  right: 6px;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  min-width: 36px;
  padding: 0;
}

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

:deep(.v-card-text img) {
  display: block;
  width: 100%;
  height: auto;
  object-fit: contain;
  margin: 0.5rem 0;
}
</style>
