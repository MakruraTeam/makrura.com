<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<BlogCardProps>();

import liquipediaIcon from '@/assets/imgs/liquipedia.png';
import youtubeIcon from '@/assets/imgs/youtube.png';
import tiktokIcon from '@/assets/imgs/tiktok.png';
import soopIcon from '@/assets/imgs/soop.png';
import twitchIcon from '@/assets/imgs/twitch.png';
import instagramIcon from '@/assets/imgs/instagram.webp';
import twitterIcon from '@/assets/imgs/twitter.png';
import redditIcon from '@/assets/imgs/reddit.png';
import w3championsIcon from '@/assets/imgs/w3c.png';
import { BlogCardProps, Platform } from './BlogCard.model';
</script>

<template>
  <v-card class="d-flex flex-row pa-4 rounded-xl elevation-3" max-width="950">
    <div class="left-section mr-6">
      <img :src="image" alt="Blog image" class="blog-img mb-4" />

      <div class="d-flex flex-column ga-2 w-100">
        <v-btn
          v-for="(item, i) in links"
          :key="i"
          :href="item.link"
          target="_blank"
          variant="text"
          density="comfortable"
          class="pa-0 text-none d-flex align-center justify-start link-btn"
        >
          <v-avatar size="26" class="mr-2">
            <v-img v-if="item.platform === Platform.YOUTUBE" :src="youtubeIcon" />
            <v-img v-else-if="item.platform === Platform.TWITCH" :src="twitchIcon" />
            <v-img v-else-if="item.platform === Platform.TIKTOK" :src="tiktokIcon" />
            <v-img v-else-if="item.platform === Platform.INSTAGRAM" :src="instagramIcon" />
            <v-img v-else-if="item.platform === Platform.TWITTER" :src="twitterIcon" />
            <v-img v-else-if="item.platform === Platform.REDDIT" :src="redditIcon" />
            <v-img v-else-if="item.platform === Platform.LIQUIPEDIA" :src="liquipediaIcon" />
            <v-img v-else-if="item.platform === Platform.SOOP" :src="soopIcon" />
            <v-img v-else-if="item.platform === Platform.W3CHAMPIONS" :src="w3championsIcon" />
          </v-avatar>
          <span class="text-body-2">{{ item.description }}</span>
        </v-btn>
      </div>
    </div>

    <div class="flex-grow-1 d-flex flex-column justify-space-between">
      <div>
        <h2 class="text-h5 font-weight-medium mb-3">{{ title }}</h2>
        <p class="blog-text mb-6">{{ text }}</p>
      </div>

      <div class="d-flex justify-center">
        <v-btn color="primary" variant="flat" class="mt-2">Read More</v-btn>
      </div>
    </div>
  </v-card>
</template>

<style scoped>
.left-section {
  width: 300px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.blog-img {
  width: 300px;
  height: 180px;
  border-radius: 10px;
  object-fit: cover;
  background-color: #f5f5f5;
}

.blog-text {
  white-space: pre-line;
}

.link-btn {
  justify-content: flex-start !important;
  text-align: left;
  width: 100%;
}
</style>
