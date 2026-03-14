<template>
  <div ref="modalEl" class="modal fade" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content modal-pegaso">
        <div class="modal-header modal-header-pegaso">
          <div class="d-flex align-items-center gap-2 w-100">
            <span class="modal-header-pegaso-icon">
              <i class="fa-solid fa-list-check"></i>
            </span>
            <h5 class="modal-title mb-0">
              {{ esEdicion ? 'Editar pendiente' : 'Nuevo pendiente' }}
            </h5>
            <button type="button" class="btn-close btn-close-white ms-auto" data-bs-dismiss="modal" aria-label="Cerrar"
              @click="cerrar"></button>
          </div>
        </div>
        <div class="modal-body">
          <form ref="formEl" @submit.prevent="submit">
            <div class="mb-3">
              <label class="form-label">Título <span class="text-danger">*</span></label>
              <input
                v-model="form.titulo"
                type="text"
                class="form-control"
                placeholder="Ej: Llamar a cliente"
                maxlength="255"
                required
              />
            </div>
            <div class="mb-3">
              <label class="form-label">Descripción (opcional)</label>
              <textarea
                v-model="form.descripcion"
                class="form-control"
                rows="3"
                placeholder="Detalles adicionales..."
              ></textarea>
            </div>
            <div class="pendiente-form-footer-actions">
              <button type="button" class="btn btn-outline-secondary" @click="cerrar">Cancelar</button>
              <button type="submit" class="btn btn-primary" :disabled="(props.saving ?? false) || !form.titulo.trim()">
                {{ (props.saving ?? false) ? 'Guardando...' : (esEdicion ? 'Guardar cambios' : 'Crear pendiente') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive, onBeforeUnmount } from 'vue';
import { Modal } from 'bootstrap';
import { limpiarBackdropModal } from '@/utils/modalCleanup';
import type { Pendiente, PendienteFormPayload } from '@/types/pendiente';

const props = defineProps<{
  show: boolean;
  esEdicion: boolean;
  pendiente: Pendiente | null;
  saving?: boolean;
}>();

const emit = defineEmits<{
  (e: 'cerrar'): void;
  (e: 'submit', payload: PendienteFormPayload, isEdit: boolean): void;
}>();

const modalEl = ref<HTMLElement | null>(null);
const formEl = ref<HTMLFormElement | null>(null);

const form = reactive({
  titulo: '',
  descripcion: ''
});

function resetForm() {
  form.titulo = '';
  form.descripcion = '';
}

function loadPendiente(p: Pendiente) {
  form.titulo = p.titulo || '';
  form.descripcion = p.descripcion || '';
}

let modalInstance: InstanceType<typeof Modal> | null = null;

watch(
  () => props.show,
  (visible) => {
    if (!modalEl.value) return;
    if (visible) {
      if (props.esEdicion && props.pendiente) {
        loadPendiente(props.pendiente);
      } else {
        resetForm();
      }
      modalInstance?.dispose();
      modalInstance = new Modal(modalEl.value, { backdrop: 'static', keyboard: false });
      modalInstance.show();
    } else {
      modalInstance?.hide();
    }
  }
);

onBeforeUnmount(() => {
  modalInstance?.dispose();
  modalInstance = null;
  limpiarBackdropModal();
});

function cerrar() {
  modalInstance?.hide();
  emit('cerrar');
}

function submit() {
  if (!form.titulo.trim()) return;
  const payload: PendienteFormPayload = {
    titulo: form.titulo.trim(),
    descripcion: form.descripcion.trim() || null
  };
  emit('submit', payload, props.esEdicion);
}
</script>

<style scoped>
.pendiente-form-footer-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  padding-top: 1rem;
  margin-top: 0.5rem;
  border-top: 1px solid #dee2e6;
}
</style>
