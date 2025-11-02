<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import DarkRangerBanner from '@/assets/imgs/dark-ranger-banner.webp';
import DarkRanger from '@/assets/imgs/dark-ranger.webp';
import { NavLink } from './TopNavbar.model';

const isMobile = ref(false);

function checkWidth() {
  isMobile.value = window.innerWidth < 1000;
}

onMounted(() => {
  checkWidth();
  window.addEventListener('resize', checkWidth);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkWidth);
});

const navLinks = computed<NavLink[]>(() => [
  { label: 'Home', name: 'dr-university-home' },
  { label: 'Table', name: 'dr-university-table' },
  { label: 'Founders', name: 'dr-university-founders' },
  { label: 'Players', name: 'dr-university-players' },
]);
</script>

<template>
  <div class="banner-container">
    <img :src="isMobile ? DarkRanger : DarkRangerBanner" alt="Banner" class="banner-img" />

    <nav class="nav-container">
      <RouterLink v-for="link in navLinks" :key="link.name" :to="{ name: link.name }" class="nav-link">
        {{ link.label }}
      </RouterLink>
    </nav>
  </div>
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

.nav-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 2rem;
  background: rgba(0, 0, 0, 0.55);
  padding: 0.4rem 0;
}

.nav-link {
  text-decoration: none;
  color: white;
  font-size: 1.25rem;
  font-weight: 400;
}

.nav-link.router-link-exact-active {
  font-weight: 700;
}

@media screen and (max-width: 999px) {
  .nav-container {
    position: static;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 1rem 0;
  }
}
</style>
