<template>
  <div class="tutoriales-page">
    <Navbar />
    <div class="container py-4">
      <div class="d-flex align-items-center mb-4">
        <span class="tutoriales-icon me-3"><i class="fa-solid fa-book-open"></i></span>
        <div>
          <h1 class="h3 mb-1 text-primary">Tutoriales</h1>
          <p class="text-muted mb-0 small">Elige un tutorial para ver las instrucciones paso a paso.</p>
        </div>
      </div>

      <div v-for="t in TUTORIALES" :key="t.id" class="my-3 border rounded-2 shadow-sm tutorial-card bg-white">
        <div class="w-100 text-start py-2 px-3 d-flex align-items-center gap-3" @click="abrirTutorial(t)">
          <span class="btn-tutorial-icon"><i :class="t.icon"></i></span>
          <span class="flex-grow-1">{{ t.titulo }}</span>
          <i class="fa-solid fa-chevron-right text-muted small"></i>
        </div>
      </div>
    </div>

    <TutorialModal :show="modalAbierto" :tutorial-id="tutorialSeleccionado?.id ?? null"
      :titulo="tutorialSeleccionado?.titulo ?? ''" :icon="tutorialSeleccionado?.icon ?? 'fa-solid fa-book'"
      @cerrar="cerrarModal" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Navbar from '@/components/Navbar.vue';
import TutorialModal from '@/components/TutorialModal.vue';
import { TUTORIALES, type TutorialItem } from '@/data/tutoriales';

const modalAbierto = ref(false);
const tutorialSeleccionado = ref<TutorialItem | null>(null);

function abrirTutorial(t: TutorialItem) {
  tutorialSeleccionado.value = t;
  modalAbierto.value = true;
}

function cerrarModal() {
  modalAbierto.value = false;
  tutorialSeleccionado.value = null;
}
</script>

<style scoped>
.tutoriales-page {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding-top: 76px;
}

.tutoriales-icon {
  width: 3rem;
  height: 3rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(34, 74, 157, 0.1);
  border-radius: 12px;
  color: #224a9d;
  font-size: 1.5rem;
}


.btn-tutorial-icon {
  width: 2.5rem;
  height: 2.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  color: #224a9d;
  flex-shrink: 0;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}

.tutorial-card {
  cursor: pointer;
}

.tutorial-card:hover {
  background-color: #f2f4f7 !important;
}
</style>
