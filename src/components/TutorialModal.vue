<template>
  <Teleport to="body">
  <div ref="modalEl" class="modal fade" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
      <div class="modal-content modal-pegaso">
        <div class="modal-header modal-header-pegaso">
          <div class="d-flex align-items-center gap-2 w-100">
            <span class="modal-header-pegaso-icon"><i :class="iconClass"></i></span>
            <h5 class="modal-title mb-0 flex-grow-1">{{ titulo }}</h5>
            <button type="button" class="btn-close btn-close-white" aria-label="Cerrar" @click="cerrar"></button>
          </div>
        </div>
        <div class="modal-body">
          <component :is="componenteInstruccion" v-if="componenteInstruccion" />
          <p v-else class="text-muted mb-0">Tutorial no disponible.</p>
        </div>
      </div>
    </div>
  </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch, ref, onMounted, onUnmounted } from 'vue';
import { Modal } from 'bootstrap';
import { limpiarBackdropModal } from '@/utils/modalCleanup';
import type { Component } from 'vue';
import {
  CambiarContrasenaStarlink,
} from '@/components/instrucciones';

const props = withDefaults(
  defineProps<{
    show: boolean;
    tutorialId: string | null;
    titulo: string;
    icon?: string;
  }>(),
  { icon: 'fa-solid fa-book' }
);

const emit = defineEmits<{ (e: 'cerrar'): void }>();

const modalEl = ref<HTMLElement | null>(null);
let bsModal: Modal | null = null;

const MAPA_COMPONENTES: Record<string, Component> = {
  'cambiar-contrasena-starlink': CambiarContrasenaStarlink,
};

const iconClass = computed(() =>
  props.icon.startsWith('fa-') ? `fa ${props.icon}` : `fa fa-solid fa-${props.icon}`
);

const componenteInstruccion = computed(() =>
  props.tutorialId ? MAPA_COMPONENTES[props.tutorialId] ?? null : null
);

function cerrar() {
  emit('cerrar');
}

function open() {
  if (bsModal) bsModal.show();
}

function hide() {
  if (bsModal) bsModal.hide();
}

watch(
  () => props.show,
  (visible) => {
    if (visible) open();
    else hide();
  }
);

onMounted(() => {
  if (modalEl.value) {
    bsModal = new Modal(modalEl.value, { backdrop: 'static', keyboard: false });
    modalEl.value.addEventListener('hidden.bs.modal', () => emit('cerrar'));
    if (props.show) open();
  }
});

onUnmounted(() => {
  if (bsModal) {
    bsModal.dispose();
    bsModal = null;
  }
  limpiarBackdropModal();
});
</script>

<style scoped>
.modal-header-pegaso-icon {
  width: 2.5rem;
  height: 2.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.2);
}
</style>
