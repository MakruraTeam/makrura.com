<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ImageCropper from '@/components/ImageCropper/ImageCropper.vue';
import RichTextEditor from '@/components/RichTextEditor/RichTextEditor.vue';
import { getSocialPlatforms } from '@/services/common/common.service';
import { getArticleTypes } from '@/services/news/article.service';
import type { SocialPlatform } from '@/services/common/common.model';
import type { ArticleTypes } from '@/services/news/article.model';

interface Props {
  onSubmit: (payload: any) => Promise<void>;
  loading?: boolean;
}

const props = defineProps<Props>();

const title = ref('');
const slug = ref('');
const shortDescription = ref('');
const content = ref('');
const image = ref<string | null>(null);
const imageFile = ref<File | null>(null);
const selectedType = ref<number | null>(null);

const pageLoading = ref(true);
const errorMessage = ref('');
const socialPlatforms = ref<SocialPlatform[]>([]);
const articleTypes = ref<ArticleTypes[]>([]);

const links = ref<{ platformId: number | null; url: string; text: string }[]>([]);

onMounted(async () => {
  try {
    const [platformRes, typesRes] = await Promise.all([getSocialPlatforms(), getArticleTypes()]);
    socialPlatforms.value = platformRes ?? [];
    articleTypes.value = typesRes ?? [];
  } catch (err) {
    console.error(err);
    errorMessage.value = 'Failed to load data.';
  } finally {
    pageLoading.value = false;
  }
});

function addSocialLink() {
  links.value.push({ platformId: null, url: '', text: '' });
}

function removeSocialLink(index: number) {
  links.value.splice(index, 1);
}

function onImageSelected(base64: string, file?: File) {
  image.value = base64;
  if (file) imageFile.value = file;
}

async function handleSubmit() {
  errorMessage.value = '';

  if (!title.value || !slug.value || !shortDescription.value || !content.value || !selectedType.value) {
    errorMessage.value = 'Please fill in all required fields.';
    return;
  }

  const payload = {
    title: title.value,
    slug: slug.value,
    shortDescription: shortDescription.value,
    content: content.value,
    imageFile: imageFile.value,
    typeId: selectedType.value,
    links: links.value
      .filter((l) => l.platformId && l.url)
      .map((l) => ({
        id: l.platformId!,
        url: l.url,
        text: l.text,
      })),
  };

  console.log('Submitting article form payload:', payload);
  await props.onSubmit(payload);
}
</script>

<template>
  <v-progress-circular v-if="pageLoading" indeterminate color="primary" class="d-flex mx-auto my-6" />

  <v-form v-else @submit.prevent="handleSubmit">
    <v-text-field v-model="title" label="Title" outlined required />
    <v-text-field v-model="slug" label="Slug" outlined required />
    <v-textarea v-model="shortDescription" label="Short Description" outlined required />

    <v-select v-model="selectedType" :items="articleTypes" item-title="name" item-value="id" label="Article Type" outlined required />

    <ImageCropper v-model="image" label="Article Image" class="my-4" @change="onImageSelected" />

    <RichTextEditor v-model="content" label="Content" />

    <div class="mb-8">
      <div class="text-subtitle-1 font-weight-medium mt-5 mb-4 text-center">Social Links</div>

      <div class="d-flex justify-center mb-6">
        <v-btn color="secondary" variant="elevated" @click="addSocialLink"> <v-icon start>mdi-plus</v-icon> Add Social Link </v-btn>
      </div>

      <v-row v-if="links.length" class="mt-1" dense>
        <v-col v-for="(link, index) in links" :key="index" cols="12" class="py-2">
          <v-card class="pa-4 d-flex align-center flex-wrap gap-4" elevation="1" rounded="lg">
            <v-select
              v-model="link.platformId"
              :items="socialPlatforms"
              item-title="name"
              item-value="id"
              label="Platform"
              outlined
              hide-details
              class="social-input"
            />
            <v-text-field v-model="link.url" label="URL" outlined hide-details class="social-input" />
            <v-text-field v-model="link.text" label="Description" outlined hide-details class="social-input" />
            <v-btn icon color="error" variant="tonal" class="delete-btn" @click="removeSocialLink(index)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <v-alert v-if="errorMessage" type="error" variant="tonal" class="mt-2">
      {{ errorMessage }}
    </v-alert>

    <v-btn :loading="props.loading" type="submit" color="primary" block class="mt-4"> Save Article </v-btn>
  </v-form>
</template>
<style scoped>
.social-input {
  min-width: 240px;
  flex: 1 1 240px;
}

:deep(.v-field) {
  margin-right: 12px;
}

:deep(.v-input__control) {
  min-width: 0;
}

.delete-btn {
  align-self: center;
}
</style>
