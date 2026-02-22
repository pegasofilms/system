<template>
  <div class="table-responsive">
    <table class="table table-hover table-bordered bg-white align-middle contratos-table-desktop">
      <thead class="table-light">
        <tr>
          <th>Tipo evento</th>
          <th>Fecha</th>
          <th>Lugar</th>
          <th>Contratante</th>
          <th>Estado</th>
          <th class="text-end th-acciones">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in contratos" :key="c.id">
          <td>{{ c.tipo_evento }}</td>
          <td>{{ formatDate(c.fecha_evento) }}</td>
          <td>{{ c.lugar || '—' }}</td>
          <td>{{ c.contratante || '—' }}</td>
          <td><span :class="getEstadoBadgeClass(c.estado)">{{ formatEstado(c.estado) }}</span></td>
          <td>
            <ContratosAcciones
              :contrato="c"
              variant="desktop"
              @ver="$emit('ver', $event)"
              @editar="$emit('editar', $event)"
              @eliminar="$emit('eliminar', $event)"
              @sugerencia="$emit('sugerencia', $event)"
            />
          </td>
        </tr>
      </tbody>
    </table>
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
.contratos-table-desktop th {
  font-weight: 600;
}
.th-acciones {
  min-width: 220px;
}
.badge {
  font-size: 0.75rem;
}
</style>
