<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { getGeoGuesserById, guessGeoGuesser, getAllGeoGuesserIds } from '@/services/geoGuesser/geoGuesser.service';

import { getWc3Maps } from '@/services/wc3/wc3.service';

const route = useRoute();
const router = useRouter();

const id = computed(() => Number(route.params.id));

const geo = ref<any>(null);
const maps = ref<{ id: number; name: string }[]>([]);
const allIds = ref<number[]>([]);

const selectedMapId = ref<number | null>(null);
const attempts = ref(0);
const solved = ref(false);
const feedback = ref('');
const numberOfGuesses = ref(0);

const SUCCESS_MESSAGES = [
  'Good job! You nailed it.',
  'Awesome work! You crushed it.',
  'Well done! Victory is yours.',
  'Great play! You did it.',
  'Impressive! You nailed that one.',
  'Fantastic! You’re on fire.',
  'You win! Easy peasy.',
  'EZ win 😎',
  'Victory dance time!',
  'GG! Well played.',
  'That was fast.',
  'Big brain play.',
  'Skill detected.',
  'You are built different!',
];

const imageSrc = computed(() => {
  if (!geo.value) return '';
  if (solved.value) return geo.value.images.large;
  if (attempts.value === 0) return geo.value.images.small;
  if (attempts.value === 1) return geo.value.images.medium;
  return geo.value.images.large;
});

const currentIndex = computed(() => allIds.value.indexOf(id.value));

const prevId = computed(() => {
  return currentIndex.value > 0 ? allIds.value[currentIndex.value - 1] : null;
});

const nextId = computed(() => {
  return currentIndex.value !== -1 && currentIndex.value < allIds.value.length - 1 ? allIds.value[currentIndex.value + 1] : null;
});

function getSolvedIds(): number[] {
  try {
    return JSON.parse(localStorage.getItem('geo-guesser-solved') || '[]');
  } catch {
    return [];
  }
}

function markSolved(id: number) {
  const solvedIds = getSolvedIds();
  if (!solvedIds.includes(id)) {
    solvedIds.push(id);
    localStorage.setItem('geo-guesser-solved', JSON.stringify(solvedIds));
  }
}

async function loadGeo(id: number) {
  geo.value = null;
  solved.value = false;
  feedback.value = '';
  attempts.value = 0;
  numberOfGuesses.value = 0;
  selectedMapId.value = null;

  geo.value = await getGeoGuesserById(id);
}

async function submitGuess() {
  if (!selectedMapId.value || solved.value) return;

  numberOfGuesses.value++;

  const res = await guessGeoGuesser(id.value, {
    mapId: selectedMapId.value,
  });

  if (res.correct) {
    solved.value = true;
    feedback.value = '🎉 ' + SUCCESS_MESSAGES[Math.floor(Math.random() * SUCCESS_MESSAGES.length)];
    markSolved(id.value);
  } else {
    attempts.value++;
    feedback.value = attempts.value === 1 ? 'Wrong guess. Here is a better view.' : 'Still wrong. Full image unlocked!';
  }
}

function goPrev() {
  if (prevId.value !== null) {
    router.push(`/geoguesser/${prevId.value}`);
  }
}

function goNext() {
  if (nextId.value !== null) {
    router.push(`/geoguesser/${nextId.value}`);
  }
}

watch(
  () => id.value,
  async (newId) => {
    await loadGeo(newId);
  },
  { immediate: true }
);

onMounted(async () => {
  maps.value = await getWc3Maps();
  allIds.value = await getAllGeoGuesserIds();
});
</script>

<template>
  <v-container v-if="geo" class="game-wrapper">
    <div class="card-wrapper">
      <transition name="slide-fade">
        <v-alert v-if="feedback && !solved" type="error" variant="tonal" class="floating-alert">
          {{ feedback }}
        </v-alert>
      </transition>

      <v-card class="game-card" elevation="6">
        <div class="image-wrapper">
          <v-img :src="imageSrc" aspect-ratio="16/9" cover />

          <transition name="fade">
            <div v-if="solved" class="success-overlay">
              <h2>{{ feedback }}</h2>
              <p>{{ maps.find((m) => m.id === selectedMapId)?.name }}</p>
              <p class="mt-2">
                You guessed it in
                <span class="number-of-guesses">{{ numberOfGuesses }}</span>
                {{ numberOfGuesses === 1 ? 'try' : 'tries' }}!
              </p>
            </div>
          </transition>
        </div>

        <v-card-text v-if="!solved">
          <v-autocomplete v-model="selectedMapId" :items="maps" item-title="name" item-value="id" label="Guess the map!" clearable />

          <v-btn block size="large" color="primary" @click="submitGuess"> Submit Guess </v-btn>
        </v-card-text>

        <v-divider />

        <v-card-actions class="nav-actions">
          <v-btn icon variant="text" @click="goPrev" :disabled="!prevId">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>

          <v-btn variant="outlined" @click="router.push('/geoguesser')"> Back to list </v-btn>

          <v-btn icon variant="text" @click="goNext" :disabled="!nextId">
            <v-icon>mdi-arrow-right</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </v-container>
</template>
<style scoped>
.game-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.game-card {
  width: 100%;
  max-width: 900px;
  border-radius: 16px;
  overflow: hidden;
}

.image-wrapper {
  position: relative;
}

.success-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 24px;
}

.success-overlay h2 {
  font-size: 32px;
  margin-bottom: 12px;
}

.success-overlay p {
  font-size: 18px;
  opacity: 0.85;
}

.nav-actions {
  display: flex;
  justify-content: space-between;
  padding: 16px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.number-of-guesses {
  font-weight: bold;
  font-size: 1.2em;
  color: #ffeb3b;
}

.card-wrapper {
  position: relative;
  width: 100%;
  max-width: 900px;
}

.floating-alert {
  position: absolute;
  top: -80px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 900px;
  z-index: 10;
}

/* Nice entrance animation */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translate(-50%, -10px);
}
.slide-fade-leave-to {
  opacity: 0;
}
</style>
