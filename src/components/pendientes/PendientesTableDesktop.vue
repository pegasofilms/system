<template>
  <div class="table-responsive">
    <table class="table table-hover table-bordered bg-white align-middle pendientes-table-desktop">
      <thead class="table-light">
        <tr>
          <th class="th-check"></th>
          <th>Título</th>
          <th>Descripción</th>
          <th>Creado por</th>
          <th>Agregado</th>
          <th class="text-end th-acciones">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in pendientes" :key="p.id" class="row-clickable" @click="$emit('ver', p)">
          <td class="align-middle">
            <button
              type="button"
              class="btn btn-link p-0 border-0 text-decoration-none"
              :class="p.realizado ? 'text-success' : 'text-secondary'"
              :title="p.realizado ? 'Marcar como no realizado' : 'Marcar como realizado'"
              @click.stop="$emit('toggle', p)"
            >
              <i :class="p.realizado ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle'" class="fa-lg"></i>
            </button>
          </td>
          <td class="align-middle">
            <span :class="{ 'text-decoration-line-through text-muted': p.realizado }">{{ p.titulo }}</span>
          </td>
          <td class="align-middle text-muted small">
            {{ p.descripcion || '—' }}
          </td>
          <td class="align-middle small">
            {{ formatCreador(p) }}
          </td>
          <td class="align-middle small text-muted">
            {{ formatAgregado(p.created_at) }}
          </td>
          <td class="align-middle">
            <div class="d-flex justify-content-end gap-1">
              <button type="button" class="btn btn-sm btn-outline-primary" title="Editar" @click.stop="$emit('editar', p)">
                <i class="fa-solid fa-pen"></i>
              </button>
              <button type="button" class="btn btn-sm btn-outline-danger" title="Eliminar" @click.stop="$emit('eliminar', p)">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { Pendiente } from '@/types/pendiente';
import { formatCreador, formatAgregado } from '@/utils/pendienteFormatters';

defineProps<{
  pendientes: Pendiente[];
}>();

defineEmits<{
  (e: 'ver', p: Pendiente): void;
  (e: 'toggle', p: Pendiente): void;
  (e: 'editar', p: Pendiente): void;
  (e: 'eliminar', p: Pendiente): void;
}>();
</script>

<style scoped>
.pendientes-table-desktop th {
  font-weight: 600;
}
.th-check {
  width: 48px;
}
.th-acciones {
  min-width: 120px;
}
.pendientes-table-desktop .btn-link:hover {
  opacity: 0.8;
}

.row-clickable {
  cursor: pointer;
}
</style>
