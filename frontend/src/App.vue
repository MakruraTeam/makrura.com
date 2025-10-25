<script setup lang="ts">
import Navbar from './components/MainNavbar/MainNavbar.vue';
</script>
<template>
  <v-app>
    <Navbar />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
