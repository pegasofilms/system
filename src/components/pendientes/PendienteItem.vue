<template>
  <div class="pendiente-item card shadow-sm mb-2">
    <div class="card-body py-2 px-3 d-flex align-items-center gap-2 flex-wrap">
      <button
        type="button"
        class="btn btn-link p-0 border-0 text-decoration-none flex-shrink-0"
        :class="pendiente.realizado ? 'text-success' : 'text-secondary'"
        :title="pendiente.realizado ? 'Marcar como no realizado' : 'Marcar como realizado'"
        @click.stop="$emit('toggle', pendiente)"
      >
        <i :class="pendiente.realizado ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle'" class="fa-lg"></i>
      </button>
      <div class="flex-grow-1 min-width-0">
        <span class="d-block text-break" :class="{ 'text-decoration-line-through text-muted': pendiente.realizado }">
          {{ pendiente.titulo }}
        </span>
        <span v-if="pendiente.descripcion" class="small text-muted d-block text-break">
          {{ truncate(pendiente.descripcion, 80) }}
        </span>
      </div>
      <div class="d-flex align-items-center gap-1 flex-shrink-0">
        <button
          type="button"
          class="btn btn-sm btn-outline-primary"
          title="Editar"
          @click.stop="$emit('editar', pendiente)"
        >
          <i class="fa-solid fa-pen"></i>
        </button>
        <button
          type="button"
          class="btn btn-sm btn-outline-danger"
          title="Eliminar"
          @click.stop="$emit('eliminar', pendiente)"
        >
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Pendiente } from '@/types/pendiente';

defineProps<{
  pendiente: Pendiente;
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
.pendiente-item {
  border-radius: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.08);
}
.pendiente-item .btn-link:hover {
  opacity: 0.8;
}
</style>
