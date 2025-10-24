<script setup lang="ts">
import SaulDrCircle from '@/assets/saul-dr-circle.png';
import MakruraLogo from '@/assets/makrura.png';
import { MainDrawerNavigationLink } from './MainNavbar.model';
import { computed, Ref, ref } from 'vue';
import { useThemeSwitcher } from '@/composables/useThemeSwitcher';

const { isDark, toggleTheme } = useThemeSwitcher();

const isExpanded = ref(false);

const navLinks: Ref<MainDrawerNavigationLink[]> = computed(() => [
  {
    title: 'DR University',
    to: '/dr-university',
    customIcon: SaulDrCircle,
    alt: 'DR University Logo',
    location: 'top',
  },
  {
    title: `${isDark.value ? 'Light' : 'Dark'} Theme`,
    icon: 'mdi-theme-light-dark',
    location: 'bottom',
    customFunction: toggleTheme,
  },
  {
    title: 'Login',
    to: '/login',
    icon: 'mdi-login',
    location: 'bottom',
  },
]);

const topLinks = computed(() => navLinks.value.filter((link: MainDrawerNavigationLink) => link.location === 'top'));
const bottomLinks = computed(() => navLinks.value.filter((link: MainDrawerNavigationLink) => link.location === 'bottom'));
</script>

<template>
  <v-navigation-drawer
    location="left"
    permanent
    expand-on-hover
    rail
    :rail-width="72"
    @mouseenter="isExpanded = true"
    @mouseleave="isExpanded = false"
  >
    <template #prepend>
      <div class="d-flex flex-column align-center justify-center px-3 py-2 mt-2">
        <v-img :src="MakruraLogo" alt="Makrura Logo" width="48" height="48" class="rounded-full" />
        <span :class="{ hide: !isExpanded }" class="ml-3 mt-2 text-base font-medium whitespace-nowrap"> makrura.com </span>
      </div>
    </template>

    <v-list class="mt-10">
      <v-list-item v-for="link in topLinks" :key="link.title" :to="link.to" active-class="active-link">
        <template #prepend>
          <v-img v-if="link.customIcon" :src="link.customIcon" :alt="link.alt" width="40" height="40" />
          <v-icon v-else :size="40">{{ link.icon }}</v-icon>
        </template>
        <v-list-item-title class="image-link-text">{{ link.title }}</v-list-item-title>
      </v-list-item>
    </v-list>

    <template #append>
      <v-list>
        <v-list-item
          v-for="link in bottomLinks"
          :key="link.title"
          :to="link.to"
          @click="link.customFunction ? link.customFunction() : null"
          :class="{ 'cursor-pointer': !!link.customFunction }"
          active-class="active-link"
        >
          <template #prepend>
            <v-img v-if="link.customIcon" :src="link.customIcon" :alt="link.alt" width="40" height="40" />
            <v-icon v-else :size="40">{{ link.icon }}</v-icon>
          </template>
          <v-list-item-title>{{ link.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<style scoped>
.image-link-text {
  padding-left: 32px;
}

.cursor-pointer {
  cursor: pointer;
}

:deep(.active-link) {
  .v-list-item-title {
    font-weight: bold !important;
  }
}

.hide {
  visibility: hidden;
}
</style>
