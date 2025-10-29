<script setup lang="ts">
import { ref } from 'vue';

// --- Armor Images ---
import HeavyArmorImage from '@/assets/damageValueGame/armors/heavy-armor.png';
import MediumArmorImage from '@/assets/damageValueGame/armors/medium-armor.png';
import LightArmorImage from '@/assets/damageValueGame/armors/light-armor.png';
import UnarmoredImage from '@/assets/damageValueGame/armors/unarmored.png';
import HeroArmorImage from '@/assets/damageValueGame/armors/hero-armor.png';
import FortifiedArmorImage from '@/assets/damageValueGame/armors/fortified-armor.png';

// --- Attack Images ---
import normalAttackImage from '@/assets/damageValueGame/damage/normal-attack.png';
import piercingAttackImage from '@/assets/damageValueGame/damage/piercing-attack.png';
import magicAttackImage from '@/assets/damageValueGame/damage/magic-attack.png';
import chaosAttackImage from '@/assets/damageValueGame/damage/chaos-attack.png';
import heroAttackImage from '@/assets/damageValueGame/damage/hero-attack.png';
import siegeAttackImage from '@/assets/damageValueGame/damage/siege-attack.png';
import fireboltAttackImage from '@/assets/damageValueGame/damage/firebolt-attack.png';

// --- OOP Classes ---
class Armor {
  name: string;
  image: string;
  constructor(name: string, image: string) {
    this.name = name;
    this.image = image;
  }
}

class Attack {
  name: string;
  image: string;
  constructor(name: string, image: string) {
    this.name = name;
    this.image = image;
  }
}

class DamageGame {
  damageTable: Record<string, Record<string, number>> = {};

  constructor() {
    this.damageTable = {
      Normal: { Heavy: 100, Medium: 150, Light: 100, Unarmored: 100, Hero: 100, Fortified: 70 },
      Piercing: { Heavy: 90, Medium: 75, Light: 200, Unarmored: 150, Hero: 50, Fortified: 35 },
      Magic: { Heavy: 200, Medium: 75, Light: 125, Unarmored: 100, Hero: 50, Fortified: 35 },
      Siege: { Heavy: 100, Medium: 50, Light: 100, Unarmored: 150, Hero: 50, Fortified: 150 },
      Hero: { Heavy: 100, Medium: 100, Light: 100, Unarmored: 100, Hero: 100, Fortified: 50 },
      Chaos: { Heavy: 100, Medium: 100, Light: 100, Unarmored: 100, Hero: 100, Fortified: 100 },
      Firebolt: { Heavy: 100, Medium: 100, Light: 100, Unarmored: 100, Hero: 70, Fortified: 100 },
    };
  }

  getDamageValue(attack: string, armor: string): number {
    return this.damageTable[attack][armor];
  }
}

// --- Setup ---
const game = new DamageGame();

const armors = ref([
  new Armor('Heavy', HeavyArmorImage),
  new Armor('Medium', MediumArmorImage),
  new Armor('Light', LightArmorImage),
  new Armor('Unarmored', UnarmoredImage),
  new Armor('Hero', HeroArmorImage),
  new Armor('Fortified', FortifiedArmorImage),
]);

const attacks = ref([
  new Attack('Normal', normalAttackImage),
  new Attack('Piercing', piercingAttackImage),
  new Attack('Magic', magicAttackImage),
  new Attack('Siege', siegeAttackImage),
  new Attack('Hero', heroAttackImage),
  new Attack('Chaos', chaosAttackImage),
  new Attack('Firebolt', fireboltAttackImage),
]);

// --- State ---
const userInputs = ref<Record<string, Record<string, string>>>({});
const results = ref<Record<string, Record<string, boolean | null>>>({});
const focusedRow = ref<string | null>(null);

// Initialize
for (const atk of attacks.value) {
  userInputs.value[atk.name] = {};
  results.value[atk.name] = {};
  for (const arm of armors.value) {
    userInputs.value[atk.name][arm.name] = '';
    results.value[atk.name][arm.name] = null;
  }
}

function shuffle<T>(array: T[]): T[] {
  return array.sort(() => Math.random() - 0.5);
}

function shuffleTable() {
  armors.value = shuffle([...armors.value]);
  attacks.value = shuffle([...attacks.value]);
}

function checkValue(attack: string, armor: string) {
  const correctValue = game.getDamageValue(attack, armor);
  const userValue = parseFloat(userInputs.value[attack][armor].replace('%', ''));
  if (isNaN(userValue)) {
    results.value[attack][armor] = null;
    return;
  }
  results.value[attack][armor] = userValue === correctValue;
}

function getCellColor(attack: string, armor: string): string {
  const result = results.value[attack][armor];
  if (result === null) return 'white';
  return result ? '#c8e6c9' : '#ffcdd2';
}

function handleFocus(attack: string) {
  focusedRow.value = attack;
}
function handleBlur() {
  focusedRow.value = null;
}

function handleKeyNavigation(event: KeyboardEvent, attack: string, armor: string) {
  const attackIndex = attacks.value.findIndex((a) => a.name === attack);
  const armorIndex = armors.value.findIndex((a) => a.name === armor);

  let nextAttackIndex = attackIndex;
  let nextArmorIndex = armorIndex;

  switch (event.key) {
    case 'ArrowUp':
      nextAttackIndex = Math.max(0, attackIndex - 1);
      break;
    case 'ArrowDown':
      nextAttackIndex = Math.min(attacks.value.length - 1, attackIndex + 1);
      break;
    case 'ArrowLeft':
      nextArmorIndex = Math.max(0, armorIndex - 1);
      break;
    case 'ArrowRight':
      nextArmorIndex = Math.min(armors.value.length - 1, armorIndex + 1);
      break;
    case 'Enter':
      checkValue(attack, armor);
      (event.target as HTMLInputElement).blur();
      return;
  }

  if (nextAttackIndex !== attackIndex || nextArmorIndex !== armorIndex) {
    event.preventDefault();

    requestAnimationFrame(() => {
      const wrapper = document.querySelector<HTMLElement>(`.cell-wrapper[data-attack="${attacks.value[nextAttackIndex].name}"][data-armor="${armors.value[nextArmorIndex].name}"]`);
      const nextInput = wrapper?.querySelector('input');
      nextInput?.focus();
    });
  }
}
</script>

<template>
  <v-container class="py-6 d-flex flex-column align-center">
    <v-btn color="primary" class="mb-4" @click="shuffleTable">🔀 Shuffle Rows & Columns</v-btn>

    <div class="damage-table-wrapper">
      <v-table class="damage-table">
        <thead>
          <tr>
            <th class="square-cell"></th>
            <th v-for="armor in armors" :key="armor.name" class="square-cell">
              <v-img :src="armor.image" class="fill-cell" />
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="attack in attacks" :key="attack.name" :class="{ 'highlighted-row': focusedRow === attack.name }">
            <td class="square-cell">
              <v-img :src="attack.image" class="fill-cell" />
            </td>

            <td v-for="armor in armors" :key="armor.name" class="square-cell">
              <div class="cell-wrapper" :data-attack="attack.name" :data-armor="armor.name">
                <v-text-field
                  v-model="userInputs[attack.name][armor.name]"
                  hide-details
                  variant="outlined"
                  density="compact"
                  class="fill-cell no-padding"
                  :style="{ backgroundColor: getCellColor(attack.name, armor.name) }"
                  @focus="handleFocus(attack.name)"
                  @blur="
                    () => {
                      handleBlur();
                      checkValue(attack.name, armor.name);
                    }
                  "
                  @keydown="handleKeyNavigation($event, attack.name, armor.name)"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>
    </div>
  </v-container>
</template>

<style scoped>
.damage-table-wrapper {
  max-width: 700px;
  margin: 0 auto;
}

.damage-table {
  border-collapse: collapse;
  width: 100%;
  background-color: #f9f9f9;
  border-radius: 8px;
}

th,
td {
  border: 1px solid #ccc;
  padding: 0 !important;
  color: black !important;
}

.square-cell {
  width: 70px;
  height: 70px;
  position: relative;
  padding: 0;
  margin: 0;
}

.cell-wrapper {
  width: 100%;
  height: 100%;
}

.fill-cell {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.no-padding {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

.highlighted-row {
  font-weight: bold;
  background-color: #e0e0e0;
  color: black;
}

/* --- Deep Vuetify Overrides --- */
:deep(.v-input),
:deep(.v-input__control),
:deep(.v-field__field),
:deep(.v-field__input),
:deep(.v-field__overlay),
:deep(.v-field),
:deep(.v-field__loader),
:deep(.v-field__outline) {
  padding: 0 !important;
  margin: 0 !important;
  height: 100% !important;
  min-height: 0 !important;
  width: 100% !important;
}

:deep(.v-text-field) {
  height: 100% !important;
  width: 100% !important;
}

:deep(.v-field__input input),
:deep(input) {
  text-align: center !important;
  height: 100% !important;
  width: 100% !important;
  padding: 0 !important;
  margin: 0 !important;
  color: black !important;
  font-size: 0.9rem;
  background: transparent !important;
  box-shadow: none !important;
  outline: none !important;
}

/* remove label spacing */
:deep(.v-label) {
  display: none !important;
}
</style>
