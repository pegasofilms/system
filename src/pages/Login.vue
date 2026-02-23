<template>
  <div class="login-page">
    <div class="container">
      <div class="row justify-content-center align-items-center min-vh-100">
        <div class="col-md-5 col-lg-4">
          <div class="card shadow-lg border-0">
            <div class="card-body p-5">
              <div class="text-center mb-4">
                <img :src="logoPath" :alt="EMPRESA.nombre" width="60" height="60" class="mb-3">
                <h2 class="h3 fw-bold text-dark mb-2">Iniciar Sesión</h2>
                <p class="text-muted small">Ingresa tus credenciales para continuar</p>
              </div>

              <form @submit.prevent="handleLogin">
                <div class="mb-3">
                  <label for="email" class="form-label fw-semibold">Usuario</label>
                  <input type="text" class="form-control" id="email" v-model="formData.email" placeholder="PegasoFilmsUser"
                    required autocomplete="username" />
                </div>

                <div class="mb-4">
                  <label for="password" class="form-label fw-semibold">Contraseña</label>
                  <div class="login-password-wrap">
                    <input
                      :type="showPassword ? 'text' : 'password'"
                      class="form-control login-password-input"
                      id="password"
                      v-model="formData.password"
                      placeholder="••••••••"
                      required
                      autocomplete="current-password"
                    />
                    <button
                      type="button"
                      class="login-password-toggle"
                      :aria-label="showPassword ? 'Ocultar contraseña' : 'Ver contraseña'"
                      @click="showPassword = !showPassword"
                    >
                      <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                    </button>
                  </div>
                </div>

                <div v-if="errorMessage" class="alert alert-danger" role="alert">
                  {{ errorMessage }}
                </div>

                <div v-if="successMessage" class="alert alert-success" role="alert">
                  {{ successMessage }}
                </div>

                <button type="submit" class="btn btn-primary w-100 py-2 fw-semibold mb-3" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"
                    aria-hidden="true"></span>
                  <span v-if="!loading">Iniciar Sesión</span>
                  <span v-else>Iniciando sesión...</span>
                </button>
              </form>

              <div class="text-center mt-3">
                <router-link to="/" class="text-decoration-none text-muted small">
                  <i class="fa-solid fa-arrow-left me-1"></i>
                  Regresar a la página principal
                </router-link>
              </div>
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
import { EMPRESA } from '@/data/empresa';
import { supabase } from '@/utils/supabase';
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const { saveSession } = useAuth();
const logoPath = `${import.meta.env.BASE_URL}img/logo.png`;

const formData = reactive({
  email: '',
  password: ''
});

const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const showPassword = ref(false);

const handleLogin = async () => {
  // Limpiar mensajes anteriores
  errorMessage.value = '';
  successMessage.value = '';
  loading.value = true;

  try {
    const usernameTrimmed = formData.email.trim();
    const { data, error: supabaseError } = await supabase
      .from('user')
      .select('id, username, password, email, nombre_completo, telefono')
      .eq('username', usernameTrimmed)
      .eq('password', formData.password)
      .maybeSingle();

    if (supabaseError) {
      errorMessage.value = supabaseError.message || 'Error al iniciar sesión';
      return;
    }

    if (data) {
      // Guardar sesión (sin incluir la contraseña)
      const userData = {
        id: data.id,
        username: data.username,
        email: data.email,
        nombre_completo: data.nombre_completo,
        telefono: data.telefono ?? null
      };
      saveSession(userData);
      
      // Redirigir a contratos
      router.push('/contratos');
    } else {
      errorMessage.value = 'Usuario o contraseña incorrectos';
    }
  } catch (error: any) {
    errorMessage.value = 'Error de conexión. Por favor, intenta nuevamente.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-page {
  background: linear-gradient(135deg, #01153a 0%, #1b294d 50%, #224a9d 100%);
  min-height: 100vh;
}

.card {
  border-radius: 12px;
}

.login-password-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.login-password-input {
  padding-right: 2.75rem;
}

.login-password-toggle {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6c757d;
  padding: 0.25rem;
  cursor: pointer;
  border-radius: 0.25rem;
  line-height: 1;
}
.login-password-toggle:hover {
  color: #224a9d;
}

.form-control:focus {
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

.btn-primary:disabled {
  background-color: #6c757d;
  border-color: #6c757d;
}
</style>
