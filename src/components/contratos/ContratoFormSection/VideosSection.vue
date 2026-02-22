<template>
  <section class="contrato-form-section">
    <h6 class="contrato-form-section-title"><i class="fa-solid fa-video me-2"></i>Videos (enlaces)</h6>
    <div class="row g-2 mb-2">
      <div class="col-md-4">
        <label class="form-label small mb-0">Nombre del video</label>
        <input v-model="nuevoVideoNombre" type="text" class="form-control form-control-sm"
          placeholder="Ej. intro, comida, baile">
      </div>
      <div class="col-md-6">
        <label class="form-label small mb-0">URL</label>
        <input v-model="nuevoVideoUrl" type="url" class="form-control form-control-sm" placeholder="https://...">
      </div>
      <div class="col-md-2 d-flex align-items-end">
        <button type="button" class="btn btn-outline-primary btn-sm w-100" @click="agregarVideo"
          :disabled="!nuevoVideoUrl.trim()">
          <i class="fa-solid fa-plus me-1"></i>Agregar
        </button>
      </div>
    </div>
    <div v-if="form.videosLista.length" class="d-flex flex-wrap gap-2">
      <span v-for="(v, idx) in form.videosLista" :key="idx"
        class="badge bg-light text-dark border border-secondary d-inline-flex align-items-center gap-1 py-2">
        <span class="fw-semibold">{{ v.nombre || 'Sin nombre' }}</span>
        <span class="text-muted">·</span>
        <a :href="v.url" target="_blank" rel="noopener" class="text-dark text-decoration-none text-truncate"
          style="max-width: 180px;">{{ v.url }}</a>
        <button type="button" class="btn-close btn-close-sm p-0 ms-1" style="font-size: 0.6rem;"
          @click="quitarVideo(idx)" aria-label="Quitar"></button>
      </span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { ContratoFormState } from '@/types/contrato';

const props = defineProps<{
  form: ContratoFormState;
}>();

const nuevoVideoNombre = ref('');
const nuevoVideoUrl = ref('');

function agregarVideo() {
  const url = nuevoVideoUrl.value.trim();
  if (url) {
    props.form.videosLista.push({
      nombre: nuevoVideoNombre.value.trim() || `Video ${props.form.videosLista.length + 1}`,
      url
    });
    nuevoVideoNombre.value = '';
    nuevoVideoUrl.value = '';
  }
}

function quitarVideo(idx: number) {
  props.form.videosLista.splice(idx, 1);
}
</script>
