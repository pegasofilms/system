<template>
  <div ref="modalEl" class="modal fade" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
      <div class="modal-content modal-pegaso">
        <div class="modal-header modal-header-pegaso">
          <div class="d-flex align-items-center gap-2 w-100">
            <span class="modal-header-pegaso-icon">
              <i class="fa-solid fa-clipboard-list"></i>
            </span>
            <div class="flex-grow-1">
              <h5 class="modal-title mb-0">Detalle del pendiente</h5>
              <p class="mb-0 small opacity-90 mt-1">{{ formatAgregado(pendiente?.created_at) }}</p>
            </div>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"
              @click="cerrar"></button>
          </div>
        </div>
        <div v-if="pendiente" class="modal-body">
          <section class="pendiente-view-section">
            <h6 class="pendiente-view-section-title"><i class="fa-solid fa-circle-info me-2"></i>Información</h6>
            <div class="row g-2">
              <div class="col-sm-8">
                <div class="pendiente-view-field">
                  <span class="pendiente-view-label">Título</span>
                  <span class="pendiente-view-value">{{ pendiente.titulo }}</span>
                </div>
              </div>
              <div class="col-sm-4">
                <div class="pendiente-view-field">
                  <span class="pendiente-view-label">Estado</span>
                  <span class="pendiente-view-value">
                    {{ pendiente.realizado ? 'Realizado' : 'Pendiente' }}
                  </span>
                </div>
              </div>
              <div class="col-12">
                <div class="pendiente-view-field">
                  <span class="pendiente-view-label">Descripción</span>
                  <span class="pendiente-view-value">{{ pendiente.descripcion || '—' }}</span>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="pendiente-view-field">
                  <span class="pendiente-view-label">Creado por</span>
                  <span class="pendiente-view-value">{{ formatCreador(pendiente) }}</span>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="pendiente-view-field">
                  <span class="pendiente-view-label">Última actualización</span>
                  <span class="pendiente-view-value">{{ formatAgregado(pendiente.updated_at) }}</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div class="modal-footer pendiente-view-footer">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal" @click="cerrar">Cerrar</button>
          <button v-if="pendiente" type="button" class="btn btn-primary" @click="onEditar">
            <i class="fa-solid fa-pen me-1"></i>Editar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue';
import { Modal } from 'bootstrap';
import type { Pendiente } from '@/types/pendiente';
import { formatAgregado, formatCreador } from '@/utils/pendienteFormatters';
import { limpiarBackdropModal } from '@/utils/modalCleanup';

const props = defineProps<{
  show: boolean;
  pendiente: Pendiente | null;
}>();

const emit = defineEmits<{
  (e: 'cerrar'): void;
  (e: 'editar', p: Pendiente): void;
}>();

const modalEl = ref<HTMLElement | null>(null);
let modalInstance: InstanceType<typeof Modal> | null = null;

watch(
  () => props.show,
  (visible) => {
    if (!modalEl.value) return;
    if (visible) {
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

function onEditar() {
  if (!props.pendiente) return;
  modalInstance?.hide();
  emit('cerrar');
  emit('editar', props.pendiente);
}
</script>

<style scoped>
.pendiente-view-section {
  background: #f8f9fa;
  border-radius: 0.5rem;
  padding: 1rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid #dee2e6;
}

.pendiente-view-section-title {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  color: #6c757d;
  margin-bottom: 0.75rem;
  padding-bottom: 0.35rem;
  border-bottom: 1px solid #dee2e6;
}

.pendiente-view-field {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.pendiente-view-label {
  font-size: 0.75rem;
  color: #6c757d;
}

.pendiente-view-value {
  font-size: 0.95rem;
  color: #212529;
}

.pendiente-view-footer {
  background: #f8f9fa;
  border-top: 1px solid #dee2e6;
}
</style>
