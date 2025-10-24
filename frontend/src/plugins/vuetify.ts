import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi';

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark',
    themes: {
      light: {
        colors: {
          primary: '#5F6FB7',
          secondary: '#8B4C70',
          accent: '#90D8C2',
          error: '#E57373',
          warning: '#E0A959',
          info: '#5A6FB5',
          success: '#4BAA7F',
          surface: '#D6D6D9',
          background: '#d1d1d1ff',
          overlay: '#bdbdc2ff',
        },
      },
      dark: {
        colors: {
          primary: '#7A67E0',
          secondary: '#872B45',
          accent: '#5CE3B2',
          error: '#E57373',
          warning: '#FFA000',
          info: '#3F51B5',
          success: '#4CAF50',
          surface: '#1C1C22',
          background: '#121217',
          overlay: '#2A2A32',
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
    sets: { mdi },
  },
});

export default vuetify;
