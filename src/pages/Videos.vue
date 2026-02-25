<template>
  <div class="videos-page">
    <Navbar />
    <main class="videos-main">
      <VideosSection />
    </main>
    
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/Navbar.vue';
import VideosSection from '@/components/sections/VideosSection.vue';
// import ContactoFooter from '@/components/sections/ContactoFooter.vue';
</script>

<style scoped>
.videos-page {
  padding-top: 76px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.videos-main {
  flex: 1;
}
</style>
