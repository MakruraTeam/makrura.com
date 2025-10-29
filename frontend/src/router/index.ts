import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import DrUniversity from '@/layouts/DrUniversity.vue';
import PageInDevelopment from '@/pages/DrUniversity/PageInDevelopment.vue';
import DrUniversityLeaders from '@/pages/DrUniversity/DrUniversityLeaders.vue';
import DamageValueGame from '@/pages/Games/DamageValueGame.vue';

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
        path: 'leaders',
        name: 'dr-university-leaders',
        component: DrUniversityLeaders,
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
    component: DamageValueGame,
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
