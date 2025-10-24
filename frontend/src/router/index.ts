import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import DrUniversity from '@/layouts/DrUniversity.vue';
import DrUniversityHome from '@/pages/DrUniversity/DrUniversityHome.vue';
import PageInDevelopment from '@/pages/DrUniversity/PageInDevelopment.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/dr-university',
  },
  {
    path: '/dr-university',
    name: 'dr-university',
    component: DrUniversity,
    children: [
      {
        path: '',
        name: 'dr-university-home',
        component: PageInDevelopment,
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: PageInDevelopment,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
