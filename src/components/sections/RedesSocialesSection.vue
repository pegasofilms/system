<template>
  <section class="py-4 bg-white">
    <div class="container text-center">
      <h2 class="h2 fw-bold mb-3">Síguenos</h2>
      <p class="text-muted mb-4">{{ EMPRESA.usuarioRedes }}</p>
      <div class="d-flex flex-wrap justify-content-center gap-2">
        <a v-for="red in EMPRESA.redesSociales" :key="red.id" :href="red.url" :target="red.target" :rel="red.rel" :class="red.clase">
          <i :class="red.icono" class="me-1"></i> {{ red.nombre }}
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { EMPRESA } from '@/data/empresa';
</script>

<style scoped>
</style>
