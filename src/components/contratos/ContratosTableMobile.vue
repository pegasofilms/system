<template>
  <div class="contratos-cards">
    <div v-for="c in contratos" :key="c.id" class="card contratos-card mb-3 shadow-sm">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start gap-2 mb-2">
          <h6 class="card-title mb-0 text-primary">{{ c.tipo_evento }}</h6>
          <span :class="getEstadoBadgeClass(c.estado)">{{ formatEstado(c.estado) }}</span>
        </div>
        <p class="card-text small text-muted mb-1">
          <i class="fa-solid fa-calendar-day me-1"></i>{{ formatDate(c.fecha_evento) }}
        </p>
        <p class="card-text small text-muted mb-1">
          <i class="fa-solid fa-location-dot me-1"></i>{{ c.lugar || '—' }}
        </p>
        <p class="card-text small mb-3">
          <i class="fa-solid fa-user me-1"></i>{{ c.contratante || '—' }}
        </p>
        <ContratosAcciones
          :contrato="c"
          variant="mobile"
          @ver="$emit('ver', $event)"
          @editar="$emit('editar', $event)"
          @eliminar="$emit('eliminar', $event)"
          @sugerencia="$emit('sugerencia', $event)"
        />
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

defineEmits<{
  (e: 'ver', c: Contrato): void;
  (e: 'editar', c: Contrato): void;
  (e: 'eliminar', c: Contrato): void;
  (e: 'sugerencia', c: Contrato): void;
}>();
</script>

<style scoped>
.contratos-cards {
  padding-bottom: 0.5rem;
}
.contratos-card {
  border-radius: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.08);
  transition: none;
}
.contratos-card:hover {
  transform: none;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
}
.badge {
  font-size: 0.75rem;
}
</style>
