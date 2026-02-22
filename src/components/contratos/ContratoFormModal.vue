<template>
  <div ref="modalEl" class="modal fade" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
      <div class="modal-content contrato-form-modal">
        <div class="modal-header contrato-form-header">
          <div class="d-flex align-items-center gap-2 w-100">
            <span class="contrato-form-icon">
              <i class="fa-solid fa-pen-to-square"></i>
            </span>
            <h5 class="modal-title mb-0">
              {{ esEdicion ? 'Editar contrato' : 'Nuevo contrato' }}
            </h5>
            <button type="button" class="btn-close btn-close-white ms-auto" data-bs-dismiss="modal" aria-label="Cerrar" @click="cerrar"></button>
          </div>
        </div>
        <div class="modal-body">
          <form ref="formEl" @submit.prevent="submit">
            <section class="contrato-form-section">
              <h6 class="contrato-form-section-title"><i class="fa-solid fa-calendar-day me-2"></i>Evento</h6>
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label">Tipo de evento <span class="text-danger">*</span></label>
                  <select v-model="form.tipo_evento" class="form-select" required>
                    <option value="">Selecciona un tipo</option>
                    <option v-for="t in TIPOS_EVENTO" :key="t" :value="t">{{ t }}</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Fecha del evento <span class="text-danger">*</span></label>
                  <div class="contrato-form-date-wrap">
                    <i class="fa-solid fa-calendar-check contrato-form-input-icon"></i>
                    <input v-model="form.fecha_evento" type="date" class="form-control contrato-form-date" required>
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Hora</label>
                  <div class="contrato-form-time-wrap">
                    <i class="fa-solid fa-clock contrato-form-input-icon"></i>
                    <input v-model="form.hora_evento" type="time" class="form-control contrato-form-time">
                  </div>
                </div>
                <div class="col-12">
                  <label class="form-label">Lugar</label>
                  <input v-model="form.lugar" type="text" class="form-control" placeholder="Municipio o dirección">
                </div>
              </div>
            </section>

            <section class="contrato-form-section">
              <h6 class="contrato-form-section-title"><i class="fa-solid fa-user me-2"></i>Cliente</h6>
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label">Contratante</label>
                  <input v-model="form.contratante" type="text" class="form-control">
                </div>
                <div class="col-12">
                  <label class="form-label">Teléfono</label>
                  <input
                    :value="form.telefono"
                    type="tel"
                    class="form-control"
                    :class="{ 'is-invalid': telefonoInvalido }"
                    placeholder="10 dígitos (ej. 9541234567)"
                    maxlength="10"
                    inputmode="numeric"
                    pattern="[0-9]*"
                    @input="onTelefonoInput"
                  >
                  <div v-if="telefonoInvalido" class="invalid-feedback">El teléfono debe tener exactamente 10 dígitos.</div>
                </div>
                <div class="col-md-12">
                  <label class="form-label">Festejado</label>
                  <input v-model="form.festejado" type="text" class="form-control">
                </div>
                <div class="col-12">
                  <label class="form-label">Padrinos</label>
                  <div v-for="(p, idx) in form.padrinosLista" :key="idx" class="padrino-row mb-2 d-flex flex-wrap gap-2 align-items-end">
                    <div class="flex-grow-1" style="min-width: 140px;">
                      <label class="form-label small mb-0">¿Padrino o madrina de qué?</label>
                      <input v-model="p.deQue" type="text" class="form-control form-control-sm" placeholder="Ej. anillos, lazo, velación">
                    </div>
                    <div class="flex-grow-1" style="min-width: 140px;">
                      <label class="form-label small mb-0">Nombre</label>
                      <input v-model="p.nombre" type="text" class="form-control form-control-sm" placeholder="Nombre completo">
                    </div>
                    <button type="button" class="btn btn-outline-danger btn-sm" title="Quitar" @click="quitarPadrino(idx)">
                      <i class="fa-solid fa-minus"></i>
                    </button>
                  </div>
                  <button type="button" class="btn btn-outline-primary btn-sm mt-1" @click="agregarPadrino">
                    <i class="fa-solid fa-plus me-1"></i>Agregar padrino
                  </button>
                </div>
                <div class="col-md-12">
                  <label class="form-label">Padres</label>
                  <input v-model="form.padres" type="text" class="form-control">
                </div>
              </div>
            </section>

            <section class="contrato-form-section">
              <h6 class="contrato-form-section-title"><i class="fa-solid fa-note-sticky me-2"></i>Notas</h6>
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label">Descripción</label>
                  <textarea v-model="form.descripcion" class="form-control" rows="2" placeholder="Detalles del evento"></textarea>
                </div>
                <div class="col-12">
                  <label class="form-label">Notas internas</label>
                  <textarea v-model="form.notas" class="form-control" rows="2" placeholder="Recordatorios, observaciones"></textarea>
                </div>
              </div>
            </section>

            <section class="contrato-form-section">
              <h6 class="contrato-form-section-title"><i class="fa-solid fa-money-bill-wave me-2"></i>Presupuesto</h6>
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label">Paquete</label>
                  <select v-model="form.paquete" class="form-select">
                    <option value="">—</option>
                    <option value="Solo transmisión">Solo transmisión</option>
                    <option value="Solo grabación">Solo grabación</option>
                    <option value="Ambos (Transmisión + Grabación)">Ambos</option>
                  </select>
                </div>
                <div class="col-6">
                  <label class="form-label">Precio</label>
                  <input v-model.number="form.precio" type="number" step="0.01" min="0" class="form-control">
                </div>
                <div class="col-6">
                  <label class="form-label">Anticipo</label>
                  <input v-model.number="form.anticipo" type="number" step="0.01" min="0" class="form-control">
                </div>
                <div class="col-6">
                  <label class="form-label">Memoria entregada</label>
                  <div class="form-check">
                    <input v-model="form.memoria_entregada" type="checkbox" class="form-check-input" id="memoria">
                    <label class="form-check-label" for="memoria">Sí</label>
                  </div>
                </div>
                <div class="col-6">
                  <label class="form-label">Estado</label>
                  <select v-model="form.estado" class="form-select">
                    <option value="pendiente">Pendiente</option>
                    <option value="confirmado">Confirmado</option>
                    <option value="en_proceso">En proceso</option>
                    <option value="completado">Completado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
              </div>
            </section>

            <section class="contrato-form-section">
              <h6 class="contrato-form-section-title"><i class="fa-solid fa-video me-2"></i>Videos (enlaces)</h6>
              <div class="row g-2 mb-2">
                <div class="col-md-4">
                  <label class="form-label small mb-0">Nombre del video</label>
                  <input v-model="nuevoVideoNombre" type="text" class="form-control form-control-sm" placeholder="Ej. intro, comida, baile">
                </div>
                <div class="col-md-6">
                  <label class="form-label small mb-0">URL</label>
                  <input v-model="nuevoVideoUrl" type="url" class="form-control form-control-sm" placeholder="https://...">
                </div>
                <div class="col-md-2 d-flex align-items-end">
                  <button type="button" class="btn btn-outline-primary btn-sm w-100" @click="agregarVideo" :disabled="!nuevoVideoUrl.trim()">
                    <i class="fa-solid fa-plus me-1"></i>Agregar
                  </button>
                </div>
              </div>
              <div v-if="form.videosLista.length" class="d-flex flex-wrap gap-2">
                <span v-for="(v, idx) in form.videosLista" :key="idx" class="badge bg-light text-dark border border-secondary d-inline-flex align-items-center gap-1 py-2">
                  <span class="fw-semibold">{{ v.nombre || 'Sin nombre' }}</span>
                  <span class="text-muted">·</span>
                  <a :href="v.url" target="_blank" rel="noopener" class="text-dark text-decoration-none text-truncate" style="max-width: 180px;">{{ v.url }}</a>
                  <button type="button" class="btn-close btn-close-sm p-0 ms-1" style="font-size: 0.6rem;" @click="quitarVideo(idx)" aria-label="Quitar"></button>
                </span>
              </div>
            </section>

            <div class="contrato-form-footer-actions">
              <button type="button" class="btn btn-outline-secondary" @click="cerrar">Cancelar</button>
              <button type="submit" class="btn btn-primary" :disabled="(props.saving ?? false) || telefonoInvalido">
                {{ (props.saving ?? false) ? 'Guardando...' : (esEdicion ? 'Guardar cambios' : 'Crear contrato') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive, computed } from 'vue';
import { Modal } from 'bootstrap';
import type { Contrato, ContratoFormPayload, PadrinoEntry, VideoEntry } from '@/types/contrato';
import { TIPOS_EVENTO } from '@/data/tiposEvento';
import { parsePadrinos, parseVideosEnlaces } from '@/utils/contratoFormatters';

const props = defineProps<{
  show: boolean;
  esEdicion: boolean;
  contrato: Contrato | null;
  saving?: boolean;
}>();

const emit = defineEmits<{
  (e: 'cerrar'): void;
  (e: 'submit', payload: ContratoFormPayload & { id?: number }, isEdit: boolean): void;
}>();

const modalEl = ref<HTMLElement | null>(null);
const formEl = ref<HTMLFormElement | null>(null);
const nuevoVideoNombre = ref('');
const nuevoVideoUrl = ref('');

function normalizarTelefono(val: string): string {
  const soloNumeros = (val || '').replace(/\D/g, '');
  return soloNumeros.slice(0, 10);
}

const telefonoInvalido = computed(() => {
  const t = (form.telefono || '').replace(/\D/g, '');
  if (t.length === 0) return false;
  return t.length !== 10;
});

function onTelefonoInput(e: Event) {
  const target = e.target as HTMLInputElement;
  form.telefono = normalizarTelefono(target.value);
}

const defaultForm = () =>
  reactive({
    tipo_evento: '',
    fecha_evento: '',
    hora_evento: '',
    lugar: '',
    contratante: '',
    telefono: '',
    paquete: '',
    precio: null as number | null,
    anticipo: null as number | null,
    estado: 'pendiente',
    memoria_entregada: false,
    padrinosLista: [] as PadrinoEntry[],
    padres: '',
    festejado: '',
    videosLista: [] as VideoEntry[],
    descripcion: '',
    notas: '',
    _id: null as number | null
  });

const form = defaultForm();

function resetForm() {
  form.tipo_evento = '';
  form.fecha_evento = '';
  form.hora_evento = '';
  form.lugar = '';
  form.contratante = '';
  form.telefono = '';
  form.paquete = '';
  form.precio = null;
  form.anticipo = null;
  form.estado = 'pendiente';
  form.memoria_entregada = false;
  form.padrinosLista = [];
  form.padres = '';
  form.festejado = '';
  form.videosLista = [];
  form.descripcion = '';
  form.notas = '';
  form._id = null;
  nuevoVideoNombre.value = '';
  nuevoVideoUrl.value = '';
}

function loadContrato(c: Contrato) {
  form.tipo_evento = c.tipo_evento;
  form.fecha_evento = (c.fecha_evento || '').toString().slice(0, 10);
  form.hora_evento = c.hora_evento ? (c.hora_evento + '').slice(0, 5) : '';
  form.lugar = c.lugar || '';
  form.contratante = c.contratante || '';
  form.telefono = normalizarTelefono(c.telefono || '');
  form.paquete = c.paquete || '';
  form.precio = c.precio != null ? Number(c.precio) : null;
  form.anticipo = c.anticipo != null ? Number(c.anticipo) : null;
  form.estado = c.estado || 'pendiente';
  form.memoria_entregada = !!c.memoria_entregada;
  form.padrinosLista = parsePadrinos(c.padrinos || '');
  form.padres = c.padres || '';
  form.festejado = c.festejado || '';
  form.videosLista = parseVideosEnlaces(c.enlaces_videos || '');
  form.descripcion = c.descripcion || '';
  form.notas = c.notas || '';
  form._id = c.id;
  nuevoVideoNombre.value = '';
  nuevoVideoUrl.value = '';
}

let modalInstance: InstanceType<typeof Modal> | null = null;

watch(
  () => props.show,
  (visible) => {
    if (!modalEl.value) return;
    if (visible) {
      if (props.esEdicion && props.contrato) {
        loadContrato(props.contrato);
      } else {
        resetForm();
      }
      modalInstance?.dispose();
      modalInstance = new Modal(modalEl.value);
      modalInstance.show();
    } else {
      modalInstance?.hide();
    }
  }
);

function agregarVideo() {
  const url = nuevoVideoUrl.value.trim();
  if (url) {
    form.videosLista.push({
      nombre: nuevoVideoNombre.value.trim() || `Video ${form.videosLista.length + 1}`,
      url
    });
    nuevoVideoNombre.value = '';
    nuevoVideoUrl.value = '';
  }
}

function quitarVideo(idx: number) {
  form.videosLista.splice(idx, 1);
}

function agregarPadrino() {
  form.padrinosLista.push({ deQue: '', nombre: '' });
}

function quitarPadrino(idx: number) {
  form.padrinosLista.splice(idx, 1);
}

function cerrar() {
  modalInstance?.hide();
  emit('cerrar');
}

function submit() {
  if (telefonoInvalido.value) return;
  const payload: ContratoFormPayload & { id?: number } = {
    tipo_evento: form.tipo_evento,
    fecha_evento: form.fecha_evento,
    hora_evento: form.hora_evento || null,
    lugar: form.lugar || null,
    contratante: form.contratante || null,
    telefono: form.telefono || null,
    paquete: form.paquete || null,
    precio: form.precio ?? null,
    anticipo: form.anticipo ?? null,
    estado: form.estado,
    memoria_entregada: form.memoria_entregada,
    padrinos:
      form.padrinosLista.length && form.padrinosLista.some((p) => p.deQue.trim() || p.nombre.trim())
        ? JSON.stringify(form.padrinosLista.filter((p) => p.deQue.trim() || p.nombre.trim()))
        : null,
    padres: form.padres || null,
    festejado: form.festejado || null,
    enlaces_videos:
      form.videosLista.length && form.videosLista.some((v) => v.url.trim())
        ? JSON.stringify(form.videosLista.filter((v) => v.url.trim()))
        : null,
    descripcion: form.descripcion || null,
    notas: form.notas || null
  };
  if (props.esEdicion && form._id != null) {
    payload.id = form._id;
  }
  emit('submit', payload, props.esEdicion);
}
</script>

<style scoped>
.contrato-form-modal {
  border: none;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.15);
}

.contrato-form-header {
  background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
  color: #fff;
  padding: 1rem 1.25rem;
  border-bottom: none;
}

.contrato-form-icon {
  width: 2.5rem;
  height: 2.5rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.contrato-form-header .modal-title {
  font-size: 1.15rem;
  font-weight: 600;
}

.contrato-form-section {
  background: #f8f9fa;
  border-radius: 0.5rem;
  padding: 1rem 1.25rem;
  margin-bottom: 1rem;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  border: 2px solid #dee2e6;
}

.contrato-form-section-title {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  color: #6c757d;
  margin-bottom: 0.75rem;
  padding-bottom: 0.35rem;
  border-bottom: 1px solid #dee2e6;
}

/* Fecha y hora con icono y estilo mejorado */
.contrato-form-date-wrap,
.contrato-form-time-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.contrato-form-input-icon {
  position: absolute;
  left: 0.75rem;
  color: #6c757d;
  font-size: 0.95rem;
  pointer-events: none;
  z-index: 1;
}

.contrato-form-date,
.contrato-form-time {
  padding-left: 2.5rem;
  font-size: 1rem;
  min-height: 2.75rem;
  border-radius: 0.375rem;
  border: 1px solid #dee2e6;
  background-color: #fff;
}

.contrato-form-date:hover,
.contrato-form-time:hover {
  border-color: #86b7fe;
}

.contrato-form-date:focus,
.contrato-form-time:focus {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
  outline: 0;
}

/* Mejorar aspecto del input type="date" y type="time" en navegadores que lo permiten */
.contrato-form-date::-webkit-calendar-picker-indicator,
.contrato-form-time::-webkit-datetime-edit {
  opacity: 0.8;
}

.contrato-form-footer-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  padding-top: 1rem;
  margin-top: 0.5rem;
  border-top: 1px solid #dee2e6;
}
</style>
