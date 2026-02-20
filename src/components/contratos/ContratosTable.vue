<template>
  <div>
    <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
      <h1 class="h4 fw-bold mb-0">Contratos</h1>
      <div class="d-flex flex-wrap align-items-center gap-2">
        <div class="d-flex align-items-center gap-2">
          <label class="small text-muted mb-0">Año</label>
          <select
            :value="filtroAnio"
            @change="$emit('update:filtro-anio', ($event.target as HTMLSelectElement).value)"
            class="form-select form-select-sm"
            style="max-width: 110px;"
          >
            <option value="">Todos</option>
            <option v-for="y in años" :key="y" :value="String(y)">{{ y }}</option>
          </select>
        </div>
        <div class="d-flex align-items-center gap-2">
          <label class="small text-muted mb-0">Mes</label>
          <select
            :value="filtroMes"
            @change="$emit('update:filtro-mes', ($event.target as HTMLSelectElement).value)"
            class="form-select form-select-sm"
            style="max-width: 140px;"
          >
            <option value="">Todos</option>
            <option v-for="m in meses" :key="m.value" :value="m.value">{{ m.nombre }}</option>
          </select>
        </div>
        <button type="button" class="btn btn-outline-secondary btn-sm" @click="onToggleVer">
          <i :class="filtroAnio ? 'fa-solid fa-list' : 'fa-solid fa-calendar-day'" class="me-1"></i>
          {{ filtroAnio ? 'Ver todos' : 'Ver mes actual' }}
        </button>
        <button type="button" class="btn btn-primary" @click="$emit('nuevo')">
          <i class="fa-solid fa-plus me-1"></i>Nuevo contrato
        </button>
        <button type="button" class="btn btn-outline-primary btn-sm" @click="$emit('actualizar')" :disabled="loading">
          <i class="fa-solid fa-sync-alt" :class="{ 'fa-spin': loading }"></i>
        </button>
      </div>
    </div>

    <div v-if="loading && contratos.length === 0" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-3 text-muted">Cargando contratos...</p>
    </div>

    <div v-else-if="errorMessage" class="alert alert-danger">
      <i class="fa-solid fa-exclamation-triangle me-2"></i>{{ errorMessage }}
    </div>

    <div v-else-if="contratos.length === 0" class="text-center py-5">
      <i class="fa-solid fa-folder-open fa-3x text-muted mb-3"></i>
      <p class="text-muted">{{ mensajeSinContratos }}</p>
    </div>

    <div v-else class="table-responsive">
      <table class="table table-hover table-bordered bg-white align-middle">
        <thead class="table-light">
          <tr>
            <th>Tipo evento</th>
            <th>Fecha</th>
            <th>Lugar</th>
            <th>Contratante</th>
            <th>Estado</th>
            <th class="text-end" style="width: 180px;">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in contratosOrdenados" :key="c.id">
            <td>{{ c.tipo_evento }}</td>
            <td>{{ formatDate(c.fecha_evento) }}</td>
            <td>{{ c.lugar || '—' }}</td>
            <td>{{ c.contratante || '—' }}</td>
            <td><span :class="getEstadoBadgeClass(c.estado)">{{ formatEstado(c.estado) }}</span></td>
            <td class="d-flex justify-content-end align-items-center gap-1">
              <button type="button" class="btn btn-sm btn-outline-info me-1" @click="$emit('ver', c)" title="Ver">
                <i class="fa-solid fa-eye"></i>
              </button>
              <button type="button" class="btn btn-sm btn-outline-primary me-1" @click="$emit('editar', c)" title="Editar">
                <i class="fa-solid fa-pen"></i>
              </button>
              <button type="button" class="btn btn-sm btn-outline-danger" @click="$emit('eliminar', c)" title="Eliminar">
                <i class="fa-solid fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Contrato } from '@/types/contrato';
import { formatDate, formatEstado, getEstadoBadgeClass } from '@/utils/contratoFormatters';

const props = defineProps<{
  contratos: Contrato[];
  loading: boolean;
  errorMessage: string;
  filtroAnio: string;
  filtroMes: string;
}>();

const MESES = [
  { value: '01', nombre: 'Enero' },
  { value: '02', nombre: 'Febrero' },
  { value: '03', nombre: 'Marzo' },
  { value: '04', nombre: 'Abril' },
  { value: '05', nombre: 'Mayo' },
  { value: '06', nombre: 'Junio' },
  { value: '07', nombre: 'Julio' },
  { value: '08', nombre: 'Agosto' },
  { value: '09', nombre: 'Septiembre' },
  { value: '10', nombre: 'Octubre' },
  { value: '11', nombre: 'Noviembre' },
  { value: '12', nombre: 'Diciembre' }
];

const meses = MESES;

const años = computed(() => {
  const actual = new Date().getFullYear();
  const lista: number[] = [];
  for (let y = actual; y >= actual - 10; y--) lista.push(y);
  return lista;
});

const nombreMesActual = computed(() => {
  const m = MESES.find((x) => x.value === props.filtroMes);
  return m ? m.nombre : '';
});

const mensajeSinContratos = computed(() => {
  if (!props.filtroAnio) return 'No hay contratos registrados.';
  if (!props.filtroMes) return `No hay contratos en ${props.filtroAnio}.`;
  return `No hay contratos en ${nombreMesActual.value} de ${props.filtroAnio}.`;
});

/** Más reciente primero, más antiguo al final */
const contratosOrdenados = computed(() => {
  return [...(props.contratos || [])].sort((a, b) => {
    const fa = a.fecha_evento || '';
    const fb = b.fecha_evento || '';
    return fa > fb ? -1 : fa < fb ? 1 : 0;
  });
});

const emit = defineEmits<{
  (e: 'update:filtro-anio', value: string): void;
  (e: 'update:filtro-mes', value: string): void;
  (e: 'clearFiltros'): void;
  (e: 'verMesActual'): void;
  (e: 'nuevo'): void;
  (e: 'actualizar'): void;
  (e: 'ver', c: Contrato): void;
  (e: 'editar', c: Contrato): void;
  (e: 'eliminar', c: Contrato): void;
}>();

function onToggleVer() {
  if (props.filtroAnio) emit('clearFiltros');
  else emit('verMesActual');
}
</script>

<style scoped>
.table th { font-weight: 600; }
.badge { font-size: 0.75rem; }
</style>
