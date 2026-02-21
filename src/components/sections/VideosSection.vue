<template>
  <section id="videos" class="py-2 bg-white">
    <div class="container">
      <h2 class="h2 fw-bold text-center mb-3">Nuestros trabajos</h2>
      <p class="text-muted text-center mb-4">Algunos de nuestros videos · Ver más en nuestro canal</p>
      <div class="row g-4 mb-4">
        <div v-for="video in videos" :key="video.id" class="col-md-6">
          <div class="ratio ratio-16x9">
            <iframe :src="video.url" :title="video.titulo" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
        </div>
      </div>
      <div class="text-center">
        <a :href="enlacesYouTube.canal" target="_blank" rel="noopener noreferrer" class="btn btn-outline-danger me-2 mb-2">
          <i class="fa-brands fa-youtube me-2"></i>Ver canal en YouTube
        </a>
        <a :href="enlacesYouTube.live" target="_blank" rel="noopener noreferrer" class="btn btn-outline-danger mb-2">
          <i class="fa-solid fa-tower-broadcast me-2"></i>Ver transmisiones en vivo
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getEnlacesYouTube } from '@/data/empresa';

const enlacesYouTube = getEnlacesYouTube();

const videos = ref([
  { id: 1, titulo: 'PEGASO FILMS', url: 'https://www.youtube.com/embed/YReAfZvZn6g?si=XFo41FXi1_VoWcwH' },
  { id: 2, titulo: 'PEGASO FILMS', url: 'https://www.youtube.com/embed/jhR8BB7bjaY?si=KtpbnH_a84h9VLDW' }
]);
</script>

<style scoped>
.ratio.ratio-16x9 iframe {
  border-radius: 8px;
}
</style>
