<script setup lang="ts">
import DarkRangerBanner from '@/assets/dark-ranger-banner.webp'
</script>

<template>
  <v-app>

    <div class="banner-container">
      <img :src="DarkRangerBanner" alt="Banner" class="banner-img" />

      <div class="banner-title">
        DARK RANGER UNIVERSITY
      </div>

      <nav class="nav-links">
        <RouterLink to="/dru" class="nav-link">Home</RouterLink>
        <RouterLink to="/dru/table" class="nav-link">Table</RouterLink>
        <RouterLink to="/dru/leaders" class="nav-link">Leaders</RouterLink>
        <RouterLink to="/dru/players" class="nav-link">Players</RouterLink>
      </nav>
    </div>

    <v-main>
      <router-view />
    </v-main>

  </v-app>
</template>

<style scoped>
.banner-container {
  position: relative;
  width: 100%;
}

.banner-img {
  width: 100%;
  height: auto;
  display: block;
}

.banner-title {
  position: absolute;
  top: 0.75rem;
  right: 1.5rem;
  font-size: 2rem;
  font-weight: 700;
  color: white;
  letter-spacing: 1px;
  text-transform: uppercase;
  text-shadow: 0 2px 6px rgba(0,0,0,0.6);
  pointer-events: none;
}

.nav-links {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 2rem;
  background: rgba(0, 0, 0, 0.55);
}

.nav-link {
  text-decoration: none;
  color: white;
  font-size: 1.25rem;
  font-weight: 400;
  padding: 0.4rem 0;
}

.nav-link.router-link-active,
.nav-link.router-link-exact-active {
  font-weight: 700;
}
</style>
