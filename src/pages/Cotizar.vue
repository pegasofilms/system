<template>
  <div class="cotizar-page">
    <nav class="navbar navbar-expand-lg navbar-light py-3 bg-white navbar-pegaso">
      <div class="container d-flex justify-content-between align-items-center">
        <router-link class="navbar-brand d-flex align-items-center" to="/">
          <img :src="logoPath" :alt="EMPRESA.nombre" width="40" height="40" class="d-inline-block align-text-top me-2">
          <strong>{{ EMPRESA.nombre }}</strong>
        </router-link>
        <router-link to="/" class="btn btn-outline-secondary btn-sm">
          <i class="fa-solid fa-arrow-left me-1"></i>
          Volver
        </router-link>
      </div>
    </nav>

    <div class="container my-2">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card shadow-lg border-0">
            <div class="card-header bg-primary text-center py-2">
              <img :src="logoPath" :alt="EMPRESA.nombre" width="60" height="60">
              <h2 class="h3 fw-bold mb-0 text-primary">Cotizar</h2>
              <p class="mb-0 mt-2 small opacity-75 text-primary">Elige tipo de evento, lugar y paquete. Te mostramos un precio estimado.</p>
            </div>
            <div class="card-body p-4 p-md-5">
              <form @submit.prevent="handleSubmit">
                <h5 class="fw-bold mb-3 text-primary">
                  <i class="fa-solid fa-calendar-check me-2"></i>
                  Información para la cotización
                </h5>

                <div class="mb-3">
                  <label for="tipo_evento" class="form-label fw-semibold">Tipo de Evento <span class="text-danger">*</span></label>
                  <select class="form-select" id="tipo_evento" v-model="formData.tipo_evento" required>
                    <option value="">Selecciona un tipo</option>
                    <option v-for="t in TIPOS_EVENTO" :key="t" :value="t">{{ t }}</option>
                  </select>
                </div>

                <div v-if="formData.tipo_evento !== 'Otro'" class="mb-3">
                  <label for="lugar" class="form-label fw-semibold">Municipio (Oaxaca) <span class="text-danger">*</span></label>
                  <select class="form-select" id="lugar" v-model="formData.lugar" required :disabled="loadingMunicipios">
                    <option value="">{{ loadingMunicipios ? 'Cargando...' : 'Selecciona un municipio' }}</option>
                    <option v-for="m in municipios" :key="m" :value="m">{{ m }}</option>
                  </select>
                </div>

                <!-- Videoclip / Videos comerciales: solo municipio (precio fijo $3000 + viático) -->
                <template v-if="formData.tipo_evento === 'Videoclip' || formData.tipo_evento === 'Videos comerciales'">
                  <p class="small text-muted">{{ formData.tipo_evento }}: $3,000 MXN + viático según municipio.</p>
                </template>

                <!-- Otro: select de servicio -->
                <div v-else-if="formData.tipo_evento === 'Otro'" class="mb-3">
                  <label for="otro_servicio" class="form-label fw-semibold">Servicio <span class="text-danger">*</span></label>
                  <select class="form-select" id="otro_servicio" v-model="formData.otro_servicio" required>
                    <option value="">Selecciona un servicio</option>
                    <option value="Spots publicitario|600">Spots publicitario — $600</option>
                    <option value="Anuncios en nuestras plataformas|500">Anuncios en nuestras plataformas — $500</option>
                    <option value="Flayers|400">Flayers — $400</option>
                    <option value="Diseño de logos|850">Diseño de logos — $850</option>
                    <option value="Asistencia técnica|">Asistencia técnica (sin estimado)</option>
                  </select>
                </div>

                <!-- Paquete y horas solo para eventos que no son Videoclip, Videos comerciales ni Otro -->
                <div v-else class="mb-3">
                  <label for="paquete" class="form-label fw-semibold">Paquete Deseado <span class="text-danger">*</span></label>
                  <select class="form-select" id="paquete" v-model="formData.paquete" required>
                    <option value="">Selecciona un paquete</option>
                    <option value="Solo transmisión">Solo Transmisión</option>
                    <option value="Solo grabación">Solo Grabación</option>
                    <option value="Ambos (Transmisión + Grabación)">Ambos (Transmisión + Grabación)</option>
                  </select>
                </div>

                <div v-if="(formData.paquete === 'Solo grabación' || formData.paquete === 'Ambos (Transmisión + Grabación)') && formData.tipo_evento !== 'Videoclip' && formData.tipo_evento !== 'Videos comerciales' && formData.tipo_evento !== 'Otro'" class="mb-3">
                  <label for="horas_grabacion" class="form-label fw-semibold">Horas de grabación (estimadas) <span class="text-danger">*</span></label>
                  <select class="form-select" id="horas_grabacion" v-model="formData.horas_grabacion" :required="formData.paquete === 'Solo grabación' || formData.paquete === 'Ambos (Transmisión + Grabación)'">
                    <option value="">Selecciona horas</option>
                    <option value="1">1 hora</option>
                    <option value="2">2 horas</option>
                    <option value="3">3 horas</option>
                    <option value="4">4 horas</option>
                    <option value="5">5 horas</option>
                    <option value="6">6 horas</option>
                    <option value="8">8 horas</option>
                    <option value="10">10 horas</option>
                    <option value="12">12 horas</option>
                    <option value="mas">Más de 12 horas</option>
                  </select>
                </div>

                <div v-if="(formData.paquete === 'Solo transmisión' || formData.paquete === 'Ambos (Transmisión + Grabación)') && formData.tipo_evento !== 'Videoclip' && formData.tipo_evento !== 'Videos comerciales' && formData.tipo_evento !== 'Otro'" class="mb-3">
                  <label for="horas_envivo" class="form-label fw-semibold">Horas de transmisión en vivo <span class="text-danger">*</span></label>
                  <select class="form-select" id="horas_envivo" v-model="formData.horas_envivo" :required="formData.paquete === 'Solo transmisión' || formData.paquete === 'Ambos (Transmisión + Grabación)'">
                    <option value="">Selecciona horas</option>
                    <option v-if="formData.paquete === 'Ambos (Transmisión + Grabación)'" value="0">No aplica</option>
                    <option value="1">1 hora</option>
                    <option value="2">2 horas</option>
                    <option value="3">3 horas</option>
                    <option value="4">4 horas</option>
                    <option value="5">5 horas</option>
                    <option value="6">6 horas</option>
                    <option value="8">8 horas</option>
                    <option value="10">10 horas</option>
                    <option value="12">12 horas</option>
                    <option value="mas">Más de 12 horas</option>
                  </select>
                </div>

                <div v-if="errorMessage" class="alert alert-danger" role="alert">
                  <i class="fa-solid fa-exclamation-triangle me-2"></i>
                  {{ errorMessage }}
                </div>

                <div class="d-grid gap-2 mt-4">
                  <button type="submit" class="btn btn-primary btn-lg py-3" :disabled="loading">
                    <i v-if="!loading" class="fa-solid fa-calculator me-2"></i>
                    <span v-if="!loading">Ver precio estimado</span>
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
import { ref, reactive, onMounted } from 'vue';
import Swal from 'sweetalert2';
import { EMPRESA } from '@/data/empresa';
import { getMunicipiosOaxaca } from '@/data/municipiosOaxaca';
import { TIPOS_EVENTO } from '@/data/tiposEvento';
import { getWhatsAppCotizacionUrl } from '@/utils/whatsappService';

const logoPath = `${import.meta.env.BASE_URL}img/logo.png`;

const formData = reactive({
  tipo_evento: '',
  lugar: '',
  paquete: '',
  horas_grabacion: '',
  horas_envivo: '',
  otro_servicio: ''
});

const municipios = ref<string[]>([]);
const loadingMunicipios = ref(true);
const loading = ref(false);
const errorMessage = ref('');

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

/** Viáticos por municipio: Nopala $100; San Gabriel, Temaxcaltepec, San Juan Lachao, San Pedro $200; Otro $1000; demás $500 */
function getViatico(lugar: string): number {
  if (!lugar) return 0;
  if (lugar === 'Santos Reyes Nopala') return 200;
  if (lugar === 'Otro') return 1500;
  const doscientos = [
    'San Gabriel Mixtepec',
    'Santa María Temaxcaltepec',
    'San Juan Lachao',
    'San Pedro Mixtepec -Dto. 22 -',
    'San Pedro Mixtepec -Dto. 26 -'
  ];
  if (doscientos.includes(lugar)) return 300;
  return 800;
}

/** Precios para "Otro" (servicio|precio o servicio|vacío si sin estimado) */
const PRECIOS_OTRO: Record<string, number> = {
  'Spots publicitario|600': 600,
  'Anuncios en nuestras plataformas|500': 500,
  'Videos comerciales|1600': 1600,
  'Flayers|400': 400,
  'Diseño de logos|850': 850
};

/**
 * Reglas: Videoclip $3000+viático. Otro: servicios con precio fijo + viático.
 * Grabación 1h=$1000, 2h=$700/h, 3h=$600/h, 4+h=$500/h. Bailes y Jaripeos +$100/h.
 * En vivo: 1h=$800, 2h=$1200, 3h=$1800, 4+h=$500/h.
 */
function calcularPrecioEstimado(): { total: number; texto: string; desglose: string[] } {
  const desglose: string[] = [];
  let total = 0;
  const tipo = formData.tipo_evento;
  const viatico = getViatico(formData.lugar);

  // Videoclip / Videos comerciales: solo $3000 + viático
  if (tipo === 'Videoclip' || tipo === 'Videos comerciales') {
    total = 3000 + viatico;
    desglose.push(`${tipo}: $3,000`);
    if (viatico > 0) desglose.push(`Viático (${formData.lugar}): $${viatico}`);
    const texto = `$${total.toLocaleString('es-MX')} MXN (solo estimación). Para un precio real, envía la cotización por WhatsApp.`;
    return { total, texto, desglose };
  }

  // Otro: solo servicio (sin municipio ni viático)
  if (tipo === 'Otro') {
    const sel = formData.otro_servicio;
    if (!sel) {
      return { total: 0, texto: 'Selecciona un servicio.', desglose: [] };
    }
    const precio = PRECIOS_OTRO[sel];
    const nombreServicio = sel.split('|')[0];
    if (precio !== undefined) {
      total = precio;
      desglose.push(`${nombreServicio}: $${precio}`);
    } else {
      total = 0;
      desglose.push(`${nombreServicio}: Consultar (sin estimado)`);
    }
    const texto = total > 0
      ? `$${total.toLocaleString('es-MX')} MXN (solo estimación). Para un precio real, envía la cotización por WhatsApp.`
      : 'Consultar con nosotros. Envía la cotización por WhatsApp para un precio real.';
    return { total, texto, desglose };
  }

  const paquete = formData.paquete;
  const esBaileOJaripeo = tipo === 'Baile' || tipo === 'Jaripeo';

  // Grabación (si aplica)
  const hGrab = formData.horas_grabacion;
  if ((paquete === 'Solo grabación' || paquete === 'Ambos (Transmisión + Grabación)') && hGrab) {
    const horas = hGrab === 'mas' ? 12 : parseInt(hGrab, 10);
    let subtotal = 0;
    if (horas === 1) subtotal = 1000;
    else if (horas === 2) subtotal = 700 * 2;
    else if (horas === 3) subtotal = 600 * 3;
    else subtotal = 500 * horas;
    if (esBaileOJaripeo) {
      const extra = 100 * horas;
      subtotal += extra;
      desglose.push(`Grabación ${horas}h: $${subtotal - extra} + Baile/Jaripeo $100/h: $${extra}`);
    } else {
      desglose.push(`Grabación ${horas}h: $${subtotal}`);
    }
    total += subtotal;
  }

  // En vivo (si aplica)
  const hEnvivo = formData.horas_envivo;
  if ((paquete === 'Solo transmisión' || paquete === 'Ambos (Transmisión + Grabación)') && hEnvivo && hEnvivo !== '0') {
    const horas = hEnvivo === 'mas' ? 12 : parseInt(hEnvivo, 10);
    let subtotal = 0;
    if (horas === 1) subtotal = 800;
    else if (horas === 2) subtotal = 1200;
    else if (horas === 3) subtotal = 1800;
    else subtotal = 500 * horas;
    desglose.push(`En vivo ${horas}h: $${subtotal}`);
    total += subtotal;
  }

  // Viáticos (eventos con paquete)
  if (viatico > 0) {
    desglose.push(`Viático (${formData.lugar}): $${viatico}`);
    total += viatico;
  }

  if (total === 0) {
    return { total: 0, texto: 'Selecciona al menos horas de grabación o en vivo según tu paquete.', desglose: [] };
  }

  const texto = `$${total.toLocaleString('es-MX')} MXN (solo estimación). Para un precio real, envía la cotización por WhatsApp.`;
  return { total, texto, desglose };
}

const handleSubmit = () => {
  errorMessage.value = '';
  loading.value = true;

  const resultado = calcularPrecioEstimado();
  const { texto, desglose, total } = resultado;
  const precioParaWhatsApp = desglose.length > 0 ? `Total estimado: $${total.toLocaleString('es-MX')} MXN. ${desglose.join(' | ')}` : texto;
  const esVideoclipOComercial = formData.tipo_evento === 'Videoclip' || formData.tipo_evento === 'Videos comerciales';
  const whatsAppUrl = getWhatsAppCotizacionUrl({
    tipo_evento: formData.tipo_evento,
    lugar: formData.tipo_evento === 'Otro' ? undefined : formData.lugar,
    paquete: esVideoclipOComercial ? undefined : formData.paquete,
    horas_grabacion: esVideoclipOComercial ? undefined : formData.horas_grabacion,
    horas_envivo: esVideoclipOComercial ? undefined : formData.horas_envivo,
    otro_servicio: formData.tipo_evento === 'Otro' ? formData.otro_servicio : undefined,
    precioEstimado: precioParaWhatsApp
  });

  loading.value = false;

  const desgloseHtml = desglose.length > 0 ? `<ul class="text-start small mb-2">${desglose.map((d) => `<li>${d}</li>`).join('')}</ul>` : '';

  Swal.fire({
    icon: 'info',
    title: 'Precio estimado',
    html: `
      ${desgloseHtml}
      <p class="fs-5 fw-bold text-dark mb-2">${texto}</p>
      <p class="small text-muted mb-0">Este total es solo una estimación. Para asegurar un precio real, envía la cotización por WhatsApp.</p>
    `,
    showCancelButton: true,
    confirmButtonText: 'Enviar cotización por WhatsApp',
    cancelButtonText: 'Cerrar',
    confirmButtonColor: '#25D366',
    cancelButtonColor: '#6c757d'
  }).then((res) => {
    if (res.isConfirmed) {
      window.open(whatsAppUrl, '_blank', 'noopener,noreferrer');
    }
  });
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
</style>
