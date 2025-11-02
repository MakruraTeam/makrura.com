<script setup lang="ts">
import { computed } from 'vue';

interface NavLink {
  label: string;
  name: string;
}

const navLinks = computed<NavLink[]>(() => [{ label: 'Attack Armor Value Game', name: 'attack-armor-value-game' }]);
</script>

<template>
  <nav class="nav-container">
    <RouterLink v-for="link in navLinks" :key="link.name" :to="{ name: link.name }" class="nav-link">
      {{ link.label }}
    </RouterLink>
  </nav>
</template>

<style scoped>
.nav-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  padding: 1rem 0;
  background-color: #111;
}

.nav-link {
  text-decoration: none;
  color: white;
  font-size: 1.25rem;
  font-weight: 400;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: #ddd;
}

.nav-link.router-link-exact-active {
  font-weight: 700;
}
</style>
