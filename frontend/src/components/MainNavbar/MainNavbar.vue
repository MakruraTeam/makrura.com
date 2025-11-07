<script setup lang="ts">
import SaulDrCircle from '@/assets/imgs/saul-dr-circle.png';
import MakruraLogo from '@/assets/imgs/makrura.png';
import GamesLogo from '@/assets/imgs/games.png';
import PalaRiffleLogo from '@/assets/imgs/paladin.png';
import { MainDrawerNavigationLink } from './MainNavbar.model';
import { computed, Ref, ref, watch } from 'vue';
import { useDisplay } from 'vuetify';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
authStore.hydrateFromStorage();

const { width } = useDisplay();
const isExpanded = ref(false);
const isMobile = computed(() => width.value < 1000);
const drawer = ref(!isMobile.value);
const router = useRouter();

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
    title: 'PR University',
    to: '/pru',
    customIcon: PalaRiffleLogo,
    alt: 'PR University Logo',
    location: 'top',
  },
  {
    title: 'Games',
    to: '/games',
    customIcon: GamesLogo,
    alt: 'Games Logo',
    location: 'top',
  },
  {
    title: 'CMS Dashboard',
    to: '/cms',
    icon: 'mdi-view-dashboard',
    location: 'bottom',
    hide: !authStore.isAuthenticated,
  },
  {
    title: 'Login',
    to: '/login',
    icon: 'mdi-login',
    location: 'bottom',
    hide: authStore.isAuthenticated,
  },
  {
    title: 'Logout',
    icon: 'mdi-logout',
    location: 'bottom',
    customFunction: () => logout(),
    hide: !authStore.isAuthenticated,
  },
]);

const logout = () => {
  authStore.removeToken();
  router.push('/login');
};

const topLinks = computed(() => navLinks.value.filter((link) => link.location === 'top' && !link?.hide));
const bottomLinks = computed(() => navLinks.value.filter((link) => link.location === 'bottom' && !link?.hide));
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
    :width="isMobile ? width + 1 : undefined"
    @mouseenter="!isMobile && (isExpanded = true)"
    @mouseleave="!isMobile && (isExpanded = false)"
  >
    <template #prepend>
      <div class="drawer-header" :class="{ 'drawer-header-authenticated': authStore.isAuthenticated }">
        <v-img :src="MakruraLogo" alt="Makrura Logo" width="48" height="48" class="rounded-full" />
        <span :class="{ hide: !isExpanded && !isMobile }" class="mt-2 text-base font-medium whitespace-nowrap"> makrura.com </span>
        <span v-if="authStore.isAuthenticated" :class="{ hide: !isExpanded && !isMobile }" class="text-sm text-gray-500 mt-1 whitespace-nowrap">
          Hello {{ authStore.getLogin }}!
        </span>
      </div>
    </template>

    <v-list class="mt-10">
      <v-list-item
        class="mb-3"
        v-for="link in topLinks"
        :key="link.title"
        :to="link.to"
        active-class="active-link"
        @click="isMobile && (drawer = false)"
      >
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
  height: 100px;
  overflow: hidden;
}

.drawer-header-authenticated {
  height: 120px;
}

.drawer-header span {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 100%;
}
.drawer-close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
}
</style>
