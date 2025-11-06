<script setup lang="ts">
import InfiImage from '@/assets/imgs/infi.png';
import SaulApeManImage from '@/assets/imgs/saul-dr-circle.png';
import FounderCard from '@/components/DrUniversity/FounderCard/FounderCard.vue';

const contributionText = `
<p>This is a sample <b>contribution</b> with <i>HTML</i> content for the founder. It can include various HTML elements such as:</p>
<ul>
  <li>Bold text</li>
  <li>Italic text</li>
  <li>Lists</li>
  <li>Links</li>
</ul>
<p>The contribution will be sanitized to ensure safety against XSS attacks.</p>
`;
</script>

<template>
  <div class="leaders-page d-flex justify-center align-center py-10 flex-wrap">
    <FounderCard
      :image="InfiImage"
      :race="{ human: true }"
      name="Infi"
      role="Director of University"
      tiktok="https://live.douyin.com/864599529401"
      liquipedia="https://liquipedia.net/warcraft/Infi"
      :contribution="contributionText"
    />
    <FounderCard
      :image="SaulApeManImage"
      :race="{ human: true, undead: true, orc: true, nightelf: true }"
      name="SaulApeMan"
      role="Head of Curriculum"
      tiktok="https://www.tiktok.com/@saulapeman"
      youtube="https://www.youtube.com/@SaulApeMan"
      liquipedia="https://liquipedia.net/warcraft/SaulApeMan"
      twitch="https://twitch.tv/saulapeman"
      instagram="https://instagram.com/saulapeman"
      w3champions="https://www.w3champions.com/player/SaulGoodman%2321507"
      :contribution="contributionText"
    />
  </div>
</template>
