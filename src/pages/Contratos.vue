<template>
  <div class="contratos-page">
    <nav class="navbar navbar-expand-lg navbar-light py-3 bg-white navbar-pegaso">
      <div class="container d-flex justify-content-between align-items-center">
        <router-link class="navbar-brand d-flex align-items-center" to="/">
          <img :src="logoPath" alt="PEGASO FILMS" width="40" height="40" class="d-inline-block align-text-top me-2">
          <strong>PEGASO FILMS</strong>
        </router-link>
        <div class="d-flex align-items-center gap-3">
          <span class="text-muted small">{{ currentUser?.nombre_completo || currentUser?.username }}</span>
          <button class="btn btn-outline-danger btn-sm" @click="handleLogout">
            <i class="fa-solid fa-sign-out-alt me-1"></i>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>

    <div class="container my-5">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3 fw-bold">Contratos</h1>
        <button class="btn btn-primary" @click="loadContratos" :disabled="loading">
          <i class="fa-solid fa-sync-alt me-2" :class="{ 'fa-spin': loading }"></i>
          Actualizar
        </button>
      </div>

      <div v-if="loading && contratos.length === 0" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="mt-3 text-muted">Cargando contratos...</p>
      </div>

      <div v-else-if="errorMessage" class="alert alert-danger" role="alert">
        <i class="fa-solid fa-exclamation-triangle me-2"></i>
        {{ errorMessage }}
      </div>

      <div v-else-if="contratos.length === 0" class="text-center py-5">
        <i class="fa-solid fa-folder-open fa-3x text-muted mb-3"></i>
        <p class="text-muted">No hay contratos registrados</p>
      </div>

      <div v-else class="row g-4">
        <div v-for="contrato in contratos" :key="contrato.id" class="col-md-6 col-lg-4">
          <div class="card h-100 shadow-sm">
            <div class="card-header bg-primary text-white">
              <div class="d-flex justify-content-between align-items-center">
                <h5 class="card-title mb-0">{{ contrato.tipo_evento }}</h5>
                <span :class="getEstadoBadgeClass(contrato.estado)">
                  {{ formatEstado(contrato.estado) }}
                </span>
              </div>
            </div>
            <div class="card-body">
              <div class="mb-2">
                <strong><i class="fa-solid fa-calendar me-2 text-primary"></i>Fecha:</strong>
                <span class="ms-2">{{ formatDate(contrato.fecha_evento) }}</span>
              </div>
              <div v-if="contrato.hora_evento" class="mb-2">
                <strong><i class="fa-solid fa-clock me-2 text-primary"></i>Hora:</strong>
                <span class="ms-2">{{ formatTime(contrato.hora_evento) }}</span>
              </div>
              <div v-if="contrato.lugar" class="mb-2">
                <strong><i class="fa-solid fa-map-marker-alt me-2 text-primary"></i>Lugar:</strong>
                <span class="ms-2">{{ contrato.lugar }}</span>
              </div>
              <div v-if="contrato.contratante" class="mb-2">
                <strong><i class="fa-solid fa-user me-2 text-primary"></i>Contratante:</strong>
                <span class="ms-2">{{ contrato.contratante }}</span>
              </div>
              <div v-if="contrato.telefono" class="mb-2">
                <strong><i class="fa-solid fa-phone me-2 text-primary"></i>Teléfono:</strong>
                <span class="ms-2">{{ contrato.telefono }}</span>
              </div>
              <div v-if="contrato.paquete" class="mb-2">
                <strong><i class="fa-solid fa-box me-2 text-primary"></i>Paquete:</strong>
                <span class="ms-2">{{ contrato.paquete }}</span>
              </div>
              <div v-if="contrato.precio" class="mb-2">
                <strong><i class="fa-solid fa-dollar-sign me-2 text-primary"></i>Precio:</strong>
                <span class="ms-2">{{ formatCurrency(contrato.precio) }}</span>
              </div>
              <div v-if="contrato.anticipo" class="mb-2">
                <strong><i class="fa-solid fa-money-bill me-2 text-primary"></i>Anticipo:</strong>
                <span class="ms-2">{{ formatCurrency(contrato.anticipo) }}</span>
              </div>
              <div v-if="contrato.padrinos" class="mb-2">
                <strong><i class="fa-solid fa-users me-2 text-primary"></i>Padrinos:</strong>
                <span class="ms-2">{{ contrato.padrinos }}</span>
              </div>
              <div v-if="contrato.padres" class="mb-2">
                <strong><i class="fa-solid fa-users me-2 text-primary"></i>Padres:</strong>
                <span class="ms-2">{{ contrato.padres }}</span>
              </div>
              <div v-if="contrato.festejado" class="mb-2">
                <strong><i class="fa-solid fa-birthday-cake me-2 text-primary"></i>Festejado:</strong>
                <span class="ms-2">{{ contrato.festejado }}</span>
              </div>
              <div v-if="contrato.memoria_entregada" class="mb-2">
                <span class="badge bg-success">
                  <i class="fa-solid fa-check me-1"></i>
                  Memoria entregada
                </span>
              </div>
              <div v-if="contrato.enlaces_videos" class="mb-2">
                <strong><i class="fa-solid fa-video me-2 text-primary"></i>Videos:</strong>
                <div class="mt-1">
                  <a v-for="(enlace, index) in parseEnlaces(contrato.enlaces_videos)" 
                     :key="index" 
                     :href="enlace" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     class="btn btn-sm btn-outline-primary me-1 mb-1">
                    <i class="fa-brands fa-youtube me-1"></i>
                    Video {{ index + 1 }}
                  </a>
                </div>
              </div>
              <div v-if="contrato.descripcion" class="mb-2">
                <strong><i class="fa-solid fa-file-alt me-2 text-primary"></i>Descripción:</strong>
                <p class="mt-1 mb-0 small text-muted">{{ contrato.descripcion }}</p>
              </div>
              <div v-if="contrato.notas" class="mb-2">
                <strong><i class="fa-solid fa-sticky-note me-2 text-primary"></i>Notas:</strong>
                <p class="mt-1 mb-0 small text-muted">{{ contrato.notas }}</p>
              </div>
            </div>
            <div class="card-footer text-muted small">
              <i class="fa-solid fa-clock me-1"></i>
              Creado: {{ formatDateTime(contrato.created_at) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/utils/supabase';
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const { currentUser, clearSession, isAuthenticated } = useAuth();
const logoPath = `${import.meta.env.BASE_URL}img/logo.png`;

const contratos = ref<any[]>([]);
const loading = ref(false);
const errorMessage = ref('');

// Verificar autenticación al montar
onMounted(() => {
  if (!isAuthenticated.value) {
    router.push('/login');
    return;
  }
  loadContratos();
});

const loadContratos = async () => {
  loading.value = true;
  errorMessage.value = '';

  try {
    const { data, error } = await supabase
      .from('contratos')
      .select('*')
      .order('fecha_evento', { ascending: false });

    if (error) {
      errorMessage.value = error.message || 'Error al cargar contratos';
      return;
    }

    contratos.value = data || [];
  } catch (error: any) {
    errorMessage.value = 'Error de conexión. Por favor, intenta nuevamente.';
  } finally {
    loading.value = false;
  }
};

const handleLogout = () => {
  clearSession();
  router.push('/login');
};

const formatDate = (date: string) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatTime = (time: string) => {
  if (!time) return 'N/A';
  return time.substring(0, 5); // HH:MM
};

const formatDateTime = (dateTime: string) => {
  if (!dateTime) return 'N/A';
  return new Date(dateTime).toLocaleString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatCurrency = (amount: number) => {
  if (!amount) return '$0.00';
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(amount);
};

const formatEstado = (estado: string) => {
  const estados: Record<string, string> = {
    pendiente: 'Pendiente',
    confirmado: 'Confirmado',
    en_proceso: 'En Proceso',
    completado: 'Completado',
    cancelado: 'Cancelado'
  };
  return estados[estado] || estado;
};

const getEstadoBadgeClass = (estado: string) => {
  const classes: Record<string, string> = {
    pendiente: 'badge bg-warning',
    confirmado: 'badge bg-success',
    en_proceso: 'badge bg-info',
    completado: 'badge bg-primary',
    cancelado: 'badge bg-danger'
  };
  return classes[estado] || 'badge bg-secondary';
};

const parseEnlaces = (enlaces: string): string[] => {
  if (!enlaces) return [];
  // Separar por comas o espacios
  return enlaces.split(/[,\s]+/).filter(enlace => enlace.trim() !== '');
};
</script>

<style scoped>
.contratos-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.card-header {
  border-bottom: none;
}

.badge {
  font-size: 0.75rem;
  padding: 0.35em 0.65em;
}
</style>
