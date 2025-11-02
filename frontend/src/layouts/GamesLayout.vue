<script setup lang="ts">
import GamesNavbar from '@/components/Games/GamesNavbar/GamesNavbar.vue';
</script>
<template>
  <v-app>
    <GamesNavbar />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
