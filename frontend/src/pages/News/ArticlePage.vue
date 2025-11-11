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

import { ref, computed, onMounted } from 'vue';
import DOMPurify from 'dompurify';
import { useRoute } from 'vue-router';
import { Article } from '@/services/news/article.model';
import { getArticleBySlug } from '@/services/news/article.service';
import { Platform } from '@/components/ArticleCard/ArticleCard.model';

const route = useRoute();

const article = ref<Article | null>(null);
const loading = ref(true);
const errorMessage = ref<string | null>(null);

async function fetchArticle() {
  const slug = route.params.slug as string;
  try {
    loading.value = true;
    const data: any = await getArticleBySlug(slug);
    article.value = data;
  } catch (err) {
    errorMessage.value = 'Failed to load article.';
  } finally {
    loading.value = false;
  }
}

onMounted(fetchArticle);

const safeContribution = computed(() => DOMPurify.sanitize(article.value?.content || ''));
</script>

<template>
  <v-container class="d-flex justify-center py-10">
    <v-progress-circular v-if="loading" indeterminate color="primary" class="d-flex mx-auto my-6" />

    <v-card v-else-if="article" class="pa-6" width="1000" elevation="2">
      <v-img v-if="article.image" :src="article.image" width="100%" aspect-ratio="5/3" class="rounded-lg mb-4" cover />

      <h1 class="text-h5 text-md-h4 font-weight-bold mb-4">
        {{ article.title }}
      </h1>

      <div v-html="safeContribution" class="mb-6"></div>

      <div class="d-flex flex-column align-start">
        <div v-for="(item, index) in article.links" :key="index" class="d-flex align-center mb-2">
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

          <a :href="item.link" target="_blank" rel="noopener noreferrer" class="text-body-2 text-decoration-none">
            {{ item.description }}
          </a>
        </div>
      </div>
    </v-card>

    <p v-else-if="errorMessage" class="text-error">{{ errorMessage }}</p>
  </v-container>
</template>
<style scoped>
:deep(.v-card .mb-6 img) {
  display: block;
  width: 100%;
  height: auto;
  object-fit: contain;
}
</style>
