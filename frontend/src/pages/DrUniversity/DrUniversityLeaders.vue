<script setup lang="ts">
import InfiImage from '@/assets/imgs/infi.png';
import SaulApeManImage from '@/assets/imgs/saul-dr-circle.png';
import LeaderCard from '@/components/DrUniversity/LeaderCard/LeaderCard.vue';
</script>

<template>
  <div class="leaders-page d-flex justify-center align-center py-10 flex-wrap">
    <LeaderCard :image="InfiImage" name="Infi" role="Director of University" tiktok="https://live.douyin.com/864599529401" liquipedia="https://liquipedia.net/warcraft/Infi" />
    <LeaderCard
      :image="SaulApeManImage"
      name="SaulApeMan"
      role="Head of Curriculum"
      tiktok="https://www.tiktok.com/@saulapeman"
      youtube="https://www.youtube.com/@SaulApeMan"
      liquipedia="https://liquipedia.net/warcraft/SaulApeMan"
      twitch="https://twitch.tv/saulapeman"
      instagram="https://instagram.com/saulapeman"
      w3champions="https://www.w3champions.com/player/SaulGoodman%2321507"
    />
  </div>
</template>
