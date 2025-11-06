import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';

import '@fontsource/roboto';
import '@mdi/font/css/materialdesignicons.css';
import 'quill/dist/quill.snow.css';
import 'vue-advanced-cropper/dist/style.css';

import { createPinia } from 'pinia';
import { useAuthStore } from './stores/auth';

const app = createApp(App);
const pinia = createPinia();

const auth = useAuthStore(pinia);
auth.hydrateFromStorage();

app.use(pinia);
app.use(router);
app.use(vuetify);

app.mount('#app');
