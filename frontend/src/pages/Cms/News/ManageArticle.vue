<script setup lang="ts">
import { ArticleListItem } from '@/services/news/article.model';
import { deleteArticle, getAllArticles } from '@/services/news/article.service';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const articles = ref<ArticleListItem[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const router = useRouter();

const dialog = ref(false);
const selectedArticle = ref<ArticleListItem | null>(null);

async function loadArticles() {
  loading.value = true;
  error.value = null;

  try {
    articles.value = await getAllArticles();
  } catch (err: any) {
    console.error(err);
    error.value = err?.message || 'Failed to load articles.';
  } finally {
    loading.value = false;
  }
}

function openDeleteDialog(article: ArticleListItem) {
  selectedArticle.value = article;
  dialog.value = true;
}

async function confirmDelete() {
  if (!selectedArticle.value) return;

  try {
    await deleteArticle(selectedArticle.value.id);
    dialog.value = false;
    selectedArticle.value = null;
    await loadArticles();
  } catch (err: any) {
    console.error(err);
    error.value = err?.message || 'Failed to delete article.';
    dialog.value = false;
  }
}

function cancelDelete() {
  selectedArticle.value = null;
  dialog.value = false;
}

function openEditPage(id: number) {
  router.push({ name: 'cms-edit-article', params: { id } });
}

onMounted(loadArticles);
</script>

<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card max-width="600" class="w-100 pa-7">
      <v-card-title class="text-h5 text-center mb-4">Manage Articles</v-card-title>

      <v-progress-circular v-if="loading" indeterminate color="primary" class="d-flex mx-auto my-6" />

      <div v-else-if="error" class="text-error text-center my-4">
        {{ error }}
      </div>

      <v-list v-else>
        <v-list-item v-for="article in articles" :key="article.id" class="hover:bg-grey-lighten-4 rounded-lg my-1">
          <v-list-item-title>
            {{ article.title }}
          </v-list-item-title>

          <template #append>
            <v-btn icon variant="text" color="primary" @click="openEditPage(article.id)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon variant="text" color="error" @click="openDeleteDialog(article)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-list-item>
      </v-list>
    </v-card>

    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-text>
          Are you sure you want to permanently delete
          <strong>{{ selectedArticle?.title }}</strong
          >?
        </v-card-text>

        <v-card-actions class="justify-end">
          <v-btn text color="grey" @click="cancelDelete">Cancel</v-btn>
          <v-btn color="error" @click="confirmDelete">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
