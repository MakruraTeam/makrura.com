<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import HumanIcon from '@/assets/imgs/human.webp';
import OrcIcon from '@/assets/imgs/orc.webp';
import NightElfIcon from '@/assets/imgs/nightelf.webp';
import UndeadIcon from '@/assets/imgs/undead.webp';
import W3cIcon from '@/assets/imgs/w3c.png';
import TwitchIcon from '@/assets/imgs/twitch.png';

interface PlayerDot {
  id: string;
  x: number;
  y: number;
  name: string;
  twitch: string;
  race: '' | 'human' | 'orc' | 'nightelf' | 'undead' | 'random';
  w3cNick: string;
}

interface EventData {
  name: string;
  image: string;
}

const races = [
  { value: 'human',    label: 'Human',     icon: HumanIcon },
  { value: 'orc',      label: 'Orc',       icon: OrcIcon },
  { value: 'nightelf', label: 'Night Elf', icon: NightElfIcon },
  { value: 'undead',   label: 'Undead',    icon: UndeadIcon },
  { value: 'random',   label: 'Random',    icon: null },
] as const;

const raceMap: Record<string, { label: string; icon: string | null }> = Object.fromEntries(
  races.map((r) => [r.value, { label: r.label, icon: r.icon }]),
);

const events: Record<string, EventData> = {
  'basestack-polish-2026': {
    name: 'BaseStack Polish 2026',
    image: '/events/basestack-polish-2026.png',
  },
};

const route = useRoute();
const router = useRouter();
const slug = route.params.slug as string;
const event = events[slug];

const dots = ref<PlayerDot[]>([]);
const imageRef = ref<HTMLElement | null>(null);
const showDialog = ref(false);
const editingDot = ref<PlayerDot | null>(null);
const pendingPos = ref<{ x: number; y: number } | null>(null);
const hoveredDotId = ref<string | null>(null);
let hideTimer: ReturnType<typeof setTimeout> | null = null;

function showDot(id: string) {
  if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
  hoveredDotId.value = id;
}
function hideDot() {
  hideTimer = setTimeout(() => { hoveredDotId.value = null; }, 400);
}

const formName = ref('');
const formTwitch = ref('');
const formRace = ref<PlayerDot['race']>('');
const formW3cNick = ref('');

const storageKey = `lan-event-dots-${slug}`;

onMounted(() => {
  const saved = localStorage.getItem(storageKey);
  if (saved) {
    const parsed = JSON.parse(saved);
    dots.value = parsed.map((d: any) => ({
      id: d.id,
      x: d.x,
      y: d.y,
      name: d.name ?? '',
      twitch: d.twitch ?? '',
      race: d.race ?? '',
      w3cNick: d.w3cNick ?? d.wc3nick ?? '',
    }));
  }
});

function saveDots() {
  localStorage.setItem(storageKey, JSON.stringify(dots.value));
}

function onImageClick(e: MouseEvent) {
  const img = imageRef.value;
  if (!img) return;
  const rect = img.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  pendingPos.value = { x, y };
  editingDot.value = null;
  formName.value = '';
  formTwitch.value = '';
  formRace.value = '';
  formW3cNick.value = '';
  showDialog.value = true;
}

function onDotClick(e: MouseEvent, dot: PlayerDot) {
  e.stopPropagation();
  editingDot.value = dot;
  formName.value = dot.name;
  formTwitch.value = dot.twitch;
  formRace.value = dot.race;
  formW3cNick.value = dot.w3cNick;
  showDialog.value = true;
}

function savePlayer() {
  if (editingDot.value) {
    const idx = dots.value.findIndex((d) => d.id === editingDot.value!.id);
    if (idx !== -1) {
      dots.value[idx] = {
        ...dots.value[idx],
        name: formName.value,
        twitch: formTwitch.value,
        race: formRace.value,
        w3cNick: formW3cNick.value,
      };
    }
  } else if (pendingPos.value) {
    dots.value.push({
      id: Date.now().toString(),
      x: pendingPos.value.x,
      y: pendingPos.value.y,
      name: formName.value,
      twitch: formTwitch.value,
      race: formRace.value,
      w3cNick: formW3cNick.value,
    });
  }
  saveDots();
  closeDialog();
}

function deleteDot() {
  if (editingDot.value) {
    dots.value = dots.value.filter((d) => d.id !== editingDot.value!.id);
    saveDots();
  }
  closeDialog();
}

function closeDialog() {
  showDialog.value = false;
  editingDot.value = null;
  pendingPos.value = null;
}

function popupStyle(dot: PlayerDot) {
  const style: Record<string, string> = {
    bottom: '100%',
    marginBottom: '8px',
    top: 'auto',
  };
  if (dot.x > 75) {
    style.right = '0';
    style.left = 'auto';
  } else if (dot.x < 25) {
    style.left = '0';
    style.right = 'auto';
  } else {
    style.left = '50%';
    style.right = 'auto';
    style.transform = 'translateX(-50%)';
  }
  return style;
}

const raceColor: Record<string, string> = {
  human:    '#4a90d9',
  orc:      '#e03c2e',
  undead:   '#9b59b6',
  nightelf: '#27ae60',
  random:   '#888888',
};

const raceGlowRgb: Record<string, string> = {
  human:    '74, 144, 217',
  orc:      '220, 60, 30',
  undead:   '155, 89, 182',
  nightelf: '39, 174, 96',
  random:   '136, 136, 136',
};

function dotColor(dot: PlayerDot) {
  return raceColor[dot.race] ?? '#ffffff';
}

function popupGlowStyle(dot: PlayerDot) {
  const rgb = raceGlowRgb[dot.race] ?? '180, 120, 30';
  const color = raceColor[dot.race] ?? '#b4781e';
  return {
    borderColor: `rgba(${rgb}, 0.75)`,
    boxShadow: `0 0 0 1px rgba(${rgb}, 0.25), 0 0 12px rgba(${rgb}, 0.55), 0 0 28px rgba(${rgb}, 0.25), inset 0 0 18px rgba(${rgb}, 0.08)`,
    '--glow-color': color,
  };
}

function openW3c(url: string) {
  window.open(url, '_blank');
}

function openTwitch(nick: string) {
  window.open(`https://twitch.tv/${nick}`, '_blank');
}

const dialogTitle = computed(() => (editingDot.value ? 'Edytuj gracza' : 'Dodaj gracza'));
</script>

<template>
  <v-container v-if="!event" class="py-8">
    <p>Event nie istnieje.</p>
    <v-btn @click="router.push('/lan-events')">Wróć</v-btn>
  </v-container>

  <v-container v-else class="py-8">
    <div class="d-flex align-center mb-4 gap-3">
      <v-btn icon="mdi-arrow-left" variant="text" @click="router.push('/lan-events')" />
      <h1 class="text-h5 font-weight-bold">{{ event.name }}</h1>
    </div>

    <p class="text-caption text-grey mb-3">Kliknij na zdjęciu żeby dodać gracza &nbsp;·&nbsp; Najedź na kropkę żeby zobaczyć info</p>

    <div class="image-wrapper" ref="imageRef" @click="onImageClick">
      <img :src="event.image" class="event-image" alt="Event photo" draggable="false" />

      <div
        v-for="dot in dots"
        :key="dot.id"
        class="player-dot"
        :style="{ left: dot.x + '%', top: dot.y + '%' }"
        @mouseenter="showDot(dot.id)"
        @mouseleave="hideDot()"
        @click="(e) => onDotClick(e, dot)"
      >
        <div class="dot-circle" :style="{ background: dotColor(dot) }" />

        <Transition name="popup">
          <div
            v-if="hoveredDotId === dot.id"
            class="dot-popup"
            :style="{ ...popupStyle(dot), ...popupGlowStyle(dot) }"
            @mouseenter="showDot(dot.id)"
            @mouseleave="hideDot()"
            @click.stop
          >
            <span class="popup-name">{{ dot.name || '???' }}</span>
            <div class="popup-divider" :style="{ background: dotColor(dot) }" />

            <div v-if="dot.race && raceMap[dot.race]?.icon" class="popup-row">
              <img :src="raceMap[dot.race].icon!" class="popup-race-icon" :alt="raceMap[dot.race].label" />
              <span>{{ raceMap[dot.race].label }}</span>
            </div>

            <div v-if="dot.twitch" class="popup-row popup-twitch" @dblclick.stop="openTwitch(dot.twitch)">
              <img :src="TwitchIcon" class="popup-icon" alt="Twitch" />
              <span>{{ dot.twitch }}</span>
            </div>

            <div v-if="dot.w3cNick" class="popup-row popup-link" @click.stop="openW3c(dot.w3cNick)">
              <img :src="W3cIcon" class="popup-icon" alt="W3Champions" />
              <span>w3champions</span>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <v-dialog v-model="showDialog" max-width="420">
      <v-card>
        <v-card-title>{{ dialogTitle }}</v-card-title>
        <v-card-text>
          <v-text-field v-model="formName" label="Imię / nick" variant="outlined" density="compact" class="mb-3" />

          <p class="text-caption text-grey mb-1">Rasa</p>
          <div class="race-picker mb-4">
            <div
              v-for="r in races"
              :key="r.value"
              class="race-option"
              :class="{ 'race-selected': formRace === r.value }"
              @click="formRace = r.value"
            >
              <img v-if="r.icon" :src="r.icon" :alt="r.label" class="race-picker-icon" />
              <span v-else class="race-picker-icon race-random-icon">?</span>
              <span>{{ r.label }}</span>
            </div>
          </div>

          <v-text-field v-model="formTwitch" label="Nick Twitch" variant="outlined" density="compact" class="mb-2" prepend-inner-icon="mdi-twitch" />
          <v-text-field v-model="formW3cNick" label="Link W3Champions" variant="outlined" density="compact" hint="Wklej cały link np. https://www.w3champions.com/player/Saul" persistent-hint />
        </v-card-text>
        <v-card-actions>
          <v-btn v-if="editingDot" color="error" variant="text" @click="deleteDot">Usuń</v-btn>
          <v-spacer />
          <v-btn variant="text" @click="closeDialog">Anuluj</v-btn>
          <v-btn color="primary" variant="flat" @click="savePlayer">Zapisz</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.image-wrapper {
  position: relative;
  display: inline-block;
  cursor: crosshair;
  max-width: 100%;
  user-select: none;
}

.event-image {
  display: block;
  max-width: 100%;
  max-height: 80vh;
  border-radius: 8px;
}

.player-dot {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: pointer;
  z-index: 10;
}

.dot-circle {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.8);
  transition: transform 0.15s;
}

.player-dot:hover .dot-circle {
  transform: scale(1.5);
}

.dot-popup {
  position: absolute;
  z-index: 100;
  background: linear-gradient(160deg, #0d0608 0%, #100608 60%, #0a0405 100%);
  border: 1px solid rgba(180, 80, 20, 0.7);
  border-radius: 8px;
  padding: 29px 34px;
  width: 462px;
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  gap: 19px;
}

.dot-popup::before,
.dot-popup::after {
  content: '';
  position: absolute;
  width: 21px;
  height: 21px;
  border-style: solid;
  border-color: #c8922a;
}
.dot-popup::before {
  top: -1px;
  left: -1px;
  border-width: 3px 0 0 3px;
  border-radius: 3px 0 0 0;
}
.dot-popup::after {
  bottom: -1px;
  right: -1px;
  border-width: 0 3px 3px 0;
  border-radius: 0 0 3px 0;
}

.popup-name {
  font-size: 36px;
  font-weight: 700;
  color: #f0d080;
  line-height: 1.2;
  letter-spacing: 0.03em;
  text-shadow: 0 0 17px rgba(240, 180, 60, 0.5);
}

.popup-divider {
  height: 2px;
  width: 100%;
  opacity: 0.6;
  border-radius: 2px;
}

.popup-row {
  display: flex;
  align-items: center;
  gap: 17px;
  font-size: 27px;
  color: rgba(220, 200, 180, 0.85);
}

.popup-icon {
  width: 34px;
  height: 34px;
  object-fit: contain;
  flex-shrink: 0;
}

.popup-race-icon {
  width: 46px;
  height: 46px;
  object-fit: contain;
  flex-shrink: 0;
}

.popup-twitch {
  cursor: pointer;
}
.popup-twitch:hover {
  color: #bf94ff;
}

.popup-link {
  cursor: pointer;
  color: #7ec8e3;
}
.popup-link:hover {
  color: #fff;
  text-decoration: underline;
}

.popup-enter-active,
.popup-leave-active {
  transition: opacity 0.12s, transform 0.12s;
}
.popup-enter-from,
.popup-leave-to {
  opacity: 0;
  transform: scale(0.93) translateY(4px);
}

.race-picker {
  display: flex;
  gap: 8px;
}

.race-option {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 6px 4px;
  border-radius: 8px;
  border: 2px solid transparent;
  cursor: pointer;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  transition: border-color 0.15s, background 0.15s;
}
.race-option:hover {
  background: rgba(255, 255, 255, 0.06);
}
.race-selected {
  border-color: #7986cb;
  background: rgba(121, 134, 203, 0.15);
  color: #fff;
}

.race-picker-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.race-random-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  color: #888;
}
</style>
