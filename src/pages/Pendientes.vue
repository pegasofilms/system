<template>
  <div class="pendientes-page">
    <Navbar />
    <div class="container my-2">
      <div class="row">
        <div class="col-12 d-flex align-items-center justify-content-between flex-wrap gap-2">
          <h1 class="h4 fw-bold mb-0 text-primary">Pendientes</h1>
          <span v-if="currentUser" class="text-muted small">
            <i class="fa-solid fa-user me-1"></i>
            {{ currentUser.nombre_completo }}
          </span>
        </div>
      </div>
    </div>

    <div class="container my-2">
      <PendientesTable
        :pendientes="pendientes"
        :pendientes-no-realizados="pendientesNoRealizados"
        :pendientes-realizados="pendientesRealizados"
        :loading="loading"
        :error-message="errorMessage"
        @nuevo="openCreate"
        @actualizar="loadPendientes"
        @ver="openView"
        @toggle="onToggle"
        @editar="openEdit"
        @eliminar="confirmDelete"
      />
    </div>

    <PendienteFormModal
      :show="showModalForm"
      :es-edicion="esEdicion"
      :pendiente="pendienteAEditar"
      :saving="saving"
      @cerrar="cerrarForm"
      @submit="onFormSubmit"
    />

    <PendienteViewModal
      :show="showModalView"
      :pendiente="pendienteAVer"
      @cerrar="cerrarView"
      @editar="openEdit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import Swal from 'sweetalert2';
import type { Pendiente } from '@/types/pendiente';
import type { PendienteFormPayload } from '@/types/pendiente';
import {
  fetchPendientes,
  createPendiente,
  updatePendiente,
  deletePendiente
} from '@/services/pendientesApi';
import Navbar from '@/components/Navbar.vue';
import PendientesTable from '@/components/pendientes/PendientesTable.vue';
import PendienteFormModal from '@/components/pendientes/PendienteFormModal.vue';
import PendienteViewModal from '@/components/pendientes/PendienteViewModal.vue';
import { limpiarBackdropModal } from '@/utils/modalCleanup';

const router = useRouter();
const { currentUser, isAuthenticated } = useAuth();

const pendientes = ref<Pendiente[]>([]);
const loading = ref(false);
const errorMessage = ref('');
const showModalForm = ref(false);
const showModalView = ref(false);
const pendienteAEditar = ref<Pendiente | null>(null);
const pendienteAVer = ref<Pendiente | null>(null);
const esEdicion = ref(false);
const saving = ref(false);

const pendientesNoRealizados = computed(() =>
  pendientes.value.filter((p) => !p.realizado)
);
const pendientesRealizados = computed(() =>
  pendientes.value.filter((p) => p.realizado)
);

onMounted(() => {
  if (!isAuthenticated.value) {
    router.push('/login');
    return;
  }
  loadPendientes();
});

onBeforeRouteLeave((_to, _from, next) => {
  if (showModalForm.value || showModalView.value) {
    showModalForm.value = false;
    showModalView.value = false;
    limpiarBackdropModal();
    next(false);
  } else {
    next();
  }
});

onBeforeUnmount(() => {
  limpiarBackdropModal();
});

async function loadPendientes() {
  loading.value = true;
  errorMessage.value = '';
  const { data, error } = await fetchPendientes();
  loading.value = false;
  if (error) {
    errorMessage.value = error.message;
    return;
  }
  pendientes.value = data ?? [];
}

function openCreate() {
  cerrarView();
  pendienteAEditar.value = null;
  esEdicion.value = false;
  showModalForm.value = true;
}

function openView(p: Pendiente) {
  pendienteAVer.value = p;
  showModalView.value = true;
}

function openEdit(p: Pendiente) {
  cerrarView();
  pendienteAEditar.value = p;
  esEdicion.value = true;
  showModalForm.value = true;
}

function cerrarForm() {
  showModalForm.value = false;
  pendienteAEditar.value = null;
}

function cerrarView() {
  showModalView.value = false;
  pendienteAVer.value = null;
}

async function onFormSubmit(payload: PendienteFormPayload, isEdit: boolean) {
  saving.value = true;
  errorMessage.value = '';

  if (isEdit && pendienteAEditar.value) {
    const { error } = await updatePendiente(pendienteAEditar.value.id, payload);
    saving.value = false;
    if (error) {
      errorMessage.value = error.message;
      Swal.fire({ icon: 'error', title: 'Error al actualizar', text: error.message });
      return;
    }
    Swal.fire({ icon: 'success', title: 'Pendiente actualizado', timer: 2000, showConfirmButton: false });
  } else {
    const userId = currentUser.value?.id;
    if (!userId) {
      saving.value = false;
      errorMessage.value = 'No se pudo identificar al usuario.';
      return;
    }
    const { error } = await createPendiente({
      ...payload,
      user_id: userId,
      realizado: false
    });
    saving.value = false;
    if (error) {
      errorMessage.value = error.message;
      Swal.fire({ icon: 'error', title: 'Error al crear', text: error.message });
      return;
    }
    Swal.fire({ icon: 'success', title: 'Pendiente creado', timer: 2000, showConfirmButton: false });
  }

  cerrarForm();
  await loadPendientes();
}

async function onToggle(p: Pendiente) {
  const nuevoEstado = !p.realizado;
  const { error } = await updatePendiente(p.id, { realizado: nuevoEstado });
  if (error) {
    errorMessage.value = error.message;
    Swal.fire({ icon: 'error', title: 'Error', text: error.message });
    return;
  }
  const idx = pendientes.value.findIndex((x) => x.id === p.id);
  if (idx !== -1) {
    pendientes.value[idx] = { ...pendientes.value[idx], realizado: nuevoEstado };
  } else {
    await loadPendientes();
  }
}

async function confirmDelete(p: Pendiente) {
  const result = await Swal.fire({
    title: '¿Eliminar pendiente?',
    html: `Se eliminará <strong>${escapeHtml(p.titulo)}</strong>.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Sí, eliminar'
  });
  if (!result.isConfirmed) return;

  const { error } = await deletePendiente(p.id);
  if (error) {
    errorMessage.value = error.message;
    Swal.fire({ icon: 'error', title: 'Error al eliminar', text: error.message });
    return;
  }
  pendientes.value = pendientes.value.filter((x) => x.id !== p.id);
  Swal.fire({ icon: 'success', title: 'Eliminado', timer: 1500, showConfirmButton: false });
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
</script>

<style scoped>
.pendientes-page {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding-top: 76px;
  padding-bottom: 1rem;
}
</style>
