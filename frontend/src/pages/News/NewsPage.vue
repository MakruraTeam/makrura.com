<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { getAllArticles } from '@/services/news/article.service';
import { ArticleListItem } from '@/services/news/article.model';
import ArticleCard from '@/components/ArticleCard/ArticleCard.vue';

const articles = ref<ArticleListItem[]>([]);
const currentPage = ref(1);
const itemsPerPage = 5;
const loading = ref(true);
const errorMessage = ref<string | null>(null);

const totalPages = computed(() => Math.ceil(articles.value.length / itemsPerPage));

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return articles.value.slice(start, start + itemsPerPage);
});

async function fetchArticles() {
  try {
    loading.value = true;
    const res = await getAllArticles();
    articles.value = res;
  } catch (err) {
    console.error('Error loading articles:', err);
    errorMessage.value = 'Failed to load articles.';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchArticles();
});
</script>

<template>
  <v-container class="py-6 d-flex flex-column align-center ga-4">
    <div class="text-h5 text-md-h4 mb-4 d-flex align-center ga-2">Ape News Journal</div>
    <v-progress-circular v-if="loading" indeterminate color="primary" class="d-flex mx-auto my-6" />

    <template v-else-if="errorMessage">
      <p class="text-error">{{ errorMessage }}</p>
    </template>

    <template v-else>
      <div v-for="article in paginatedArticles" :key="article.id" class="w-100 d-flex justify-center">
        <ArticleCard :title="article.title" :shortDescription="article.shortDescription" :links="article.links" :image="article.image" :slug="article.slug" :createdAt="article.createdAt" />
      </div>

      <div class="w-100 d-flex justify-center mt-6">
        <v-pagination v-if="totalPages > 1" v-model="currentPage" :length="totalPages" total-visible="5" class="pagination" />
      </div>
    </template>
  </v-container>
</template>

<style scoped>
:deep(.v-pagination) {
  max-width: 100%;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;
  overflow-x: hidden;
}

:deep(.v-pagination__list) {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
