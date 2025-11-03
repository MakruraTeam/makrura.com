<script setup lang="ts">
import { ref } from 'vue';
import RichTextEditor from '@/components/RichTextEditor/RichTextEditor.vue';
import ImageCropper from '@/components/ImageCropper/ImageCropper.vue';

const name = ref('');
const role = ref('');
const content = ref('');

const image = ref<string | null>(null);

const submit = () => {
  console.log('Post Title:', name.value);
  console.log('Post Content:', content.value);
  console.log('Cropped Image:', image.value);
};
</script>

<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="pa-2" width="100%">
      <v-card-title class="text-h5 text-center mb-4">Add New Founder</v-card-title>
      <!-- <v-text-field v-model="login" label="Login" prepend-inner-icon="mdi-account" outlined required /> -->

      <v-text-field v-model="name" label="Founder name" prepend-inner-icon="mdi-account" outlined required />
      <v-text-field v-model="role" label="Founder role" prepend-inner-icon="mdi-briefcase" outlined required />

      <ImageCropper v-model="image" />
      <RichTextEditor v-model="content" label="Founder contribution" />

      <v-btn color="primary" class="mt-4" @click="submit">Save Founder</v-btn>
    </v-card>
  </v-container>
</template>
