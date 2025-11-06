<script setup lang="ts">
import { ref, onMounted } from 'vue';
import RichTextEditor from '@/components/RichTextEditor/RichTextEditor.vue';
import ImageCropper from '@/components/ImageCropper/ImageCropper.vue';
import { getSocialPlatforms, getWc3Races, uploadImage, createFounder } from '@/services/drUniversity/founders/founder.service';
import { SocialPlatform, Wc3Races } from '@/services/drUniversity/founders/founder.model';

const name = ref('');
const role = ref('');
const contribution = ref('');
const image = ref<string | null>(null);
const imageFile = ref<File | null>(null);
const selectedRaces = ref<number[]>([]);
const socialLinks = ref<Record<string, string>>({});

const races = ref<Wc3Races[]>([]);
const socialPlatforms = ref<SocialPlatform[]>([]);

const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const pageLoading = ref(true);

onMounted(async () => {
  try {
    const [racesRes, socialRes] = await Promise.all([getWc3Races(), getSocialPlatforms()]);
    races.value = racesRes ?? [];
    socialPlatforms.value = socialRes ?? [];

    socialLinks.value = Object.fromEntries(socialPlatforms.value.map((p) => [p.name, '']));
  } catch (err) {
    errorMessage.value = 'Failed to load required data.';
  } finally {
    pageLoading.value = false;
  }
});

function onImageSelected(base64: string, file?: File) {
  image.value = base64;
  if (file) imageFile.value = file;
}

const handleSubmit = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  if (!name.value || !role.value || !contribution.value) {
    errorMessage.value = 'Please fill in all required fields.';
    return;
  }

  if (!imageFile.value) {
    errorMessage.value = 'Please upload a founder image.';
    return;
  }

  loading.value = true;
  try {
    const imageRes = await uploadImage(imageFile.value);
    const imageId = imageRes.imageId;

    const socialsToSend = socialPlatforms.value
      .filter((p) => socialLinks.value[p.name])
      .map((p) => ({
        id: p.id,
        link: socialLinks.value[p.name],
      }));

    await createFounder({
      name: name.value,
      role: role.value,
      contribution: contribution.value,
      imageId,
      races: selectedRaces.value,
      socialLinks: socialsToSend,
    });

    successMessage.value = 'Founder created successfully.';

    name.value = '';
    role.value = '';
    contribution.value = '';
    image.value = null;
    imageFile.value = null;
    selectedRaces.value = [];
    socialLinks.value = Object.fromEntries(socialPlatforms.value.map((p) => [p.name, '']));
  } catch (err: any) {
    errorMessage.value = err?.message || 'Failed to create founder.';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="pa-6" width="100%">
      <v-card-title class="text-h5 text-center mb-4">Add New Founder</v-card-title>

      <v-progress-circular v-if="pageLoading" indeterminate color="primary" class="d-flex mx-auto my-6" />

      <v-card-text v-else>
        <v-form @submit.prevent="handleSubmit">
          <v-text-field v-model="name" label="Founder name" prepend-inner-icon="mdi-account" outlined required />

          <v-text-field v-model="role" label="Founder role" prepend-inner-icon="mdi-briefcase" outlined required />

          <v-select
            v-model="selectedRaces"
            :items="races"
            item-title="name"
            item-value="id"
            label="Races"
            multiple
            chips
            outlined
            prepend-inner-icon="mdi-sword-cross"
          />

          <ImageCropper v-model="image" class="my-4" label="Founder Image" @change="onImageSelected" />

          <RichTextEditor v-model="contribution" label="Founder contribution" />

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

          <v-alert v-if="successMessage" type="success" variant="tonal" class="mt-2">
            {{ successMessage }}
          </v-alert>

          <v-btn :loading="loading" type="submit" color="primary" block class="mt-4"> Save Founder </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
