<template>
  <div class="contratar-page">
    <nav class="navbar navbar-expand-lg navbar-light py-3 bg-white navbar-pegaso">
      <div class="container d-flex justify-content-between align-items-center">
        <router-link class="navbar-brand d-flex align-items-center" to="/">
          <img :src="logoPath" alt="PEGASO FILMS" width="40" height="40" class="d-inline-block align-text-top me-2">
          <strong>PEGASO FILMS</strong>
        </router-link>
        <router-link to="/" class="btn btn-outline-secondary btn-sm">
          <i class="fa-solid fa-arrow-left me-1"></i>
          Volver
        </router-link>
      </div>
    </nav>

    <div class="container my-5">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card shadow-lg border-0">
            <div class="card-header bg-primary text-white text-center py-4">
              <img :src="logoPath" alt="PEGASO FILMS" width="60" height="60" class="mb-3">
              <h2 class="h3 fw-bold mb-0">Solicitar Cotización</h2>
              <p class="mb-0 mt-2 small opacity-75">Completa el formulario y nos pondremos en contacto contigo</p>
            </div>
            <div class="card-body p-4 p-md-5">
              <form @submit.prevent="handleSubmit">
                <!-- Información del Evento -->
                <h5 class="fw-bold mb-3 text-primary">
                  <i class="fa-solid fa-calendar-check me-2"></i>
                  Información del Evento
                </h5>

                <div class="row mb-3">
                  <div class="col-md-6 mb-3 mb-md-0">
                    <label for="tipo_evento" class="form-label fw-semibold">Tipo de Evento <span class="text-danger">*</span></label>
                    <select class="form-select" id="tipo_evento" v-model="formData.tipo_evento" required>
                      <option value="">Selecciona un tipo</option>
                      <option value="Boda">Boda</option>
                      <option value="Bautizo">Bautizo</option>
                      <option value="Cumpleaños">Cumpleaños</option>
                      <option value="Jaripeo">Jaripeo</option>
                      <option value="Baile">Baile</option>
                      <option value="Videoclip">Videoclip</option>
                      <option value="Evento en vivo">Evento en vivo</option>
                      <option value="Concierto">Concierto</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label for="fecha_evento" class="form-label fw-semibold">Fecha del Evento <span class="text-danger">*</span></label>
                    <input type="date" class="form-control" id="fecha_evento" v-model="formData.fecha_evento" required />
                  </div>
                </div>

                <div class="row mb-3">
                  <div class="col-md-6 mb-3 mb-md-0">
                    <label for="hora_evento" class="form-label fw-semibold">Hora del Evento</label>
                    <input type="time" class="form-control" id="hora_evento" v-model="formData.hora_evento" />
                  </div>
                  <div class="col-md-6">
                    <label for="lugar" class="form-label fw-semibold">Lugar del Evento</label>
                    <input type="text" class="form-control" id="lugar" v-model="formData.lugar" placeholder="Dirección o nombre del lugar" />
                  </div>
                </div>

                <div class="mb-3">
                  <label for="paquete" class="form-label fw-semibold">Paquete Deseado</label>
                  <select class="form-select" id="paquete" v-model="formData.paquete">
                    <option value="">Selecciona un paquete</option>
                    <option value="solo transmisión">Solo Transmisión</option>
                    <option value="solo grabación">Solo Grabación</option>
                    <option value="ambos">Ambos (Transmisión + Grabación)</option>
                  </select>
                </div>

                <div class="mb-3">
                  <label for="descripcion" class="form-label fw-semibold">Descripción del Evento</label>
                  <textarea class="form-control" id="descripcion" v-model="formData.descripcion" rows="3"
                    placeholder="Describe tu evento, duración aproximada, número de invitados, etc."></textarea>
                </div>

                <!-- Información del Contratante -->
                <h5 class="fw-bold mb-3 text-primary mt-4">
                  <i class="fa-solid fa-user me-2"></i>
                  Información del Contratante
                </h5>

                <div class="row mb-3">
                  <div class="col-md-6 mb-3 mb-md-0">
                    <label for="contratante" class="form-label fw-semibold">Nombre Completo <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="contratante" v-model="formData.contratante" required
                      placeholder="Tu nombre completo" />
                  </div>
                  <div class="col-md-6">
                    <label for="telefono" class="form-label fw-semibold">Teléfono <span class="text-danger">*</span></label>
                    <input type="tel" class="form-control" id="telefono" v-model="formData.telefono" required
                      placeholder="954 123 4567" />
                  </div>
                </div>

                <!-- Información Adicional (para eventos específicos) -->
                <h5 class="fw-bold mb-3 text-primary mt-4">
                  <i class="fa-solid fa-info-circle me-2"></i>
                  Información Adicional (Opcional)
                </h5>

                <div class="row mb-3">
                  <div class="col-md-6 mb-3 mb-md-0">
                    <label for="padrinos" class="form-label fw-semibold">Padrinos</label>
                    <input type="text" class="form-control" id="padrinos" v-model="formData.padrinos"
                      placeholder="Nombre de los padrinos" />
                  </div>
                  <div class="col-md-6">
                    <label for="padres" class="form-label fw-semibold">Padres</label>
                    <input type="text" class="form-control" id="padres" v-model="formData.padres"
                      placeholder="Nombre de los padres" />
                  </div>
                </div>

                <div class="mb-3">
                  <label for="festejado" class="form-label fw-semibold">Festejado</label>
                  <input type="text" class="form-control" id="festejado" v-model="formData.festejado"
                    placeholder="Nombre del festejado" />
                </div>

                <div class="mb-3">
                  <label for="precio" class="form-label fw-semibold">Presupuesto Estimado (Opcional)</label>
                  <input type="number" class="form-control" id="precio" v-model.number="formData.precio" step="0.01"
                    placeholder="0.00" min="0" />
                </div>

                <div class="mb-3">
                  <label for="notas" class="form-label fw-semibold">Notas Adicionales</label>
                  <textarea class="form-control" id="notas" v-model="formData.notas" rows="3"
                    placeholder="Cualquier información adicional que consideres importante"></textarea>
                </div>

                <!-- Mensajes de error y éxito -->
                <div v-if="errorMessage" class="alert alert-danger" role="alert">
                  <i class="fa-solid fa-exclamation-triangle me-2"></i>
                  {{ errorMessage }}
                </div>

                <div v-if="successMessage" class="alert alert-success" role="alert">
                  <i class="fa-solid fa-check-circle me-2"></i>
                  {{ successMessage }}
                </div>

                <!-- Botón de envío -->
                <div class="d-grid gap-2 mt-4">
                  <button type="submit" class="btn btn-primary btn-lg py-3" :disabled="loading">
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    <i v-else class="fa-solid fa-paper-plane me-2"></i>
                    <span v-if="!loading">Enviar Solicitud</span>
                    <span v-else>Enviando...</span>
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
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/utils/supabase';
import { sendNotificationEmail } from '@/utils/emailService';

const router = useRouter();
const logoPath = `${import.meta.env.BASE_URL}img/logo.png`;

const formData = reactive({
  tipo_evento: '',
  fecha_evento: '',
  hora_evento: '',
  lugar: '',
  descripcion: '',
  paquete: '',
  precio: null as number | null,
  contratante: '',
  telefono: '',
  padrinos: '',
  padres: '',
  festejado: '',
  notas: ''
});

const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const handleSubmit = async () => {
  errorMessage.value = '';
  successMessage.value = '';
  loading.value = true;

  try {
    // Obtener el primer usuario del sistema para asignar el contrato
    // (o puedes crear un usuario "sistema" específico para esto)
    const { data: users, error: userError } = await supabase
      .from('user')
      .select('id')
      .limit(1);

    if (userError || !users || users.length === 0) {
      errorMessage.value = 'Error: No se encontró un usuario del sistema. Contacta al administrador.';
      return;
    }

    const userId = users[0].id;

    // Insertar el contrato
    const { data: contrato, error: insertError } = await supabase
      .from('contratos')
      .insert({
        user_id: userId,
        tipo_evento: formData.tipo_evento,
        fecha_evento: formData.fecha_evento,
        hora_evento: formData.hora_evento || null,
        lugar: formData.lugar || null,
        descripcion: formData.descripcion || null,
        paquete: formData.paquete || null,
        precio: formData.precio || null,
        estado: 'pendiente',
        contratante: formData.contratante,
        telefono: formData.telefono,
        padrinos: formData.padrinos || null,
        padres: formData.padres || null,
        festejado: formData.festejado || null,
        notas: formData.notas || null
      })
      .select()
      .single();

    if (insertError) {
      errorMessage.value = insertError.message || 'Error al enviar la solicitud. Por favor, intenta nuevamente.';
      return;
    }

    // Enviar correos de notificación
    try {
      await sendNotificationEmail(contrato);
    } catch (emailError: any) {
      // No fallar si el correo no se envía, solo registrar el error
      console.error('Error al enviar correo:', emailError);
    }

    successMessage.value = '¡Solicitud enviada exitosamente! Nos pondremos en contacto contigo pronto.';
    
    // Limpiar el formulario
    Object.assign(formData, {
      tipo_evento: '',
      fecha_evento: '',
      hora_evento: '',
      lugar: '',
      descripcion: '',
      paquete: '',
      precio: null,
      contratante: '',
      telefono: '',
      padrinos: '',
      padres: '',
      festejado: '',
      notas: ''
    });

    // Redirigir después de 3 segundos
    setTimeout(() => {
      router.push('/');
    }, 3000);

  } catch (error: any) {
    errorMessage.value = 'Error de conexión. Por favor, intenta nuevamente.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.contratar-page {
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
