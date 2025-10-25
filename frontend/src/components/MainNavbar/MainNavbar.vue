<script setup lang="ts">
import SaulDrCircle from '@/assets/saul-dr-circle.png';
import MakruraLogo from '@/assets/makrura.png';
import { MainDrawerNavigationLink } from './MainNavbar.model';
import { computed, Ref, ref, watch } from 'vue';
import { useThemeSwitcher } from '@/composables/useThemeSwitcher';
import { useDisplay } from 'vuetify';

const { isDark, toggleTheme } = useThemeSwitcher();
const { width } = useDisplay();

const isExpanded = ref(false);

const isMobile = computed(() => width.value < 1000);

const drawer = ref(!isMobile.value);

watch(isMobile, (mobile) => {
  drawer.value = !mobile;
});

const navLinks: Ref<MainDrawerNavigationLink[]> = computed(() => [
  {
    title: 'DR University',
    to: '/dru',
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

const topLinks = computed(() => navLinks.value.filter((link) => link.location === 'top'));
const bottomLinks = computed(() => navLinks.value.filter((link) => link.location === 'bottom'));
</script>

<template>
  <v-btn v-if="isMobile" icon="mdi-menu" class="ma-2" @click="drawer = !drawer" />

  <v-navigation-drawer
    v-model="drawer"
    location="left"
    :permanent="!isMobile"
    :temporary="isMobile"
    :expand-on-hover="!isMobile"
    :rail="!isMobile"
    :rail-width="72"
    :width="isMobile ? width : undefined"
    @mouseenter="!isMobile && (isExpanded = true)"
    @mouseleave="!isMobile && (isExpanded = false)"
  >
    <template #prepend>
      <div class="drawer-header">
        <v-img :src="MakruraLogo" alt="Makrura Logo" width="48" height="48" class="rounded-full" />
        <span :class="{ hide: !isExpanded && !isMobile }" class="ml-3 mt-2 text-base font-medium whitespace-nowrap"> makrura.com </span>
      </div>

      <v-btn v-if="isMobile" icon="mdi-close" class="drawer-close-button" variant="text" @click="drawer = false" />
    </template>

    <v-list class="mt-10">
      <v-list-item v-for="link in topLinks" :key="link.title" :to="link.to" active-class="active-link" @click="isMobile && (drawer = false)">
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
          @click="
            () => {
              link.customFunction?.();
              if (isMobile) drawer = false;
            }
          "
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

:deep(.active-link) .v-list-item-title {
  font-weight: bold !important;
}

.hide {
  visibility: hidden;
}

.drawer-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 16px;
  position: relative;
}

.drawer-close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
}
</style>
