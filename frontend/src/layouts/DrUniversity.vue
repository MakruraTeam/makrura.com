<script setup lang="ts">
import TopNavbar from '@/components/DrUniversity/TopNavbar/TopNavbar.vue';
</script>

<template>
  <v-app>
    <TopNavbar />

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
