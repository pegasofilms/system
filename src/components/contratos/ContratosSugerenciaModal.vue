<template>
  <div ref="modalEl" class="modal fade" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Sugerencia de publicación</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar" @click="cerrar"></button>
        </div>
        <div class="modal-body">
          <p class="text-muted small mb-2">
            Copia este texto para usar como título o descripción en redes sociales
            <i class="fa-brands fa-facebook text-info mx-1"></i>
            <i class="fa-brands fa-youtube text-danger mx-1"></i>
            <i class="fa-solid fa-broadcast-tower text-danger mx-1"></i>
          </p>
          <textarea
            :value="contrato ? sugerenciaTituloRedes(contrato) : ''"
            class="form-control font-monospace mb-2"
            readonly
            rows="10"
          ></textarea>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-primary"
            :disabled="!contrato"
            title="Copiar"
            @click="contrato && copiarSugerencia(contrato)"
          >
            <i class="fa-solid fa-copy me-1"></i>Copiar
          </button>
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
import { sugerenciaTituloRedes } from '@/utils/contratoFormatters';

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

function copiarSugerencia(c: Contrato) {
  const texto = sugerenciaTituloRedes(c);
  if (!texto) return;
  navigator.clipboard?.writeText(texto).catch(() => {});
}
</script>
