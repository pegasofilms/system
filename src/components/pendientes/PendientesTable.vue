<template>
  <div>
    <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
      <ul class="nav nav-tabs nav-tabs-pendientes">
        <li class="nav-item">
          <button
            type="button"
            class="nav-link"
            :class="{ active: tabActivo === 'pendientes' }"
            @click="tabActivo = 'pendientes'"
          >
            <i class="fa-regular fa-circle me-1"></i>Pendientes ({{ pendientesNoRealizados.length }})
          </button>
        </li>
        <li class="nav-item">
          <button
            type="button"
            class="nav-link"
            :class="{ active: tabActivo === 'realizadas' }"
            @click="tabActivo = 'realizadas'"
          >
            <i class="fa-solid fa-circle-check me-1"></i>Realizadas ({{ pendientesRealizados.length }})
          </button>
        </li>
      </ul>
      <div class="d-flex flex-wrap align-items-center gap-2">
        <button type="button" class="btn btn-primary btn-sm" @click="$emit('nuevo')">
          <i class="fa-solid fa-plus me-1"></i>Nuevo pendiente
        </button>
        <button type="button" class="btn btn-outline-secondary btn-sm" @click="$emit('actualizar')" :disabled="loading">
          <i class="fa-solid fa-sync-alt" :class="{ 'fa-spin': loading }"></i>
        </button>
      </div>
    </div>

    <div v-if="loading && pendientes.length === 0" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-3 text-muted">Cargando pendientes...</p>
    </div>

    <div v-else-if="errorMessage" class="alert alert-danger">
      <i class="fa-solid fa-exclamation-triangle me-2"></i>{{ errorMessage }}
    </div>

    <template v-else>
      <!-- Contenido según tab activo -->
      <div v-if="listaActiva.length === 0" class="text-center py-5 bg-light rounded">
        <i v-if="tabActivo === 'pendientes'" class="fa-solid fa-clipboard-list fa-2x text-muted mb-2"></i>
        <i v-else class="fa-solid fa-check-double fa-2x text-muted mb-2"></i>
        <p class="text-muted small mb-0">
          {{ tabActivo === 'pendientes' ? 'No hay pendientes. Añade uno con el botón «Nuevo pendiente».' : 'Cuando marques un pendiente como hecho, aparecerá aquí.' }}
        </p>
      </div>

      <template v-else>
        <!-- Desktop: tabla -->
        <div class="d-none d-md-block">
          <PendientesTableDesktop
            :pendientes="listaActiva"
            @ver="$emit('ver', $event)"
            @toggle="$emit('toggle', $event)"
            @editar="$emit('editar', $event)"
            @eliminar="$emit('eliminar', $event)"
          />
        </div>
        <!-- Móvil: tarjetas -->
        <div class="d-md-none">
          <PendientesTableMobile
            :pendientes="listaActiva"
            @ver="$emit('ver', $event)"
            @toggle="$emit('toggle', $event)"
            @editar="$emit('editar', $event)"
            @eliminar="$emit('eliminar', $event)"
          />
        </div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Pendiente } from '@/types/pendiente';
import PendientesTableDesktop from './PendientesTableDesktop.vue';
import PendientesTableMobile from './PendientesTableMobile.vue';

const props = defineProps<{
  pendientes: Pendiente[];
  pendientesNoRealizados: Pendiente[];
  pendientesRealizados: Pendiente[];
  loading: boolean;
  errorMessage: string;
}>();

defineEmits<{
  (e: 'nuevo'): void;
  (e: 'actualizar'): void;
  (e: 'ver', p: Pendiente): void;
  (e: 'toggle', p: Pendiente): void;
  (e: 'editar', p: Pendiente): void;
  (e: 'eliminar', p: Pendiente): void;
}>();

const tabActivo = ref<'pendientes' | 'realizadas'>('pendientes');

const listaActiva = computed(() => {
  return tabActivo.value === 'pendientes' ? props.pendientesNoRealizados : props.pendientesRealizados;
});
</script>

<style scoped>
.nav-tabs-pendientes {
  border-bottom: 1px solid #dee2e6;
}
.nav-tabs-pendientes .nav-link {
  border: 1px solid transparent;
  border-radius: 0.25rem 0.25rem 0 0;
  color: #6c757d;
  padding: 0.5rem 1rem;
}
.nav-tabs-pendientes .nav-link:hover {
  border-color: #e9ecef #e9ecef #dee2e6;
  color: #0d6efd;
}
.nav-tabs-pendientes .nav-link.active {
  color: #0d6efd;
  background-color: #fff;
  border-color: #dee2e6 #dee2e6 #fff;
  font-weight: 600;
}
</style>
