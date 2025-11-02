import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import DrUniversity from '@/layouts/DrUniversity.vue';
import PageInDevelopment from '@/pages/DrUniversity/PageInDevelopment.vue';
import DrUniversityFounders from '@/pages/DrUniversity/DrUniversityFounders.vue';
import AttackArmorValueGame from '@/pages/Games/AttackArmorValueGame/AttackArmorValueGame.vue';
import GamesLayout from '@/layouts/GamesLayout.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/dru',
  },
  {
    path: '/dru',
    name: 'dr-university',
    component: DrUniversity,
    children: [
      {
        path: '',
        name: 'dr-university-home',
        component: PageInDevelopment,
      },
      {
        path: 'table',
        name: 'dr-university-table',
        component: PageInDevelopment,
      },
      {
        path: 'founders',
        name: 'dr-university-founders',
        component: DrUniversityFounders,
      },
      {
        path: 'players',
        name: 'dr-university-players',
        component: PageInDevelopment,
      },
      {
        path: ':pathMatch(.*)*',
        redirect: '/dru',
      },
    ],
  },
  {
    path: '/games',
    name: 'games',
    component: GamesLayout,
    children: [
      {
        path: '',
        redirect: '/games/attack-armor-value',
      },
      {
        path: 'attack-armor-value',
        name: 'attack-armor-value-game',
        component: AttackArmorValueGame,
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: PageInDevelopment,
  },

  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: PageInDevelopment,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
