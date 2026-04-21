<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import ImageCropper from '@/components/ImageCropper/ImageCropper.vue';
import { uploadImage } from '@/services/common/common.service';
import { getWc3Maps } from '@/services/wc3/wc3.service';
import type { Wc3Map } from '@/services/wc3/wc3.model';
import type { CreateGeoGuesserRequest } from '@/services/geoGuesser/geoGuesser.model';
import { compressImage } from '@/utils/image.util';

interface Props {
  initialData?: {
    id: number;
    mapId: number;
    images: {
      small: string;
      medium: string;
      large: string;
    };
  };
  onSubmit: (payload: CreateGeoGuesserRequest) => Promise<void>;
  loading?: boolean;
}

const props = defineProps<Props>();

const maps = ref<Wc3Map[]>([]);
const selectedMap = ref<number | null>(null);

const smallImage = ref<string | null>(null);
const mediumImage = ref<string | null>(null);
const largeImage = ref<string | null>(null);

const smallFile = ref<File | null>(null);
const mediumFile = ref<File | null>(null);
const largeFile = ref<File | null>(null);

const pageLoading = ref(true);
const errorMessage = ref('');

onMounted(async () => {
  try {
    maps.value = await getWc3Maps();
    if (props.initialData) fillFromInitial(props.initialData);
  } catch (err) {
    console.error(err);
    errorMessage.value = 'Failed to load maps.';
  } finally {
    pageLoading.value = false;
  }
});

watch(
  () => props.initialData,
  (val) => val && fillFromInitial(val)
);

function fillFromInitial(data: any) {
  selectedMap.value = data.mapId;
  smallImage.value = data.images.small;
  mediumImage.value = data.images.medium;
  largeImage.value = data.images.large;
}

function onSmallSelected(base64: string, file?: File) {
  smallImage.value = base64;
  if (file) smallFile.value = file;
}

function onMediumSelected(base64: string, file?: File) {
  mediumImage.value = base64;
  if (file) mediumFile.value = file;
}

function onLargeSelected(base64: string, file?: File) {
  largeImage.value = base64;
  if (file) largeFile.value = file;
}

async function handleSubmit() {
  errorMessage.value = '';

  if (!selectedMap.value) {
    errorMessage.value = 'Please select a map.';
    return;
  }

  async function uploadIfNeeded(file: File | null): Promise<number | undefined> {
    if (!file) return undefined;
    const compressed = await compressImage(file, 1000, 0.8);
    const res = await uploadImage(compressed);
    return res.imageId;
  }

  const smallImageId = await uploadIfNeeded(smallFile.value);
  const mediumImageId = await uploadIfNeeded(mediumFile.value);
  const largeImageId = await uploadIfNeeded(largeFile.value);

  const payload: CreateGeoGuesserRequest = {
    mapId: selectedMap.value,
    smallImageId,
    mediumImageId,
    largeImageId,
  };

  try {
    await props.onSubmit(payload);
  } catch (err: any) {
    console.error(err);
    errorMessage.value = err?.message || 'Failed to save GeoGuesser.';
  }
}
</script>

<template>
  <v-progress-circular v-if="pageLoading" indeterminate class="mx-auto my-6" />

  <v-form v-else @submit.prevent="handleSubmit">
    <v-select v-model="selectedMap" :items="maps" item-title="name" item-value="id" label="Warcraft 3 Map" outlined required />

    <ImageCropper label="Small Image" v-model="smallImage" @change="onSmallSelected" :aspectRatio="5 / 3" />
    <ImageCropper label="Medium Image" v-model="mediumImage" @change="onMediumSelected" :aspectRatio="5 / 3" />
    <ImageCropper label="Large Image" v-model="largeImage" @change="onLargeSelected" :aspectRatio="5 / 3" />

    <v-alert v-if="errorMessage" type="error" variant="tonal" class="mt-4">
      {{ errorMessage }}
    </v-alert>

    <v-btn type="submit" color="primary" block class="mt-4" :loading="loading"> Save GeoGuesser </v-btn>
  </v-form>
</template>
