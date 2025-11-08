<script setup lang="ts">
import liquipediaIcon from '@/assets/imgs/liquipedia.png';
import youtubeIcon from '@/assets/imgs/youtube.png';
import tiktokIcon from '@/assets/imgs/tiktok.png';
import soopIcon from '@/assets/imgs/soop.png';
import twitchIcon from '@/assets/imgs/twitch.png';
import instagramIcon from '@/assets/imgs/instagram.webp';
import twitterIcon from '@/assets/imgs/twitter.png';
import redditIcon from '@/assets/imgs/reddit.png';
import w3championsIcon from '@/assets/imgs/w3c.png';

import BlogImage from '@/assets/imgs/blog1.png';
import { Platform } from '@/components/DrUniversity/BlogCard/BlogCard.model';
import { computed } from 'vue';
import DOMPurify from 'dompurify';

const title = 'Dark Ranger First in W3Champions Season 22 Finals: Starbuck vs Dise';
const text = `
<p>You know a strategy is strong when pro players are willing to use it in very important games. Recently, Starbuck played a Dark Ranger opener twice as Human vs Dise’s Night Elf — with the W3C Season 22 Champion title on the line.</p>

<h2>Results</h2>
<p>Starbuck won both games convincingly, securing the championship for himself and proving the strength of the Dark Ranger strategy in high-level play.</p>
`;

const safeContribution = computed(() => DOMPurify.sanitize(text || ''));

const links = [
  { link: 'https://warcraft3.info/ticker/11816000014000/Starbuck_vs_Dise', platform: Platform.W3CHAMPIONS, description: 'Match ticker' },
  { link: 'https://www.youtube.com/live/chwfRqpWFpc?si=K7RhNAfXw8f2gkgK&t=29602', platform: Platform.YOUTUBE, description: 'Game 1' },
  { link: 'https://www.youtube.com/live/chwfRqpWFpc?si=1aq4GScrzm7WmY1a&t=30193', platform: Platform.YOUTUBE, description: 'Game 2' },
];
</script>

<template>
  <v-container class="d-flex justify-center py-10">
    <v-card class="pa-6" max-width="800" elevation="2">
      <v-img :src="BlogImage" width="100%" aspect-ratio="5/3" class="rounded-lg mb-4" cover />

      <h1 class="text-h5 text-md-h4 font-weight-bold mb-4">
        {{ title }}
      </h1>

      <div v-html="safeContribution" class="mb-6"></div>

      <div class="d-flex flex-column align-start">
        <div v-for="(item, index) in links" :key="index" class="d-flex align-center mb-2">
          <v-img v-if="item.platform === Platform.YOUTUBE" :src="youtubeIcon" width="20" height="20" class="me-2" />
          <v-img v-else-if="item.platform === Platform.W3CHAMPIONS" :src="w3championsIcon" width="20" height="20" class="me-2" />
          <v-img v-else-if="item.platform === Platform.LIQUIPEDIA" :src="liquipediaIcon" width="20" height="20" class="me-2" />
          <v-img v-else-if="item.platform === Platform.TWITCH" :src="twitchIcon" width="20" height="20" class="me-2" />
          <v-img v-else-if="item.platform === Platform.TIKTOK" :src="tiktokIcon" width="20" height="20" class="me-2" />
          <v-img v-else-if="item.platform === Platform.SOOP" :src="soopIcon" width="20" height="20" class="me-2" />
          <v-img v-else-if="item.platform === Platform.INSTAGRAM" :src="instagramIcon" width="20" height="20" class="me-2" />
          <v-img v-else-if="item.platform === Platform.TWITTER" :src="twitterIcon" width="20" height="20" class="me-2" />
          <v-img v-else-if="item.platform === Platform.REDDIT" :src="redditIcon" width="20" height="20" class="me-2" />

          <v-icon v-else icon="mdi-link-variant" size="18" class="me-2" />

          <a :href="item.link" target="_blank" rel="noopener noreferrer" class="text-body-2 text-decoration-none"> {{ item.description }} </a>
        </div>
      </div>
    </v-card>
  </v-container>
</template>
