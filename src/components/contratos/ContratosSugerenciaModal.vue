<template>
  <div ref="modalEl" class="modal fade" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Sugerencia de publicación</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar" @click="cerrar"></button>
        </div>
        <div class="modal-body">
          <label class="form-label small fw-semibold text-muted">Título (evento, festejado y lugar)</label>
          <textarea :value="contrato ? sugerenciaTituloVideo(contrato) : ''" class="form-control font-monospace mb-3"
            readonly rows="2"></textarea>
          <div class="d-flex justify-content-end mb-2">
            <button type="button" class="btn btn-sm btn-outline-primary" :disabled="!contrato" title="Copiar título"
              @click="contrato && copiarTitulo(contrato)">
              <i class="fa-solid fa-copy me-1"></i>Copiar
            </button>
          </div>
          <label class="form-label small fw-semibold text-muted">Descripción (padrinos, # y más)</label>
          <textarea :value="contrato ? sugerenciaDescripcionVideo(contrato) : ''"
            class="form-control font-monospace mb-2" readonly rows="6"></textarea>
          <div class="d-flex justify-content-end">
            <button type="button" class="btn btn-sm btn-outline-primary" :disabled="!contrato"
              title="Copiar descripción" @click="contrato && copiarDescripcion(contrato)">
              <i class="fa-solid fa-copy me-1"></i>Copiar
            </button>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="cerrar">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Modal } from 'bootstrap';
import type { Contrato } from '@/types/contrato';
import { sugerenciaTituloVideo, sugerenciaDescripcionVideo } from '@/utils/contratoFormatters';

const props = defineProps<{
  /** Si es distinto de null, el modal se muestra. */
  contrato: Contrato | null;
}>();

const emit = defineEmits<{
  (e: 'cerrar'): void;
}>();

const modalEl = ref<HTMLElement | null>(null);
let modalInstance: InstanceType<typeof Modal> | null = null;

watch(
  () => props.contrato,
  (c) => {
    if (!modalEl.value) return;
    if (c) {
      modalInstance?.dispose();
      modalInstance = new Modal(modalEl.value);
      modalInstance.show();
    } else {
      modalInstance?.hide();
    }
  }
);

watch(modalEl, (el) => {
  if (!el) return;
  el.addEventListener('hidden.bs.modal', () => emit('cerrar'));
});

function cerrar() {
  modalInstance?.hide();
  emit('cerrar');
}

function copiarTitulo(c: Contrato) {
  const texto = sugerenciaTituloVideo(c);
  if (!texto) return;
  navigator.clipboard?.writeText(texto).catch(() => { });
}

function copiarDescripcion(c: Contrato) {
  const texto = sugerenciaDescripcionVideo(c);
  if (!texto) return;
  navigator.clipboard?.writeText(texto).catch(() => { });
}
</script>
