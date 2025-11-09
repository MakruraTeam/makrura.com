<script setup lang="ts">
import { defineProps } from 'vue';
import { ArticleCardProps, Platform } from './ArticleCard.model';

import liquipediaIcon from '@/assets/imgs/liquipedia.png';
import youtubeIcon from '@/assets/imgs/youtube.png';
import tiktokIcon from '@/assets/imgs/tiktok.png';
import soopIcon from '@/assets/imgs/soop.png';
import twitchIcon from '@/assets/imgs/twitch.png';
import instagramIcon from '@/assets/imgs/instagram.webp';
import twitterIcon from '@/assets/imgs/twitter.png';
import redditIcon from '@/assets/imgs/reddit.png';
import w3championsIcon from '@/assets/imgs/w3c.png';
import { useRouter } from 'vue-router';

const props = defineProps<ArticleCardProps>();

const router = useRouter();

const goToArticle = () => {
  router.push({ name: 'news-article', params: { slug: props.slug } });
};
</script>

<template>
  <v-card class="blog-card d-flex flex-column flex-md-row pa-4 rounded-xl elevation-3 ga-4 align-start justify-space-between" max-width="950">
    <div class="left-section">
      <v-img :src="image" class="rounded-lg mb-4" aspect-ratio="5/3" width="100%" cover />

      <div class="d-flex flex-column align-start ga-2">
        <v-btn
          v-for="(item, i) in links"
          :key="i"
          :href="item.link"
          target="_blank"
          variant="text"
          density="comfortable"
          class="pa-0 text-none d-flex align-center justify-start w-100"
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

    <!-- RIGHT SECTION -->
    <div class="right-section">
      <div>
        <h2 class="text-h5 font-weight-medium mb-3 text-center text-md-start">
          {{ title }}
        </h2>
        <p class="text-body-2 mb-6 text-center text-md-start">
          {{ shortDescription }}
        </p>
      </div>
      <div class="d-flex justify-center justify-md-start">
        <v-btn color="primary" variant="flat" class="mt-2" @click="goToArticle">Read More</v-btn>
      </div>
    </div>
  </v-card>
</template>

<style scoped>
.blog-card {
  width: 100%;
}

.left-section,
.right-section {
  width: 100%;
}

/* Apply desktop layout widths */
@media (min-width: 960px) {
  .left-section {
    width: 35%;
  }

  .right-section {
    width: 65%;
  }
}

:deep(.v-img) {
  object-fit: cover;
}
</style>
