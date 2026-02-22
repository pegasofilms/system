<template>
  <section class="contrato-form-section">
    <h6 class="contrato-form-section-title"><i class="fa-solid fa-user me-2"></i>Cliente</h6>
    <div class="row g-3">
      <div class="col-12">
        <label class="form-label">Contratante</label>
        <input v-model="form.contratante" type="text" class="form-control">
      </div>
      <div class="col-12">
        <label class="form-label">Teléfono</label>
        <input :value="form.telefono" type="tel" class="form-control" :class="{ 'is-invalid': telefonoInvalido }"
          placeholder="10 dígitos (ej. 9541234567)" maxlength="10" inputmode="numeric" pattern="[0-9]*"
          @input="onTelefonoInput($event)">
        <div v-if="telefonoInvalido" class="invalid-feedback">El teléfono debe tener exactamente 10 dígitos.</div>
      </div>
      <div class="col-md-12">
        <label class="form-label">Festejado</label>
        <input v-model="form.festejado" type="text" class="form-control">
      </div>
      <div class="col-12">
        <label class="form-label">Padrinos</label>
        <div v-for="(p, idx) in form.padrinosLista" :key="idx"
          class="padrino-row mb-2 d-flex flex-wrap gap-2 align-items-end">
          <div class="flex-grow-1" style="min-width: 140px;">
            <label class="form-label small mb-0">¿Padrino o madrina de qué?</label>
            <input v-model="p.deQue" type="text" class="form-control form-control-sm"
              placeholder="Ej. anillos, lazo, velación">
          </div>
          <div class="flex-grow-1" style="min-width: 140px;">
            <label class="form-label small mb-0">Nombre</label>
            <input v-model="p.nombre" type="text" class="form-control form-control-sm" placeholder="Nombre completo">
          </div>
          <button type="button" class="btn btn-outline-danger btn-sm" title="Quitar" @click="quitarPadrino(idx)">
            <i class="fa-solid fa-minus"></i>
          </button>
        </div>
        <button type="button" class="btn btn-outline-primary btn-sm mt-1" @click="agregarPadrino">
          <i class="fa-solid fa-plus me-1"></i>Agregar padrino
        </button>
      </div>
      <div class="col-md-12">
        <label class="form-label">Padres</label>
        <input v-model="form.padres" type="text" class="form-control">
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ContratoFormState } from '@/types/contrato';

defineProps<{
  form: ContratoFormState;
  telefonoInvalido: boolean;
  onTelefonoInput: (e: Event) => void;
}>();

const emit = defineEmits<{
  (e: 'agregar-padrino'): void;
  (e: 'quitar-padrino', idx: number): void;
}>();

function agregarPadrino() {
  emit('agregar-padrino');
}

function quitarPadrino(idx: number) {
  emit('quitar-padrino', idx);
}
</script>
