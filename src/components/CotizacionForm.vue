<template>
  <div class="cotizar-page">
    <div class="container my-3">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="shadow-lg border-0 rounded-2">
            <div class="card-header bg-primary text-center py-2">
              <h2 class="h3 fw-bold mb-0 text-primary">Cotizar</h2>
              <p class="mb-0 mt-2 small opacity-75 text-primary">
                <span v-if="isAdmin">Ingresa los datos del evento y el teléfono del cliente para generar la cotización.</span>
                <span v-else>Elige tipo de evento, lugar y paquete. Te mostramos un precio estimado.</span>
              </p>
            </div>
            <div class="card-body p-4 p-md-5">
              <form @submit.prevent="handleSubmit">
                <h5 class="fw-bold mb-3 text-primary">
                  <i class="fa-solid fa-calendar-check me-2"></i>
                  Información para la cotización
                </h5>

                <div class="mb-3">
                  <label for="tipo_evento" class="form-label fw-semibold">Tipo de Evento <span
                      class="text-danger">*</span></label>
                  <select class="form-select" id="tipo_evento" v-model="formData.tipo_evento" required>
                    <option value="">Selecciona un tipo</option>
                    <option v-for="t in TIPOS_EVENTO" :key="t" :value="t">{{ t }}</option>
                  </select>
                </div>

                <div v-if="formData.tipo_evento !== OTRO_SERVICIO" class="mb-3">
                  <label for="lugar" class="form-label fw-semibold">Municipio (Oaxaca) <span
                      class="text-danger">*</span></label>
                  <select class="form-select" id="lugar" v-model="formData.lugar" required
                    :disabled="loadingMunicipios">
                    <option value="">{{ loadingMunicipios ? 'Cargando...' : 'Selecciona un municipio' }}</option>
                    <option v-for="m in municipios" :key="m" :value="m">{{ m }}</option>
                  </select>
                </div>

                <!-- Videoclip / Videos comerciales: solo municipio (precio fijo $3000 + viático) -->
                <template v-if="formData.tipo_evento === VIDEOCLIP || formData.tipo_evento === VIDEOS_COMERCIALES">
                  <p class="small text-muted">{{ formData.tipo_evento }}: $3,000 MXN + viático según municipio.</p>
                </template>

                <!-- Otro: select de servicio -->
                <div v-else-if="formData.tipo_evento === OTRO_SERVICIO" class="mb-3">
                  <label for="otro_servicio" class="form-label fw-semibold">Servicio <span
                      class="text-danger">*</span></label>
                  <select class="form-select" id="otro_servicio" v-model="formData.otro_servicio" required>
                    <option value="">Selecciona un servicio</option>
                    <option v-for="s in SERVICIOS_OTRO" :key="s.nombre"
                      :value="s.precio != null ? `${s.nombre}|${s.precio}` : `${s.nombre}|`">
                      {{ s.precio != null ? `${s.nombre} — $${s.precio}` : `${s.nombre} (sin estimado)` }}
                    </option>
                  </select>
                </div>

                <!-- Paquete y horas solo para eventos que no son Videoclip, Videos comerciales ni Otro -->
                <div v-else class="mb-3">
                  <label for="paquete" class="form-label fw-semibold">Paquete Deseado <span
                      class="text-danger">*</span></label>
                  <select class="form-select" id="paquete" v-model="formData.paquete" required>
                    <option value="">Selecciona un paquete</option>
                    <option v-for="p in PAQUETES" :key="p.value" :value="p.value">{{ p.label }}</option>
                  </select>
                  <p class="small text-muted mt-1 text-justify" v-if="PAQUETE_DESCRIPCIONES[formData.paquete]">
                    <i class="fa-solid fa-info-circle me-1"></i>
                    {{ PAQUETE_DESCRIPCIONES[formData.paquete] }}
                  </p>
                </div>


                <div
                  v-if="(formData.paquete === PAQUETE_SOLO_GRABACION || formData.paquete === PAQUETE_AMBOS) && formData.tipo_evento !== VIDEOCLIP && formData.tipo_evento !== VIDEOS_COMERCIALES && formData.tipo_evento !== OTRO_SERVICIO"
                  class="mb-3">
                  <label for="horas_grabacion" class="form-label fw-semibold">Horas de grabación (estimadas) <span
                      class="text-danger">*</span></label>
                  <select class="form-select" id="horas_grabacion" v-model="formData.horas_grabacion"
                    :required="formData.paquete === PAQUETE_SOLO_GRABACION || formData.paquete === PAQUETE_AMBOS">
                    <option value="">Selecciona horas</option>
                    <option v-for="h in 12" :key="h" :value="h">{{ h }} hora{{ h === 1 ? '' : 's' }}</option>
                    <option value="mas">Más de 12 horas</option>
                  </select>
                </div>

                <div
                  v-if="(formData.paquete === PAQUETE_SOLO_TRANSMISION || formData.paquete === PAQUETE_AMBOS) && formData.tipo_evento !== VIDEOCLIP && formData.tipo_evento !== VIDEOS_COMERCIALES && formData.tipo_evento !== OTRO_SERVICIO"
                  class="mb-3">
                  <label for="horas_envivo" class="form-label fw-semibold">Horas de transmisión en vivo <span
                      class="text-danger">*</span></label>
                  <select class="form-select" id="horas_envivo" v-model="formData.horas_envivo"
                    :required="formData.paquete === PAQUETE_SOLO_TRANSMISION || formData.paquete === PAQUETE_AMBOS">
                    <option value="">Selecciona horas</option>
                    <option v-if="formData.paquete === PAQUETE_AMBOS" value="0">No aplica</option>
                    <option v-for="h in 12" :key="h" :value="h">{{ h }} hora{{ h === 1 ? '' : 's' }}</option>
                    <option value="mas">Más de 12 horas</option>
                  </select>
                </div>

                <div v-if="mostrarDiasGrabacion" class="mb-3">
                  <label for="dias_grabacion" class="form-label fw-semibold">¿En cuántos días se divide el
                    evento?</label>
                  <select class="form-select" id="dias_grabacion" v-model="formData.dias_grabacion">
                    <option v-for="d in 7" :key="d" :value="d">{{ d }} {{ d === 1 ? 'día' : 'días' }}</option>
                  </select>
                  <p class="small text-muted mt-1 text-justify">
                    <i class="fa-solid fa-info-circle me-1"></i>
                    {{ TEXTO_DIAS_GRABACION }}
                  </p>
                </div>

                <div class="mb-3">
                  <label class="form-label fw-semibold">¿Ya ha contratado anteriormente un servicio con
                    nosotros?</label>
                  <div>
                    <div class="form-check form-check-inline">
                      <input class="form-check-input" type="radio" id="cliente_recurrente_no" value="no"
                        v-model="formData.cliente_recurrente" checked>
                      <label class="form-check-label" for="cliente_recurrente_no">No</label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input class="form-check-input" type="radio" id="cliente_recurrente_si" value="si"
                        v-model="formData.cliente_recurrente">
                      <label class="form-check-label" for="cliente_recurrente_si">Sí</label>
                    </div>
                  </div>
                </div>

                <div v-if="isAdmin" class="mb-3">
                  <label for="telefono_cliente" class="form-label fw-semibold">Teléfono del cliente (opcional)</label>
                  <input v-model="formData.telefono_cliente" type="tel" class="form-control" id="telefono_cliente"
                    placeholder="10 dígitos (ej. 9541234567)" maxlength="10" inputmode="numeric" pattern="[0-9]*">
                  <div class="form-text">Si ingresas un número, podrás enviar la cotización directamente por WhatsApp al cliente.</div>
                  <div v-if="formData.telefono_cliente && formData.telefono_cliente.replace(/\D/g, '').length > 0 && formData.telefono_cliente.replace(/\D/g, '').length !== 10" class="form-text text-danger">
                    El teléfono debe tener 10 dígitos.
                  </div>
                </div>

                <div v-if="errorMessage" class="alert alert-danger" role="alert">
                  <i class="fa-solid fa-exclamation-triangle me-2"></i>
                  {{ errorMessage }}
                </div>

                <div class="d-grid gap-2 mt-4">
                  <button type="submit" class="btn btn-primary" :disabled="loading">
                    <i v-if="!loading" class="fa-solid fa-calculator me-2"></i>
                    <span v-if="!loading">{{ isAdmin ? 'Generar cotización' : 'Ver precio estimado' }}</span>
                    <span v-else>Calculando...</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import Swal from 'sweetalert2';
import { getMunicipiosOaxaca } from '@/data/municipiosOaxaca';
import { TIPOS_EVENTO, SERVICIOS_OTRO } from '@/data/tiposEvento';
import { PAQUETES, PAQUETE_SOLO_TRANSMISION, PAQUETE_SOLO_GRABACION, PAQUETE_AMBOS, PAQUETE_DESCRIPCIONES, TEXTO_DIAS_GRABACION } from '@/data/paquetes';
import { OTRO_SERVICIO, VIDEOCLIP, VIDEOS_COMERCIALES } from '@/data/tiposEvento';
import { getWhatsAppCotizacionUrl } from '@/utils/whatsappService';
import { calcularPrecioEstimado } from '@/utils/cotizacionUtils';
import { useAuth } from '@/composables/useAuth';

const { isAuthenticated } = useAuth();
const isAdmin = computed(() => isAuthenticated.value);

const formData = reactive({
  tipo_evento: '',
  lugar: '',
  paquete: '',
  horas_grabacion: '',
  horas_envivo: '',
  otro_servicio: '',
  cliente_recurrente: '',
  dias_grabacion: '1',
  telefono_cliente: ''
});

const municipios = ref<string[]>([]);
const loadingMunicipios = ref(true);
const loading = ref(false);
const errorMessage = ref('');

/** Muestra el campo "días" cuando grabación o transmisión en vivo es más de 4 horas. */
const mostrarDiasGrabacion = computed(() => {
  if (formData.tipo_evento === VIDEOCLIP || formData.tipo_evento === VIDEOS_COMERCIALES || formData.tipo_evento === OTRO_SERVICIO) return false;
  const masDe4Grab = (formData.paquete === PAQUETE_SOLO_GRABACION || formData.paquete === PAQUETE_AMBOS) && (() => {
    const h = formData.horas_grabacion;
    if (!h) return false;
    if (h === 'mas') return true;
    return parseInt(h, 10) > 4;
  })();
  const masDe4Envivo = (formData.paquete === PAQUETE_SOLO_TRANSMISION || formData.paquete === PAQUETE_AMBOS) && formData.horas_envivo && formData.horas_envivo !== '0' && (() => {
    const h = formData.horas_envivo;
    if (h === 'mas') return true;
    return parseInt(h, 10) > 4;
  })();
  return masDe4Grab || masDe4Envivo;
});

onMounted(async () => {
  try {
    const list = await getMunicipiosOaxaca();
    municipios.value = [...list, 'Otro'];
  } catch {
    errorMessage.value = 'No se pudo cargar la lista de municipios.';
  } finally {
    loadingMunicipios.value = false;
  }
});

const handleSubmit = () => {
  errorMessage.value = '';
  loading.value = true;

  // Validar teléfono solo si se proporciona (no es obligatorio)
  if (isAdmin.value && formData.telefono_cliente) {
    const telefono = formData.telefono_cliente.replace(/\D/g, '');
    if (telefono.length > 0 && telefono.length !== 10) {
      errorMessage.value = 'El número de teléfono debe tener 10 dígitos.';
      loading.value = false;
      return;
    }
  }

  const resultado = calcularPrecioEstimado(formData);
  const { desglose, total } = resultado;

  if (total === 0 && desglose.length === 0) {
    Swal.fire({
      icon: 'info',
      title: 'Completa los datos',
      text: 'Selecciona tipo de evento, y según el paquete las horas de grabación o en vivo para ver el precio estimado.'
    });
    loading.value = false;
    return;
  }

  // Generar desglose enumerado para WhatsApp
  const desgloseEnumerado = desglose.length > 0
    ? desglose.map((item, index) => `${index + 1}. ${item}`).join('\n')
    : '';
  
  const precioParaWhatsApp = desglose.length > 0
    ? `${desgloseEnumerado}\n\n💰 Total estimado: $${total.toLocaleString('es-MX')} MXN`
    : `💰 Total estimado: $${total.toLocaleString('es-MX')} MXN`;
  
  const esVideoclipOComercial = formData.tipo_evento === VIDEOCLIP || formData.tipo_evento === VIDEOS_COMERCIALES;
  const telefonoDestino = isAdmin.value && formData.telefono_cliente ? formData.telefono_cliente.replace(/\D/g, '') : undefined;
  const descripcionPaquete = !esVideoclipOComercial && formData.tipo_evento !== OTRO_SERVICIO && formData.paquete 
    ? PAQUETE_DESCRIPCIONES[formData.paquete] 
    : undefined;
  const datosCotizacion: Parameters<typeof getWhatsAppCotizacionUrl>[0] = {
    tipo_evento: formData.tipo_evento,
    lugar: formData.tipo_evento === OTRO_SERVICIO ? undefined : formData.lugar,
    paquete: esVideoclipOComercial ? undefined : formData.paquete,
    descripcionPaquete: descripcionPaquete,
    horas_grabacion: esVideoclipOComercial ? undefined : formData.horas_grabacion,
    horas_envivo: esVideoclipOComercial ? undefined : formData.horas_envivo,
    otro_servicio: formData.tipo_evento === OTRO_SERVICIO ? formData.otro_servicio : undefined,
    precioEstimado: precioParaWhatsApp,
    isAdmin: isAdmin.value
  };
  if (telefonoDestino) {
    datosCotizacion.telefono = telefonoDestino;
  }
  const whatsAppUrl = getWhatsAppCotizacionUrl(datosCotizacion);

  loading.value = false;

  const desgloseHtml = desglose.length > 0
    ? `<ul class="text-start mb-3 ps-3">${desglose.map((d) => `<li class="mb-1">${d}</li>`).join('')}</ul>`
    : '';

  // Verificar si hay un número de teléfono válido
  const telefonoValido = isAdmin.value && telefonoDestino && telefonoDestino.length === 10;
  
  const textoModal = isAdmin.value 
    ? (telefonoValido 
        ? 'Precio estimado. Envía esta cotización al cliente por WhatsApp.'
        : 'Precio estimado. Agrega un número de teléfono válido (10 dígitos) para enviar la cotización directamente.')
    : 'Precio de referencia. Envíanos tu cotización por WhatsApp para confirmar el precio final.';
  
  const textoBoton = isAdmin.value 
    ? '<i class="fa-brands fa-whatsapp me-2"></i> Enviar al cliente'
    : '<i class="fa-brands fa-whatsapp me-2"></i> Enviar por WhatsApp';

  Swal.fire({
    icon: undefined,
    showClass: { popup: 'swal2-show' },
    title: 'Precio estimado',
    html: `
      <div class="text-start">
        ${desgloseHtml}
        <p class="mb-2 fs-4 fw-bold text-primary">$${total.toLocaleString('es-MX')} MXN</p>
        <p class="small text-muted mb-0">${textoModal}</p>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: textoBoton,
    cancelButtonText: 'Cerrar',
    confirmButtonColor: telefonoValido || !isAdmin.value ? '#198754' : '#6c757d',
    cancelButtonColor: '#6c757d',
    allowOutsideClick: true
  }).then((res) => {
    if (res.isConfirmed && (telefonoValido || !isAdmin.value)) {
      window.open(whatsAppUrl, '_blank', 'noopener,noreferrer');
    }
  });
  
  // Deshabilitar el botón si es admin y no hay teléfono válido
  if (isAdmin.value && !telefonoValido) {
    setTimeout(() => {
      const confirmButton = document.querySelector('.swal2-confirm') as HTMLButtonElement;
      if (confirmButton) {
        confirmButton.disabled = true;
        confirmButton.style.opacity = '0.6';
        confirmButton.style.cursor = 'not-allowed';
      }
    }, 100);
  }
};
</script>

<style scoped>
.cotizar-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.card {
  border-radius: 12px;
}

.card-header {
  border-radius: 12px 12px 0 0 !important;
}

.form-control:focus,
.form-select:focus {
  border-color: #224a9d;
  box-shadow: 0 0 0 0.2rem rgba(34, 74, 157, 0.25);
}

.btn-primary {
  background-color: #224a9d;
  border-color: #224a9d;
}

.btn-primary:hover {
  background-color: #1b294d;
  border-color: #1b294d;
}

.text-danger {
  color: #dc3545 !important;
}

/* Compensar altura del navbar fijo */
.cotizar-page {
  padding-top: 76px;
}
</style>
