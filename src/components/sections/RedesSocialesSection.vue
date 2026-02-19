<template>
  <section class="py-4 bg-white">
    <div class="container text-center">
      <h2 class="h2 fw-bold mb-3">Síguenos</h2>
      <p class="text-muted mb-4">@PEGASOFILMSNOPALA</p>
      <div class="d-flex flex-wrap justify-content-center gap-2">
        <a v-for="red in redesSociales" :key="red.id" :href="red.url" :target="red.target" :rel="red.rel" :class="red.clase">
          <i :class="red.icono" class="me-1"></i> {{ red.nombre }}
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const redesSociales = ref([
  { id: 1, nombre: 'YouTube', url: 'https://www.youtube.com/c/PEGASOFILMSNOPALA', target: '_blank', rel: 'noopener noreferrer', clase: 'btn btn-outline-danger', icono: 'fa-brands fa-youtube' },
  { id: 2, nombre: 'Live', url: 'https://www.youtube.com/@PEGASOFILMSLIVE', target: '_blank', rel: 'noopener noreferrer', clase: 'btn btn-outline-danger', icono: 'fa-solid fa-tower-broadcast' },
  { id: 3, nombre: 'Facebook', url: 'https://www.facebook.com/pegasofilmsnopala', target: '_blank', rel: 'noopener noreferrer', clase: 'btn btn-outline-primary', icono: 'fa-brands fa-facebook' },
  { id: 4, nombre: 'TikTok', url: 'https://www.tiktok.com/@pegasofilms', target: '_blank', rel: 'noopener noreferrer', clase: 'btn btn-outline-dark', icono: 'fa-brands fa-tiktok' },
  { id: 5, nombre: 'Instagram', url: 'https://www.instagram.com/pegasofilmsnopala', target: '_blank', rel: 'noopener noreferrer', clase: 'btn btn-outline-danger', icono: 'fa-brands fa-instagram' }
]);
</script>

<style scoped>
</style>
