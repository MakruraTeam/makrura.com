<script setup lang="ts">
import SaulDr from '@/assets/saul-dr.png';
</script>

<template>
  <v-container class="hide fill-height d-flex flex-column align-center justify-center text-center">
    <h1 class="text-h4 my-4">DR University</h1>
    <p class="text-subtitle-1 mb-6">This page is currently under development. Please check back later!</p>

    <v-img :src="SaulDr" alt="Saul Goodman DR University" width="500" aspect-ratio="1" contain />
  </v-container>
</template>
<style scoped>
.hide {
  overflow: hidden;
}
</style>
