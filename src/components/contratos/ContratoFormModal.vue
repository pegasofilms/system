<template>
  <div ref="modalEl" class="modal fade" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
      <div class="modal-content modal-pegaso">
        <div class="modal-header modal-header-pegaso">
          <div class="d-flex align-items-center gap-2 w-100">
            <span class="modal-header-pegaso-icon">
              <i class="fa-solid fa-pen-to-square"></i>
            </span>
            <h5 class="modal-title mb-0">
              {{ esEdicion ? 'Editar contrato' : 'Nuevo contrato' }}
            </h5>
            <button type="button" class="btn-close btn-close-white ms-auto" data-bs-dismiss="modal" aria-label="Cerrar"
              @click="cerrar"></button>
          </div>
        </div>
        <div class="modal-body">
          <form ref="formEl" @submit.prevent="submit">
            <EventoSection :form="form" />
            <ClienteSection :form="form" :telefono-invalido="telefonoInvalido" :on-telefono-input="onTelefonoInput"
              @agregar-padrino="agregarPadrino" @quitar-padrino="quitarPadrino" />
            <NotasSection :form="form" />
            <CotizacionSection :form="form" />
            <PresupuestoSection :form="form" />
            <VideosSection :form="form" />

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
import { ref, watch, reactive, computed, onBeforeUnmount } from 'vue';
import { Modal } from 'bootstrap';
import { limpiarBackdropModal } from '@/utils/modalCleanup';
import type { Contrato, ContratoFormPayload, PadrinoEntry, VideoEntry, CotizacionData } from '@/types/contrato';
import { parsePadrinos, parseVideosEnlaces } from '@/utils/contratoFormatters';
import {
  EventoSection,
  ClienteSection,
  NotasSection,
  CotizacionSection,
  PresupuestoSection,
  VideosSection,
} from './ContratoFormSection';

function parseCotizacion(s: string | null): CotizacionData {
  if (!s?.trim()) return {};
  try {
    return JSON.parse(s) as CotizacionData;
  } catch {
    return {};
  }
}

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

function normalizarTelefono(val: string): string {
  const soloNumeros = (val || '').replace(/\D/g, '');
  return soloNumeros.slice(0, 10);
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
    cotizacion: {
      horas_grabacion: null as number | null,
      horas_transmision: null as number | null,
      dias_grabacion: null as number | null,
      plataforma_transmision: null as 'facebook' | 'youtube' | null,
      subir_video: false,
      modalidad_video: null as 'privado' | 'publico' | null,
      entregar_memoria: false
    } as CotizacionData & {
      horas_grabacion: number | null;
      horas_transmision: number | null;
      dias_grabacion: number | null;
    },
    _id: null as number | null
  });

const form = defaultForm();

const telefonoInvalido = computed(() => {
  const t = (form.telefono || '').replace(/\D/g, '');
  if (t.length === 0) return false;
  return t.length !== 10;
});

function onTelefonoInput(e: Event) {
  const target = e.target as HTMLInputElement;
  form.telefono = normalizarTelefono(target.value);
}

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
  form.cotizacion = {
    horas_grabacion: null,
    horas_transmision: null,
    dias_grabacion: null,
    plataforma_transmision: null,
    subir_video: false,
    modalidad_video: null,
    entregar_memoria: false
  };
  form._id = null;
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
  const cot = parseCotizacion(c.cotizacion ?? null);
  form.cotizacion = {
    horas_grabacion: cot.horas_grabacion ?? null,
    horas_transmision: cot.horas_transmision ?? null,
    dias_grabacion: cot.dias_grabacion ?? null,
    plataforma_transmision: cot.plataforma_transmision ?? null,
    subir_video: !!cot.subir_video,
    modalidad_video: cot.modalidad_video ?? null,
    entregar_memoria: !!cot.entregar_memoria
  };
  form._id = c.id;
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
    notas: form.notas || null,
    cotizacion: (() => {
      const c = form.cotizacion;
      const hasAny =
        c.horas_grabacion != null ||
        c.horas_transmision != null ||
        c.dias_grabacion != null ||
        c.plataforma_transmision ||
        c.subir_video ||
        c.modalidad_video ||
        c.entregar_memoria;
      return hasAny ? JSON.stringify({
        horas_grabacion: c.horas_grabacion ?? null,
        horas_transmision: c.horas_transmision ?? null,
        dias_grabacion: c.dias_grabacion ?? null,
        plataforma_transmision: c.plataforma_transmision ?? null,
        subir_video: c.subir_video,
        modalidad_video: c.modalidad_video ?? null,
        entregar_memoria: c.entregar_memoria
      }) : null;
    })()
  };
  if (props.esEdicion && form._id != null) {
    payload.id = form._id;
  }
  emit('submit', payload, props.esEdicion);
}
</script>

<style scoped>
.contrato-form-footer-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  padding-top: 1rem;
  margin-top: 0.5rem;
  border-top: 1px solid #dee2e6;
}
</style>
