<script setup lang="ts">
import { ref, onMounted } from 'vue';
import FounderCard from '@/components/DrUniversity/FounderCard/FounderCard.vue';
import { FounderCardProps } from '@/components/DrUniversity/FounderCard/FounderCard.model';
import { getAllFounders } from '@/services/drUniversity/founders/founder.service';

const founders = ref<FounderCardProps[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    founders.value = await getAllFounders();
  } catch (err: any) {
    error.value = err?.message || 'Failed to load founders.';
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="leaders-page d-flex justify-center align-center py-10 flex-wrap">
    <v-progress-circular v-if="loading" indeterminate color="primary" />

    <div v-else-if="error" class="text-error text-center w-full">
      {{ error }}
    </div>

    <FounderCard v-else v-for="(founder, index) in founders" :key="index" v-bind="founder" />
  </div>
</template>

<style scoped>
.leaders-page {
  gap: 40px;
  flex-wrap: wrap;
}
</style>
