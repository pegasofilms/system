<template>
  <div class="pendientes-cards">
    <div v-for="p in pendientes" :key="p.id" class="card pendiente-card mb-3 shadow-sm">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start gap-2">
          <button
            type="button"
            class="btn btn-link p-0 border-0 text-decoration-none flex-shrink-0"
            :class="p.realizado ? 'text-success' : 'text-secondary'"
            :title="p.realizado ? 'Marcar como no realizado' : 'Marcar como realizado'"
            @click.stop="$emit('toggle', p)"
          >
            <i :class="p.realizado ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle'" class="fa-lg"></i>
          </button>
          <div class="flex-grow-1 min-width-0">
            <h6 class="card-title mb-0 text-primary" :class="{ 'text-decoration-line-through text-muted': p.realizado }">
              {{ p.titulo }}
            </h6>
            <p v-if="p.descripcion" class="card-text small text-muted mb-1 mt-1">
              {{ truncate(p.descripcion, 80) }}
            </p>
            <p class="card-text small text-muted mb-1">
              <i class="fa-solid fa-user me-1"></i>{{ formatCreador(p) }}
            </p>
            <p class="card-text small text-muted mb-2">
              <i class="fa-solid fa-clock me-1"></i>{{ formatAgregado(p.created_at) }}
            </p>
          </div>
        </div>
        <div class="d-flex justify-content-end gap-1 mt-2">
          <button type="button" class="btn btn-sm btn-outline-primary" title="Editar" @click.stop="$emit('editar', p)">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button type="button" class="btn btn-sm btn-outline-danger" title="Eliminar" @click.stop="$emit('eliminar', p)">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Pendiente } from '@/types/pendiente';
import { formatCreador, formatAgregado } from '@/utils/pendienteFormatters';

defineProps<{
  pendientes: Pendiente[];
}>();

defineEmits<{
  (e: 'toggle', p: Pendiente): void;
  (e: 'editar', p: Pendiente): void;
  (e: 'eliminar', p: Pendiente): void;
}>();

function truncate(str: string, max: number): string {
  if (!str || str.length <= max) return str;
  return str.slice(0, max) + '…';
}
</script>

<style scoped>
.pendientes-cards {
  padding-bottom: 0.5rem;
}

.pendiente-card {
  border-radius: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.pendiente-card .btn-link:hover {
  opacity: 0.8;
}
</style>
