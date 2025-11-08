<script setup lang="ts">
import { ref, computed } from 'vue';
import BlogImage from '@/assets/imgs/blog1.png';
import BlogCard from '@/components/DrUniversity/BlogCard/BlogCard.vue';
import { VPagination } from 'vuetify/components';
import { Platform } from '@/components/DrUniversity/BlogCard/BlogCard.model';

const title = 'Dark Ranger First in W3Champions Season 22 Finals: Starbuck vs Dise';
const text = `
You know a strategy is strong when pro players are willing to use it in very important games. Recently, Starbuck played a Dark Ranger opener twice as Human vs Dise’s Night Elf — with the W3C Season 22 Champion title on the line...
`;

const links = [
  { link: 'https://warcraft3.info/ticker/11816000014000/Starbuck_vs_Dise', platform: Platform.W3CHAMPIONS, description: 'Match ticker' },
  { link: 'https://www.youtube.com/live/chwfRqpWFpc?si=K7RhNAfXw8f2gkgK&t=29602', platform: Platform.YOUTUBE, description: 'Game 1' },
  { link: 'https://www.youtube.com/live/chwfRqpWFpc?si=1aq4GScrzm7WmY1a&t=30193', platform: Platform.YOUTUBE, description: 'Game 2' },
];

const blogs = Array.from({ length: 100 }).map((_, idx) => ({
  title: idx + 1 + ' ' + title,
  text,
  links,
  image: BlogImage,
}));

const currentPage = ref(1);
const itemsPerPage = 5;

const totalPages = computed(() => Math.ceil(blogs.length / itemsPerPage));

const paginatedBlogs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return blogs.slice(start, start + itemsPerPage);
});
</script>

<template>
  <v-container class="py-6 d-flex justify-center flex-column align-center ga-4">
    <div v-for="(blog, index) in paginatedBlogs" :key="index">
      <BlogCard :title="blog.title" :text="blog.text" :links="blog.links" :image="blog.image" />
    </div>

    <v-pagination v-if="totalPages > 1" v-model="currentPage" :length="totalPages" total-visible="5" class="mt-6" />
  </v-container>
</template>

<style scoped>
.v-pagination {
  display: flex;
  justify-content: center;
}
</style>
