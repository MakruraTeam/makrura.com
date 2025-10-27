<script setup lang="ts">
import InfiImage from '@/assets/infi.png';
import SaulApeManImage from '@/assets/saul-dr-circle.png';
import LeaderCard from '@/components/DrUniversity/LeaderCard/LeaderCard.vue';
</script>

<template>
  <div class="leaders-page d-flex justify-center align-center py-10 flex-wrap">
    <LeaderCard
      :image="InfiImage"
      name="Infi"
      role="Director of University"
      tiktok="https://tiktok.com"
      youtube="https://youtube.com"
      liquipedia="https://liquipedia.net/warcraft/Infi"
      twitch="https://twitch.tv"
    />
    <LeaderCard
      :image="SaulApeManImage"
      name="SaulApeMan"
      role="Head of Curriculum"
      tiktok="https://tiktok.com"
      youtube="https://youtube.com"
      liquipedia="https://liquipedia.net/warcraft/SaulApeMan"
      soop="https://koreanscoop.com"
      twitch="https://twitch.tv"
      instagram="https://instagram.com"
    />
  </div>
</template>
