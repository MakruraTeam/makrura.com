<script setup lang="ts">
import { ref } from 'vue';
import { createArticle } from '@/services/news/article.service';
import type { Article, CreateArticleRequest } from '@/services/news/article.model';
import ArticleForm from '@/components/Cms/ArticleForm/ArticleForm.vue';

const loading = ref(false);
const success = ref(false);
const errorMessage = ref('');

async function handleCreateArticle(payload: CreateArticleRequest) {
  loading.value = true;
  success.value = false;
  errorMessage.value = '';

  try {
    await createArticle(payload);
    success.value = true;
  } catch (err: any) {
    console.error(err);
    errorMessage.value = err?.message || 'Failed to create article.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="pa-6 w-100" max-width="100%">
      <v-card-title class="text-h5 text-center mb-4">Add New Article</v-card-title>

      <ArticleForm :onSubmit="handleCreateArticle" :loading="loading" />

      <v-alert v-if="errorMessage" type="error" variant="tonal" class="mt-4 text-center">
        {{ errorMessage }}
      </v-alert>

      <v-alert v-if="success" type="success" variant="tonal" class="mt-4 text-center"> Article created successfully. </v-alert>
    </v-card>
  </v-container>
</template>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
