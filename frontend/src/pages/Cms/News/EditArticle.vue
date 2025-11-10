<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getArticleById, updateArticle } from '@/services/news/article.service';
import type { EditableArticle, CreateArticleRequest } from '@/services/news/article.model';
import ArticleForm from '@/components/Cms/ArticleForm/ArticleForm.vue';

const route = useRoute();

const article = ref<EditableArticle | null>(null);
const loading = ref(true);
const saving = ref(false);
const success = ref(false);
const errorMessage = ref('');

onMounted(async () => {
  try {
    const id = Number(route.params.id);
    if (!id) throw new Error('Invalid article ID');

    const data = await getArticleById(id);
    article.value = data;
  } catch (err: any) {
    console.error(err);
    errorMessage.value = err?.message || 'Failed to load article.';
  } finally {
    loading.value = false;
  }
});

async function handleUpdateArticle(payload: CreateArticleRequest) {
  if (!article.value?.id) return;

  saving.value = true;
  success.value = false;
  errorMessage.value = '';

  try {
    await updateArticle(article.value.id, payload);
    success.value = true;
  } catch (err: any) {
    console.error(err);
    errorMessage.value = err?.message || 'Failed to update article.';
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="pa-6 w-100" max-width="100%">
      <v-card-title class="text-h5 text-center mb-4">Edit Article</v-card-title>

      <v-progress-circular v-if="loading" indeterminate color="primary" class="d-flex mx-auto my-6" />

      <template v-else>
        <ArticleForm v-if="article" :initialData="article" :onSubmit="handleUpdateArticle" :loading="saving" />

        <v-alert v-if="errorMessage" type="error" variant="tonal" class="mt-4 text-center">
          {{ errorMessage }}
        </v-alert>

        <v-alert v-if="success" type="success" variant="tonal" class="mt-4 text-center"> Article updated successfully. </v-alert>
      </template>
    </v-card>
  </v-container>
</template>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
