<template>
  <section class="contrato-form-section">
    <h6 class="contrato-form-section-title"><i class="fa-solid fa-note-sticky me-2"></i>Notas</h6>
    <div class="row g-3">
      <div class="col-12">
        <label class="form-label">Descripción</label>
        <textarea v-model="form.descripcion" class="form-control" rows="2" placeholder="Detalles del evento"></textarea>
      </div>
      <div class="col-12">
        <label class="form-label">Notas internas</label>
        <textarea v-model="form.notas" class="form-control" rows="2"
          placeholder="Recordatorios, observaciones"></textarea>
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
