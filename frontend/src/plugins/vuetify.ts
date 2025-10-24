import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi';

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1976d2',
          secondary: '#64b5f6',
          error: '#e57373',
          warning: '#ffa000',
          info: '#1a237e',
          success: '#388e3c',
          surface: '#eeeeee',
          overlay: '#fafafa',
        },
      },
      dark: {
        colors: {
          primary: '#0c3690',
          secondary: '#0865c1',
          error: '#e57373',
          warning: '#ffa000',
          info: '#0d47a1',
          success: '#388e3c',
          surface: '#202020',
          overlay: '#404040',
        },
      },
    },
  },
  icons: {
    defaultSet: 'mdi',
    aliases: {
      ...aliases,
      sortAsc: 'mdi-chevron-up',
      sortDesc: 'mdi-chevron-down',
    },
    sets: {
      mdi,
    },
  },
});

export default vuetify;
