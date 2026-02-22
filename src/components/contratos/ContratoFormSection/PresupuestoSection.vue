<template>
  <section class="contrato-form-section">
    <h6 class="contrato-form-section-title"><i class="fa-solid fa-money-bill-wave me-2"></i>Presupuesto</h6>
    <div class="row g-3">
      <div class="col-6">
        <label class="form-label">Precio</label>
        <input v-model.number="form.precio" type="number" step="0.01" min="0" class="form-control">
      </div>
      <div class="col-6">
        <label class="form-label">Anticipo</label>
        <input v-model.number="form.anticipo" type="number" step="0.01" min="0" class="form-control">
      </div>
      <div class="col-6">
        <label class="form-label">Memoria entregada</label>
        <div class="form-check">
          <input v-model="form.memoria_entregada" type="checkbox" class="form-check-input" id="memoria">
          <label class="form-check-label" for="memoria">Sí</label>
        </div>
      </div>
      <div class="col-6">
        <label class="form-label">Estado</label>
        <select v-model="form.estado" class="form-select">
          <option value="pendiente">Pendiente</option>
          <option value="confirmado">Confirmado</option>
          <option value="en_proceso">En proceso</option>
          <option value="completado">Completado</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ContratoFormState } from '@/types/contrato';

defineProps<{
  form: ContratoFormState;
}>();
</script>
