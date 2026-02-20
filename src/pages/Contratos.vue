<template>
  <div class="contratos-page">
    <nav class="navbar navbar-expand-lg navbar-light py-3 bg-white navbar-pegaso">
      <div class="container d-flex justify-content-between align-items-center">
        <router-link class="navbar-brand d-flex align-items-center" to="/">
          <img :src="logoPath" alt="PEGASO FILMS" width="40" height="40" class="d-inline-block align-text-top me-2">
          <strong>PEGASO FILMS</strong>
        </router-link>
        <div class="d-flex align-items-center gap-3">
          <span class="text-muted small">{{ currentUser?.nombre_completo || currentUser?.username }}</span>
          <button type="button" class="btn btn-outline-danger btn-sm" @click="handleLogout">
            <i class="fa-solid fa-sign-out-alt me-1"></i>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>

    <div class="container my-4">
      <ContratosTable
        :contratos="contratosFiltrados"
        :loading="loading"
        :error-message="errorMessage"
        v-model:filtro-anio="filtroAnio"
        v-model:filtro-mes="filtroMes"
        @clear-filtros="clearFiltros"
        @ver-mes-actual="verMesActual"
        @nuevo="openCreate"
        @actualizar="loadContratos"
        @ver="openVer"
        @editar="openEdit"
        @eliminar="confirmDelete"
      />
    </div>

    <ContratoViewModal
      :show="showModalVer"
      :contrato="contratoSeleccionado"
      @cerrar="showModalVer = false"
      @editar="cerrarVerYAbrirEditar"
    />

    <ContratoFormModal
      :show="showModalForm"
      :es-edicion="esEdicion"
      :contrato="contratoAEditar"
      :saving="saving"
      @cerrar="cerrarForm"
      @submit="onFormSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import Swal from 'sweetalert2';
import type { Contrato } from '@/types/contrato';
import type { ContratoFormPayload } from '@/types/contrato';
import { fetchContratos, createContrato, updateContrato, deleteContrato } from '@/services/contratosApi';
import { formatDate } from '@/utils/contratoFormatters';
import ContratosTable from '@/components/contratos/ContratosTable.vue';
import ContratoViewModal from '@/components/contratos/ContratoViewModal.vue';
import ContratoFormModal from '@/components/contratos/ContratoFormModal.vue';

const router = useRouter();
const { currentUser, clearSession, isAuthenticated } = useAuth();
const logoPath = `${import.meta.env.BASE_URL}img/logo.png`;

const contratos = ref<Contrato[]>([]);
const loading = ref(false);
const errorMessage = ref('');
const filtroAnio = ref('');
const filtroMes = ref('');
const showModalVer = ref(false);
const showModalForm = ref(false);
const contratoSeleccionado = ref<Contrato | null>(null);
const contratoAEditar = ref<Contrato | null>(null);
const esEdicion = ref(false);
const saving = ref(false);

const contratosFiltrados = computed(() => {
  const list = contratos.value;
  const anio = filtroAnio.value;
  const mes = filtroMes.value;
  if (!anio) return list;
  if (!mes) return list.filter((c) => (c.fecha_evento || '').startsWith(anio));
  return list.filter((c) => (c.fecha_evento || '').startsWith(`${anio}-${mes}`));
});

onMounted(() => {
  if (!isAuthenticated.value) {
    router.push('/login');
    return;
  }
  loadContratos();
});

function clearFiltros() {
  filtroAnio.value = '';
  filtroMes.value = '';
}

function verMesActual() {
  const n = new Date();
  filtroAnio.value = String(n.getFullYear());
  filtroMes.value = String(n.getMonth() + 1).padStart(2, '0');
}

async function loadContratos() {
  loading.value = true;
  errorMessage.value = '';
  const { data, error } = await fetchContratos();
  loading.value = false;
  if (error) {
    errorMessage.value = error.message;
    return;
  }
  contratos.value = data ?? [];
}

function openVer(c: Contrato) {
  contratoSeleccionado.value = c;
  showModalVer.value = true;
}

function openCreate() {
  contratoAEditar.value = null;
  esEdicion.value = false;
  showModalForm.value = true;
}

function openEdit(c: Contrato) {
  contratoAEditar.value = c;
  esEdicion.value = true;
  showModalForm.value = true;
}

function cerrarVerYAbrirEditar() {
  showModalVer.value = false;
  const c = contratoSeleccionado.value;
  if (c) {
    contratoAEditar.value = c;
    esEdicion.value = true;
    showModalForm.value = true;
  }
}

function cerrarForm() {
  showModalForm.value = false;
  contratoAEditar.value = null;
}

async function onFormSubmit(
  payload: ContratoFormPayload & { id?: number },
  isEdit: boolean
) {
  saving.value = true;
  errorMessage.value = '';

  if (isEdit && payload.id != null) {
    const { error } = await updateContrato(payload.id, payload);
    saving.value = false;
    if (error) {
      errorMessage.value = error.message;
      Swal.fire({ icon: 'error', title: 'Error al actualizar', text: error.message });
      return;
    }
    Swal.fire({ icon: 'success', title: 'Contrato actualizado', timer: 2000, showConfirmButton: false });
  } else {
    const userId = currentUser.value?.id;
    if (!userId) {
      saving.value = false;
      errorMessage.value = 'No se pudo identificar al usuario.';
      return;
    }
    const { error } = await createContrato({ ...payload, user_id: userId });
    saving.value = false;
    if (error) {
      errorMessage.value = error.message;
      Swal.fire({ icon: 'error', title: 'Error al crear', text: error.message });
      return;
    }
    Swal.fire({ icon: 'success', title: 'Contrato creado', timer: 2000, showConfirmButton: false });
  }

  cerrarForm();
  await loadContratos();
}

async function confirmDelete(c: Contrato) {
  const result = await Swal.fire({
    title: '¿Eliminar contrato?',
    html: `Se eliminará el contrato de <strong>${c.tipo_evento}</strong> (${formatDate(c.fecha_evento)}).`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Sí, eliminar'
  });
  if (!result.isConfirmed) return;

  const { error } = await deleteContrato(c.id);
  if (error) {
    errorMessage.value = error.message;
    Swal.fire({ icon: 'error', title: 'Error al eliminar', text: error.message });
    return;
  }
  // Quitar de la lista de inmediato (204 = eliminado en servidor)
  contratos.value = contratos.value.filter((x) => x.id !== c.id);
  Swal.fire({ icon: 'success', title: 'Eliminado', timer: 1500, showConfirmButton: false });
  await loadContratos(); // refrescar por si hay filtros o sincronización
}

function handleLogout() {
  clearSession();
  router.push('/login');
}
</script>

<style scoped>
.contratos-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}
</style>
