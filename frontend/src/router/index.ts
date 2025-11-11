import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import DrUniversity from '@/layouts/DrUniversity.vue';
import PageInDevelopment from '@/pages/DrUniversity/PageInDevelopment.vue';
import DrUniversityFounders from '@/pages/DrUniversity/DrUniversityFounders.vue';
import AttackArmorValueGame from '@/pages/Games/AttackArmorValueGame/AttackArmorValueGame.vue';
import GamesLayout from '@/layouts/GamesLayout.vue';
import CmsLogin from '@/pages/Cms/CmsLogin.vue';
import CmsDashboard from '@/pages/Cms/CmsDashboard.vue';
import { useAuthStore } from '@/stores/auth';
import AddUser from '@/pages/Cms/Users/AddUser.vue';
import AddFounder from '@/pages/Cms/DrUniversity/AddFounder.vue';
import ManageFounders from '@/pages/Cms/DrUniversity/ManageFounders.vue';
import PalaRiffleUniversity from '@/pages/PrUniversity/PalaRiffleUniversity.vue';
import EditFounder from '@/pages/Cms/DrUniversity/EditFounder.vue';
import DrUniversityHome from '@/pages/DrUniversity/DrUniversityHome.vue';
import ArticlePage from '@/pages/News/ArticlePage.vue';
import AddArticle from '@/pages/Cms/News/AddArticle.vue';
import NewsPage from '@/pages/News/NewsPage.vue';
import ManageArticle from '@/pages/Cms/News/ManageArticle.vue';
import EditArticle from '@/pages/Cms/News/EditArticle.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/dru',
  },
  {
    path: '/article/:slug',
    name: 'news-article',
    component: ArticlePage,
  },
  {
    path: '/news',
    name: 'news',
    component: NewsPage,
  },
  {
    path: '/dru',
    name: 'dr-university',
    component: DrUniversity,
    children: [
      {
        path: '',
        name: 'dr-university-home',
        component: DrUniversityHome,
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
    path: '/pru',
    name: 'pala-riffle-university',
    component: PalaRiffleUniversity,
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
    component: CmsLogin,
  },
  {
    path: '/cms',
    name: 'cms',
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'cms-dashboard',
        component: CmsDashboard,
      },
      {
        path: 'add-user',
        name: 'cms-add-user',
        component: AddUser,
      },
      {
        path: 'manage-users',
        name: 'cms-manage-users',
        component: PageInDevelopment,
      },
      {
        path: 'add-article',
        name: 'cms-add-article',
        component: AddArticle,
      },
      {
        path: 'manage-articles',
        name: 'cms-manage-articles',
        component: ManageArticle,
      },
      {
        path: 'edit-article/:id',
        name: 'cms-edit-article',
        component: EditArticle,
      },
      {
        path: 'add-founders',
        name: 'cms-add-founders',
        component: AddFounder,
      },
      {
        path: 'manage-founders',
        name: 'cms-manage-founders',
        component: ManageFounders,
      },
      {
        path: 'edit-founder/:id',
        name: 'cms-edit-founder',
        component: EditFounder,
      },
    ],
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

router.beforeEach((to) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } };
  }

  if (to.name === 'login' && auth.isAuthenticated) {
    return { name: 'cms' };
  }
});

export default router;
