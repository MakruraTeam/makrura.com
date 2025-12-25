<script setup lang="ts">
const Links = [
  { title: 'Add User', to: '/cms/add-user', location: 'user' },
  { title: 'Manage Users', to: '/cms/manage-users', location: 'user' },

  { title: 'Add Article', to: '/cms/add-article', location: 'news' },
  { title: 'Manage Articles', to: '/cms/manage-articles', location: 'news' },

  { title: 'Add Founders', to: '/cms/add-founders', location: 'dr-university' },
  { title: 'Manage Founders', to: '/cms/manage-founders', location: 'dr-university' },
  { title: 'Add Matchup Table', to: '/cms/add-matchup-table', location: 'dr-university' },
  { title: 'Manage Matchup Tables', to: '/cms/manage-matchup-tables', location: 'dr-university' },

  { title: 'Add GeoGuesser', to: '/cms/add-geoguesser', location: 'geoguesser' },
  { title: 'Manage GeoGuessers', to: '/cms/manage-geogussers', location: 'geoguesser' },
];

const userLinks = Links.filter((link) => link.location === 'user');
const newsLinks = Links.filter((link) => link.location === 'news');
const drUniversityLinks = Links.filter((link) => link.location === 'dr-university');
const geoGuesserLinks = Links.filter((link) => link.location === 'geoguesser');
</script>

<template>
  <v-main class="pa-8">
    <v-container>
      <h1 class="text-center text-h4 font-weight-bold mb-10">CMS Dashboard</h1>

      <v-row class="mb-8" justify="center">
        <v-col cols="12" md="10" lg="8">
          <v-card elevation="4" class="pa-6">
            <h2 class="text-center text-h5 font-weight-medium mb-6">Users</h2>

            <v-row>
              <v-col v-for="link in userLinks" :key="link.title" cols="12" sm="6" class="d-flex justify-center">
                <v-btn :to="link.to" color="primary" variant="elevated" class="w-100 text-none d-flex align-center justify-center" height="56">
                  {{ link.title }}
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mb-8" justify="center">
        <v-col cols="12" md="10" lg="8">
          <v-card elevation="4" class="pa-6">
            <h2 class="text-center text-h5 font-weight-medium mb-6">News</h2>

            <v-row>
              <v-col v-for="link in newsLinks" :key="link.title" cols="12" sm="6" class="d-flex justify-center">
                <v-btn :to="link.to" color="#666" variant="elevated" class="w-100 text-none d-flex align-center justify-center" height="56">
                  {{ link.title }}
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mb-8" justify="center">
        <v-col cols="12" md="10" lg="8">
          <v-card elevation="4" class="pa-6">
            <h2 class="text-center text-h5 font-weight-medium mb-6">Dark Ranger University</h2>

            <v-row>
              <v-col v-for="link in drUniversityLinks" :key="link.title" cols="12" sm="6" class="d-flex justify-center">
                <v-btn :to="link.to" color="secondary" variant="elevated" class="w-100 text-none d-flex align-center justify-center" height="56">
                  {{ link.title }}
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <v-card elevation="4" class="pa-6">
            <h2 class="text-center text-h5 font-weight-medium mb-6">GeoGuesser</h2>
            <v-row>
              <v-col v-for="link in geoGuesserLinks" :key="link.title" cols="12" sm="6" class="d-flex justify-center">
                <v-btn :to="link.to" color="green darken-1" variant="elevated" class="w-100 text-none d-flex align-center justify-center" height="56">
                  {{ link.title }}
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>
