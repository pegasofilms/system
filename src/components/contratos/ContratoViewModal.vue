<template>
  <div ref="modalEl" class="modal fade" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
      <div class="modal-content contrato-view-modal">
        <div class="modal-header contrato-view-header">
          <div class="d-flex align-items-center gap-2 w-100">
            <span class="contrato-view-icon"><i class="fa-solid fa-file-contract"></i></span>
            <div class="flex-grow-1">
              <h5 class="modal-title mb-0">
                {{ tituloModal }}
              </h5>
              <p class="mb-0 small opacity-90 mt-1">
                {{ contrato ? formatDate(contrato.fecha_evento) : '' }}
                <span v-if="contrato?.lugar" class="ms-2">· {{ contrato.lugar }}</span>
              </p>
            </div>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar" @click="cerrar"></button>
          </div>
        </div>
        <div v-if="contrato" class="modal-body">
          <div class="contrato-view-badge mb-3">
            <span :class="getEstadoBadgeClass(contrato.estado)">{{ formatEstado(contrato.estado) }}</span>
          </div>

          <section class="contrato-view-section">
            <h6 class="contrato-view-section-title"><i class="fa-solid fa-calendar-day me-2"></i>Evento</h6>
            <div class="row g-2">
              <div class="col-sm-6">
                <div class="contrato-view-field">
                  <span class="contrato-view-label">Tipo</span>
                  <span class="contrato-view-value">{{ contrato.tipo_evento }}</span>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="contrato-view-field">
                  <span class="contrato-view-label">Hora</span>
                  <span class="contrato-view-value">{{ formatTime(contrato.hora_evento) }}</span>
                </div>
              </div>
              <div class="col-12">
                <div class="contrato-view-field">
                  <span class="contrato-view-label">Lugar</span>
                  <span class="contrato-view-value">{{ contrato.lugar || '—' }}</span>
                </div>
              </div>
            </div>
          </section>

          <section class="contrato-view-section">
            <h6 class="contrato-view-section-title"><i class="fa-solid fa-user me-2"></i>Cliente</h6>
            <div class="row g-2">
              <div class="col-sm-6">
                <div class="contrato-view-field">
                  <span class="contrato-view-label">Contratante</span>
                  <span class="contrato-view-value">{{ contrato.contratante || '—' }}</span>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="contrato-view-field">
                  <span class="contrato-view-label">Teléfono</span>
                  <span class="contrato-view-value">{{ contrato.telefono || '—' }}</span>
                </div>
              </div>
              <div class="col-12" v-if="contrato.padrinos || contrato.padres || contrato.festejado">
                <div class="contrato-view-field">
                  <span class="contrato-view-label">Padrinos / Padres / Festejado</span>
                  <span class="contrato-view-value">{{ [contrato.padrinos, contrato.padres, contrato.festejado].filter(Boolean).join(' · ') || '—' }}</span>
                </div>
              </div>
            </div>
          </section>

          <section class="contrato-view-section">
            <h6 class="contrato-view-section-title"><i class="fa-solid fa-money-bill-wave me-2"></i>Presupuesto</h6>
            <div class="row g-2">
              <div class="col-sm-4">
                <div class="contrato-view-field">
                  <span class="contrato-view-label">Paquete</span>
                  <span class="contrato-view-value">{{ contrato.paquete || '—' }}</span>
                </div>
              </div>
              <div class="col-sm-4">
                <div class="contrato-view-field">
                  <span class="contrato-view-label">Precio</span>
                  <span class="contrato-view-value fw-semibold">{{ formatCurrency(contrato.precio) }}</span>
                </div>
              </div>
              <div class="col-sm-4">
                <div class="contrato-view-field">
                  <span class="contrato-view-label">Anticipo</span>
                  <span class="contrato-view-value">{{ formatCurrency(contrato.anticipo) }}</span>
                </div>
              </div>
              <div class="col-12">
                <div class="contrato-view-field">
                  <span class="contrato-view-label">Memoria entregada</span>
                  <span class="contrato-view-value">{{ contrato.memoria_entregada ? 'Sí' : 'No' }}</span>
                </div>
              </div>
            </div>
          </section>

          <section class="contrato-view-section">
            <h6 class="contrato-view-section-title"><i class="fa-solid fa-video me-2"></i>Videos</h6>
            <div v-if="enlaces.length" class="d-flex flex-wrap gap-2">
              <a v-for="(enlace, i) in enlaces" :key="i" :href="enlace" target="_blank" rel="noopener" class="btn btn-sm btn-outline-primary contrato-view-video-btn">
                <i class="fa-solid fa-play me-1"></i>Video {{ i + 1 }}
              </a>
            </div>
            <p v-else class="text-muted small mb-0">Sin enlaces registrados</p>
          </section>

          <section class="contrato-view-section" v-if="contrato.descripcion || contrato.notas">
            <h6 class="contrato-view-section-title"><i class="fa-solid fa-note-sticky me-2"></i>Notas</h6>
            <p v-if="contrato.descripcion" class="contrato-view-note">{{ contrato.descripcion }}</p>
            <p v-if="contrato.notas" class="contrato-view-note mb-0">{{ contrato.notas }}</p>
          </section>

          <p class="text-muted small mt-3 mb-0">
            <i class="fa-solid fa-clock me-1"></i>Registrado: {{ formatDateTime(contrato.created_at) }}
          </p>
        </div>
        <div class="modal-footer flex-wrap gap-2 contrato-view-footer">
          <button
            v-if="contrato"
            type="button"
            class="btn btn-success"
            :disabled="!puedeEnviarVideos"
            :title="puedeEnviarVideos ? 'Abre WhatsApp con mensaje de entrega de videos al número del cliente' : 'Necesitas teléfono del cliente y al menos un enlace de video'"
            @click="enviarVideosAlCliente"
          >
            <i class="fa-brands fa-whatsapp me-1"></i>
            Enviar videos al cliente
          </button>
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal" @click="cerrar">Cerrar</button>
          <button type="button" class="btn btn-primary" @click="onEditar">
            <i class="fa-solid fa-pen me-1"></i>Editar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Modal } from 'bootstrap';
import type { Contrato } from '@/types/contrato';
import {
  formatDate,
  formatTime,
  formatDateTime,
  formatCurrency,
  formatEstado,
  getEstadoBadgeClass,
  parseEnlaces
} from '@/utils/contratoFormatters';
import { getWhatsAppEntregaVideosUrl } from '@/utils/whatsappService';

const props = defineProps<{
  show: boolean;
  contrato: Contrato | null;
}>();

const emit = defineEmits<{
  (e: 'cerrar'): void;
  (e: 'editar'): void;
}>();

const modalEl = ref<HTMLElement | null>(null);
let modalInstance: InstanceType<typeof Modal> | null = null;

const enlaces = computed(() => (props.contrato ? parseEnlaces(props.contrato.enlaces_videos) : []));

const tituloModal = computed(() => {
  if (!props.contrato) return 'Detalle del contrato';
  const tipo = props.contrato.tipo_evento || 'Contrato';
  const quien = props.contrato.contratante?.trim();
  return quien ? `${tipo} — ${quien}` : tipo;
});

const puedeEnviarVideos = computed(() => {
  if (!props.contrato) return false;
  const tel = (props.contrato.telefono || '').replace(/\D/g, '');
  return tel.length >= 10 && enlaces.value.length > 0;
});

watch(
  () => props.show,
  (visible) => {
    if (!modalEl.value) return;
    if (visible) {
      modalInstance?.dispose();
      modalInstance = new Modal(modalEl.value);
      modalInstance.show();
    } else {
      modalInstance?.hide();
    }
  }
);

function cerrar() {
  modalInstance?.hide();
  emit('cerrar');
}

function onEditar() {
  modalInstance?.hide();
  emit('cerrar');
  emit('editar');
}

function enviarVideosAlCliente() {
  if (!props.contrato) return;
  const url = getWhatsAppEntregaVideosUrl(props.contrato);
  if (url) window.open(url, '_blank', 'noopener,noreferrer');
}
</script>

<style scoped>
.contrato-view-modal {
  border: none;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.15);
}

.contrato-view-header {
  background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
  color: #fff;
  padding: 1rem 1.25rem;
  border-bottom: none;
}

.contrato-view-icon {
  width: 2.5rem;
  height: 2.5rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.contrato-view-header .modal-title {
  font-size: 1.15rem;
  font-weight: 600;
}

.contrato-view-badge {
  font-size: 0.85rem;
}

.contrato-view-section {
  background: #f8f9fa;
  border-radius: 0.5rem;
  padding: 1rem 1.25rem;
  margin-bottom: 1rem;
}

.contrato-view-section-title {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  color: #6c757d;
  margin-bottom: 0.75rem;
  padding-bottom: 0.35rem;
  border-bottom: 1px solid #dee2e6;
}

.contrato-view-field {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.contrato-view-label {
  font-size: 0.75rem;
  color: #6c757d;
}

.contrato-view-value {
  font-size: 0.95rem;
  color: #212529;
}

.contrato-view-video-btn {
  border-radius: 2rem;
}

.contrato-view-note {
  font-size: 0.9rem;
  color: #495057;
  margin-bottom: 0.5rem;
}

.contrato-view-footer {
  background: #f8f9fa;
  border-top: 1px solid #dee2e6;
  padding: 0.75rem 1.25rem;
}
</style>
