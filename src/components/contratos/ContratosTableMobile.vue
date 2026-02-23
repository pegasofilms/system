<template>
  <div class="contratos-cards">
    <div v-for="c in contratos" :key="c.id" class="card contratos-card mb-3 shadow-sm" @click="handleCardClick(c)">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start gap-2">
          <h6 class="card-title mb-0 text-primary">{{ c.tipo_evento }}</h6>
          <span :class="getEstadoBadgeClass(c.estado)" class="mb-2 align-items-end">{{ formatEstado(c.estado) }}</span>
        </div>
        <p class="card-text small text-muted mb-1">
          <i class="fa-solid fa-calendar-day me-1"></i>{{ formatDate(c.fecha_evento) }}
        </p>
        <p class="card-text small text-muted mb-1">
          <i class="fa-solid fa-location-dot me-1"></i>{{ c.lugar || '—' }}
        </p>
        <p class="card-text small text-muted mb-2">
          <i class="fa-solid fa-user me-1"></i>{{ c.contratante || '—' }}
        </p>
        <p class="card-text d-flex justify-content-end">
          <ContratosAcciones :contrato="c" variant="mobile" @editar="handleEditar" @eliminar="handleEliminar"
            @sugerencia="handleSugerencia" />
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Contrato } from '@/types/contrato';
import { formatDate, formatEstado, getEstadoBadgeClass } from '@/utils/contratoFormatters';
import ContratosAcciones from './ContratosAcciones.vue';

defineProps<{
  contratos: Contrato[];
}>();

const emit = defineEmits<{
  (e: 'ver', c: Contrato): void;
  (e: 'editar', c: Contrato): void;
  (e: 'eliminar', c: Contrato): void;
  (e: 'sugerencia', c: Contrato): void;
}>();

function handleCardClick(contrato: Contrato) {
  emit('ver', contrato);
}

function handleEditar(contrato: Contrato) {
  emit('editar', contrato);
}

function handleEliminar(contrato: Contrato) {
  emit('eliminar', contrato);
}

function handleSugerencia(contrato: Contrato) {
  emit('sugerencia', contrato);
}
</script>

<style scoped>
.contratos-cards {
  padding-bottom: 0.5rem;
}

.contratos-card {
  border-radius: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.08);
  transition: none;
  cursor: pointer;
}

.contratos-card:hover {
  transform: none;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
}

.badge {
  font-size: 0.75rem;
}

.contrato-card-icon {
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: rgba(0, 36, 102, 0.5);
  font-size: 1.1rem;
  pointer-events: none;
}
</style>
