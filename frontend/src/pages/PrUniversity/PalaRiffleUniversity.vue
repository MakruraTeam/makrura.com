<script setup lang="ts">
import rifflemanImage from '@/assets/imgs/riffleman.jpg';
</script>

<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <img :src="rifflemanImage" class="riffleman-image" alt="Riffleman Logo" />
  </v-container>
</template>

<style scoped>
.riffleman-image {
  max-width: 90vw;
  max-height: 90vh;
  width: 700px;
  height: 700px;
  object-fit: contain;
  display: block;
}
</style>
