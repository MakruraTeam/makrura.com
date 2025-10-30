<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';

// --- Armor Images ---
import HeavyArmorImage from '@/assets/imgs/damageValueGame/armors/heavy-armor.png';
import MediumArmorImage from '@/assets/imgs/damageValueGame/armors/medium-armor.png';
import LightArmorImage from '@/assets/imgs/damageValueGame/armors/light-armor.png';
import UnarmoredImage from '@/assets/imgs/damageValueGame/armors/unarmored.png';
import HeroArmorImage from '@/assets/imgs/damageValueGame/armors/hero-armor.png';
import FortifiedArmorImage from '@/assets/imgs/damageValueGame/armors/fortified-armor.png';

// --- Attack Images ---
import normalAttackImage from '@/assets/imgs/damageValueGame/damage/normal-attack.png';
import piercingAttackImage from '@/assets/imgs/damageValueGame/damage/piercing-attack.png';
import magicAttackImage from '@/assets/imgs/damageValueGame/damage/magic-attack.png';
import chaosAttackImage from '@/assets/imgs/damageValueGame/damage/chaos-attack.png';
import heroAttackImage from '@/assets/imgs/damageValueGame/damage/hero-attack.png';
import siegeAttackImage from '@/assets/imgs/damageValueGame/damage/siege-attack.png';
import spellAttackImage from '@/assets/imgs/damageValueGame/damage/spell-attack.png';
import { Armor, ArmorType, Attack, AttackType, DamageGame } from '@/pages/Games/AttackArmorValueGame/AttackArmorValueGame.model';

import ConfettiExplosion from 'vue-confetti-explosion';
const game = new DamageGame();

const armors = ref([
  new Armor('Heavy', HeavyArmorImage),
  new Armor('Medium', MediumArmorImage),
  new Armor('Light', LightArmorImage),
  new Armor('Unarmored', UnarmoredImage),
  new Armor('Fortified', FortifiedArmorImage),
  new Armor('Hero', HeroArmorImage),
]);

const attacks = ref([
  new Attack('Normal', normalAttackImage),
  new Attack('Piercing', piercingAttackImage),
  new Attack('Magic', magicAttackImage),
  new Attack('Siege', siegeAttackImage),
  new Attack('Hero', heroAttackImage),
  new Attack('Chaos', chaosAttackImage),
  new Attack('Spell', spellAttackImage),
]);

const userInputs = ref<Record<string, Record<string, string>>>({});
const results = ref<Record<string, Record<string, boolean | null>>>({});
const focusedRow = ref<string | null>(null);
const showConfetti = ref(false);

const hardcoreMode = ref(false);

watch(
  results,
  (newResults) => {
    const allFilled = Object.values(newResults).every((attackRow) => Object.values(attackRow).every((val) => val === true));

    if (allFilled) {
      explode();
    }
  },
  { deep: true }
);

initializeTables();

function initializeTables(): void {
  for (const atk of attacks.value) {
    userInputs.value[atk.name] = {};
    results.value[atk.name] = {};
    for (const arm of armors.value) {
      userInputs.value[atk.name][arm.name] = '';
      results.value[atk.name][arm.name] = null;
    }
  }
}

function shuffle<T>(array: T[]): T[] {
  return array.sort(() => Math.random() - 0.5);
}

function shuffleTable(): void {
  armors.value = shuffle([...armors.value]);
  attacks.value = shuffle([...attacks.value]);
}

function checkValue(attack: AttackType, armor: ArmorType): void {
  const correctValue = game.getDamageValue(attack, armor);
  const userValue = parseFloat(userInputs.value[attack][armor].replace('%', ''));
  if (isNaN(userValue)) {
    results.value[attack][armor] = null;
    return;
  }

  const isCorrect = userValue === correctValue;
  results.value[attack][armor] = isCorrect;

  if (hardcoreMode.value && !isCorrect) {
    resetTable();
    shuffleTable();
  }
}

function getCellColor(attack: AttackType, armor: ArmorType): string {
  const result = results.value[attack][armor];
  if (result === null) return 'white';
  return result ? '#c8e6c9' : '#ffcdd2';
}

function handleFocus(attack: AttackType): void {
  focusedRow.value = attack;
}
function handleBlur(): void {
  focusedRow.value = null;
}

function handleKeyNavigation(event: KeyboardEvent, attack: AttackType, armor: ArmorType): void {
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

    requestAnimationFrame((): void => {
      const wrapper = document.querySelector<HTMLElement>(`.cell-wrapper[data-attack="${attacks.value[nextAttackIndex].name}"][data-armor="${armors.value[nextArmorIndex].name}"]`);
      const nextInput = wrapper?.querySelector('input');
      nextInput?.focus();
    });
  }
}

function resetTable(): void {
  for (const atk of attacks.value) {
    for (const arm of armors.value) {
      userInputs.value[atk.name][arm.name] = '';
      results.value[atk.name][arm.name] = null;
    }
  }
}

watch(hardcoreMode, (enabled) => {
  if (enabled) {
    shuffleTable();
    resetTable();
  }
});

async function explode(): Promise<void> {
  showConfetti.value = false;
  await nextTick();
  showConfetti.value = true;
}
</script>

<template>
  <v-container class="py-6 d-flex flex-column align-center">
    <div class="buttons-wrapper d-flex mb-4 flex-md-row flex-column align-center">
      <v-btn color="primary" @click="shuffleTable">Shuffle Rows & Columns</v-btn>
      <v-btn color="error" @click="resetTable">Reset All Fields</v-btn>

      <div class="d-flex align-center no-wrap">
        <v-checkbox v-model="hardcoreMode" color="red" hide-details density="compact" />
        <span class="ml-2 hardcore-label">Hardcore Mode</span>
      </div>
    </div>

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

  <div v-if="showConfetti" class="confetti-center">
    <ConfettiExplosion :particleCount="300" :particleSize="12" :duration="15000" />
  </div>
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

:deep(.v-label) {
  display: none !important;
}

.buttons-wrapper {
  gap: 16px;
}

.confetti-center {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  pointer-events: none;
}

.no-wrap {
  flex-wrap: nowrap !important;
  white-space: nowrap;
}

.hardcore-label {
  font-weight: 600;
  font-size: 1.1rem;
  user-select: none;
  white-space: nowrap;
}
</style>
