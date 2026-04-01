<template>
  <section class="contrato-form-section">
    <h6 class="contrato-form-section-title"><i class="fa-solid fa-calendar-day me-2"></i>Evento</h6>
    <div class="row g-3">
      <div class="col-12">
        <label class="form-label">Tipo de evento <span class="text-danger">*</span></label>
        <select v-model="tipoEventoSelect" class="form-select" :required="!mostrarTipoEventoOtro">
          <option value="">Selecciona un tipo</option>
          <option v-for="t in TIPOS_EVENTO" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>
      <div v-if="mostrarTipoEventoOtro" class="col-12">
        <label class="form-label">¿Cuál? <span class="text-danger">*</span></label>
        <input v-model="form.tipo_evento_otro" type="text" class="form-control"
          placeholder="Especifica el tipo de evento/servicio" required>
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
import { computed, ref, watch } from 'vue';
import type { ContratoFormState } from '@/types/contrato';
import { OTRO_SERVICIO, OTRO_TIPO_DE_EVENTO, TIPOS_EVENTO } from '@/data/tiposEvento';

const props = defineProps<{
  form: ContratoFormState;
}>();

const tipoEventoSelect = ref<string>('');

const mostrarTipoEventoOtro = computed(() => {
  return (
    tipoEventoSelect.value === OTRO_TIPO_DE_EVENTO ||
    tipoEventoSelect.value === OTRO_SERVICIO ||
    (tipoEventoSelect.value === '' && !!props.form.tipo_evento_otro.trim())
  );
});

function normalizarDesdeTipoEventoActual() {
  const actual = (props.form.tipo_evento || '').trim();
  if (!actual) {
    // Mantener lo que el usuario traiga en "otro" (si aplica)
    if (!props.form.tipo_evento_otro.trim()) tipoEventoSelect.value = '';
    return;
  }

  const estaEnCatalogo = (TIPOS_EVENTO as readonly string[]).includes(actual);
  if (estaEnCatalogo) {
    tipoEventoSelect.value = actual;
    if (actual !== OTRO_TIPO_DE_EVENTO && actual !== OTRO_SERVICIO) {
      props.form.tipo_evento_otro = '';
    }
    return;
  }

  // Valor existente fuera del catálogo: select por defecto y guardamos el real en "otro"
  tipoEventoSelect.value = '';
  props.form.tipo_evento_otro = actual;
  props.form.tipo_evento = '';
}

watch(
  () => props.form.tipo_evento,
  () => {
    normalizarDesdeTipoEventoActual();
  },
  { immediate: true }
);

watch(tipoEventoSelect, (nuevo) => {
  if (!nuevo) {
    // No forzamos limpiar "otro": permite editar valores ya existentes fuera de catálogo
    props.form.tipo_evento = '';
    return;
  }

  props.form.tipo_evento = nuevo;
  if (nuevo !== OTRO_TIPO_DE_EVENTO && nuevo !== OTRO_SERVICIO) {
    props.form.tipo_evento_otro = '';
  }
});
</script>
