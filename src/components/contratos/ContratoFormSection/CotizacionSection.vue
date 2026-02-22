<template>
  <section class="contrato-form-section">
    <h6 class="contrato-form-section-title"><i class="fa-solid fa-file-contract me-2"></i>Cotización / Servicio</h6>
    <p class="text-muted small mb-3">Detalle del servicio acordado (solo datos; no se calcula precio aquí).</p>
    <div class="row g-3">
      <div class="col-12">
        <label class="form-label">Paquete</label>
        <select v-model="form.paquete" class="form-select">
          <option value="">—</option>
          <option v-for="p in PAQUETES_CONTRATO" :key="p.value" :value="p.value">{{ p.label }}</option>
        </select>
      </div>
      <div v-if="form.paquete === PAQUETE_SOLO_GRABACION || form.paquete === PAQUETE_AMBOS" class="col-md-6">
        <label class="form-label">Horas grabación</label>
        <input type="number" min="0" step="1" class="form-control" placeholder="0"
          :value="form.cotizacion.horas_grabacion ?? ''" @input="form.cotizacion.horas_grabacion = numOrNull($event)">
      </div>
      <div v-if="form.paquete === PAQUETE_SOLO_TRANSMISION || form.paquete === PAQUETE_AMBOS" class="col-md-6">
        <label class="form-label">Horas transmisión</label>
        <input type="number" min="0" step="1" class="form-control" placeholder="0"
          :value="form.cotizacion.horas_transmision ?? ''"
          @input="form.cotizacion.horas_transmision = numOrNull($event)">
      </div>
      <div class="col-12">
        <label class="form-label">Días de grabación</label>
        <input type="number" min="0" step="1" class="form-control" placeholder="0"
          :value="form.cotizacion.dias_grabacion ?? ''" @input="form.cotizacion.dias_grabacion = numOrNull($event)">
      </div>
      <template v-if="form.paquete === PAQUETE_SOLO_TRANSMISION || form.paquete === PAQUETE_AMBOS">
        <div class="col-12">
          <label class="form-label">Plataforma de transmisión</label>
          <select v-model="form.cotizacion.plataforma_transmision" class="form-select">
            <option :value="null">—</option>
            <option value="facebook">Facebook</option>
            <option value="youtube">YouTube</option>
          </select>
        </div>
      </template>
      <template v-if="form.paquete === PAQUETE_SOLO_GRABACION || form.paquete === PAQUETE_AMBOS">
        <div class="col-md-6">
          <label class="form-label">Subir video</label>
          <div class="form-check">
            <input v-model="form.cotizacion.subir_video" type="checkbox" class="form-check-input" id="cotiz-subir">
            <label class="form-check-label" for="cotiz-subir">Sí</label>
          </div>
        </div>
        <div class="col-md-6">
          <label class="form-label">Modalidad del video</label>
          <select v-model="form.cotizacion.modalidad_video" class="form-select">
            <option :value="null">—</option>
            <option value="privado">Privado</option>
            <option value="publico">Público</option>
          </select>
        </div>
      </template>
      <div class="col-12">
        <label class="form-label">Entregar memoria</label>
        <div class="form-check">
          <input v-model="form.cotizacion.entregar_memoria" type="checkbox" class="form-check-input" id="cotiz-memoria">
          <label class="form-check-label" for="cotiz-memoria">Sí</label>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ContratoFormState } from '@/types/contrato';
import { PAQUETES_CONTRATO, PAQUETE_SOLO_GRABACION, PAQUETE_SOLO_TRANSMISION, PAQUETE_AMBOS } from '@/data/paquetes';

defineProps<{
  form: ContratoFormState;
}>();

function numOrNull(e: Event): number | null {
  const v = (e.target as HTMLInputElement).value;
  if (v === '' || v == null) return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
}
</script>
