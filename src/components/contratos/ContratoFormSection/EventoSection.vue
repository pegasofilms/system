<template>
  <section class="contrato-form-section">
    <h6 class="contrato-form-section-title"><i class="fa-solid fa-calendar-day me-2"></i>Evento</h6>
    <div class="row g-3">
      <div class="col-12">
        <label class="form-label">Tipo de evento <span class="text-danger">*</span></label>
        <select v-model="form.tipo_evento" class="form-select" required>
          <option value="">Selecciona un tipo</option>
          <option v-for="t in TIPOS_EVENTO" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>
      <div class="col-md-6">
        <label class="form-label">Fecha del evento <span class="text-danger">*</span></label>
        <div class="contrato-form-date-wrap">
          <i class="fa-solid fa-calendar-check contrato-form-input-icon"></i>
          <input v-model="form.fecha_evento" type="date" class="form-control contrato-form-date" required>
        </div>
      </div>
      <div class="col-md-6">
        <label class="form-label">Hora</label>
        <div class="contrato-form-time-wrap">
          <i class="fa-solid fa-clock contrato-form-input-icon"></i>
          <input v-model="form.hora_evento" type="time" class="form-control contrato-form-time">
        </div>
      </div>
      <div class="col-12">
        <label class="form-label">Lugar</label>
        <input v-model="form.lugar" type="text" class="form-control" placeholder="Municipio o dirección">
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ContratoFormState } from '@/types/contrato';
import { TIPOS_EVENTO } from '@/data/tiposEvento';

defineProps<{
  form: ContratoFormState;
}>();
</script>
