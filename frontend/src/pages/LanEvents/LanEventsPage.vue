<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const events = [
  {
    slug: 'basestack-polish-2026',
    name: 'BaseStack Polish 2026',
    description: 'Polski turniej LAN Warcraft 3',
    image: '/events/basestack-polish-2026.png',
  },
];
</script>

<template>
  <v-container class="py-8">
    <h1 class="text-h4 font-weight-bold mb-6">LAN Events</h1>
    <v-row>
      <v-col v-for="event in events" :key="event.slug" cols="12" sm="6" md="4">
        <v-card
          class="event-card"
          rounded="lg"
          @click="router.push(`/lan-events/${event.slug}`)"
        >
          <v-img :src="event.image" height="200" cover class="event-thumbnail" />
          <v-card-title class="text-h6 pt-3">{{ event.name }}</v-card-title>
          <v-card-subtitle>{{ event.description }}</v-card-subtitle>
          <v-card-actions>
            <v-btn variant="text" color="primary" append-icon="mdi-arrow-right">
              Zobacz event
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.event-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.event-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4) !important;
}
</style>
