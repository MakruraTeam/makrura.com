<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import RichTextEditor from '@/components/RichTextEditor/RichTextEditor.vue';
import ImageCropper from '@/components/ImageCropper/ImageCropper.vue';
import type { Founder } from '@/services/drUniversity/founders/founder.model';
import { FounderCardProps } from '@/components/DrUniversity/FounderCard/FounderCard.model';
import { Wc3Races } from '@/services/wc3/wc3.model';
import { SocialPlatform } from '@/services/common/common.model';
import { getClassicWc3Races } from '@/services/wc3/wc3.service';
import { getSocialPlatforms, uploadImage } from '@/services/common/common.service';
import { compressImage } from '@/utils/image.util';

interface Props {
  initialData?: FounderCardProps;
  onSubmit: (payload: Founder) => Promise<void>;
  loading?: boolean;
}

const props = defineProps<Props>();

const name = ref('');
const role = ref('');
const contribution = ref('');
const embeddedImages = ref<File[]>([]);

const image = ref<string | null>(null);
const imageFile = ref<File | null>(null);
const selectedRaces = ref<number[]>([]);
const socialLinks = ref<Record<string, string>>({});

const races = ref<Wc3Races[]>([]);
const socialPlatforms = ref<SocialPlatform[]>([]);

const pageLoading = ref(true);
const errorMessage = ref('');

function fillFormFromInitialData(data: FounderCardProps) {
  name.value = data.name;
  role.value = data.role;
  contribution.value = data.contribution;
  image.value = data.image;

  const raceMap = { human: 1, orc: 2, nightelf: 3, undead: 4 };
  selectedRaces.value = Object.entries(data.race)
    .filter(([_, v]) => v)
    .map(([key]) => raceMap[key as keyof typeof raceMap]);

  socialLinks.value = {};
  for (const key of ['tiktok', 'youtube', 'liquipedia', 'soop', 'twitch', 'instagram', 'twitter', 'reddit', 'w3champions']) {
    if ((data as any)[key]) socialLinks.value[key] = (data as any)[key];
  }
}

onMounted(async () => {
  try {
    const [racesRes, socialRes] = await Promise.all([getClassicWc3Races(), getSocialPlatforms()]);
    races.value = racesRes ?? [];
    socialPlatforms.value = socialRes ?? [];

    socialLinks.value = Object.fromEntries(socialPlatforms.value.map((p) => [p.name, '']));

    if (props.initialData) {
      fillFormFromInitialData(props.initialData);
    }
  } catch (err) {
    errorMessage.value = 'Failed to load required data.';
  } finally {
    pageLoading.value = false;
  }
});

watch(
  () => props.initialData,
  (val) => {
    if (val) fillFormFromInitialData(val);
  }
);

function onImageSelected(base64: string, file?: File) {
  image.value = base64;
  if (file) imageFile.value = file;
}

async function handleSubmit() {
  errorMessage.value = '';

  if (!name.value || !role.value || !contribution.value) {
    errorMessage.value = 'Please fill in all required fields.';
    return;
  }

  let processedContribution = contribution.value;

  const base64Matches = [...processedContribution.matchAll(/<img[^>]+src=["'](data:[^"']+)["'][^>]*>/gi)];

  for (const match of base64Matches) {
    const fullTag = match[0];
    const base64Data = match[1];

    const response = await fetch(base64Data);
    const blob = await response.blob();
    const file = new File([blob], `embedded-${Date.now()}.png`, { type: blob.type });

    const compressed = await compressImage(file, 1000, 0.8);
    const uploadRes = await uploadImage(compressed);
    const newUrl = `/api/common/images/${uploadRes.imageId}`;

    const updatedTag = fullTag.replace(base64Data, newUrl);
    processedContribution = processedContribution.replace(fullTag, updatedTag);
  }

  const payload: Founder = {
    name: name.value,
    role: role.value,
    contribution: processedContribution,
    races: selectedRaces.value,
    socialLinks: socialPlatforms.value
      .filter((p) => socialLinks.value[p.name])
      .map((p) => ({
        id: p.id,
        link: socialLinks.value[p.name],
      })),
  };

  if (imageFile.value) {
    const compressed = await compressImage(imageFile.value, 1000, 0.8);
    const imgRes = await uploadImage(compressed);
    payload.imageId = imgRes.imageId;
  }

  try {
    await props.onSubmit(payload);
  } catch (err: any) {
    console.error(err);
    errorMessage.value = err?.message || 'Failed to save founder.';
  }
}
</script>

<template>
  <v-progress-circular v-if="pageLoading" indeterminate color="primary" class="d-flex mx-auto my-6" />

  <v-form v-else @submit.prevent="handleSubmit">
    <v-text-field v-model="name" label="Name" outlined required />
    <v-text-field v-model="role" label="Role" outlined required />

    <v-select v-model="selectedRaces" :items="races" item-title="name" item-value="id" label="Races" multiple chips outlined />

    <ImageCropper v-model="image" class="my-4" label="Founder Image" @change="onImageSelected" :aspectRatio="1" />

    <RichTextEditor v-model="contribution" v-model:embeddedImages="embeddedImages" label="Contribution" />

    <div class="text-h6 mb-2">Social Links</div>
    <v-row>
      <v-col v-for="platform in socialPlatforms" :key="platform.id" cols="12" sm="6" md="4">
        <v-text-field
          v-model="socialLinks[platform.name]"
          :label="`${platform.name.charAt(0).toUpperCase() + platform.name.slice(1)} link`"
          outlined
          clearable
        />
      </v-col>
    </v-row>

    <v-alert v-if="errorMessage" type="error" variant="tonal" class="mt-2">
      {{ errorMessage }}
    </v-alert>

    <v-btn :loading="props.loading" type="submit" color="primary" block class="mt-4"> Save Founder </v-btn>
  </v-form>
</template>
