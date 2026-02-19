<template>
  <div class="login-page">
    <div class="container">
      <div class="row justify-content-center align-items-center min-vh-100">
        <div class="col-md-5 col-lg-4">
          <div class="card shadow-lg border-0">
            <div class="card-body p-5">
              <div class="text-center mb-4">
                <img :src="logoPath" alt="PEGASO FILMS" width="60" height="60" class="mb-3">
                <h2 class="h3 fw-bold text-dark mb-2">Iniciar Sesión</h2>
                <p class="text-muted small">Ingresa tus credenciales para continuar</p>
              </div>

              <form @submit.prevent="handleLogin">
                <div class="mb-3">
                  <label for="email" class="form-label fw-semibold">Email o Usuario</label>
                  <input
                    type="text"
                    class="form-control"
                    id="email"
                    v-model="formData.email"
                    placeholder="tu@email.com"
                    required
                    autocomplete="username"
                  />
                </div>

                <div class="mb-4">
                  <label for="password" class="form-label fw-semibold">Contraseña</label>
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    v-model="formData.password"
                    placeholder="••••••••"
                    required
                    autocomplete="current-password"
                  />
                </div>

                <div v-if="errorMessage" class="alert alert-danger" role="alert">
                  {{ errorMessage }}
                </div>

                <div v-if="successMessage" class="alert alert-success" role="alert">
                  {{ successMessage }}
                </div>

                <button
                  type="submit"
                  class="btn btn-primary w-100 py-2 fw-semibold"
                  :disabled="loading"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  <span v-if="!loading">Iniciar Sesión</span>
                  <span v-else>Iniciando sesión...</span>
                </button>
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

const logoPath = `${import.meta.env.BASE_URL}img/logo.png`;

const formData = reactive({
  email: '',
  password: ''
});

const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const handleLogin = async () => {
  // Limpiar mensajes anteriores
  errorMessage.value = '';
  successMessage.value = '';
  loading.value = true;

  try {
    // Aquí irá la petición HTTP
    // Por ahora solo simulamos una petición
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password
      })
    });

    const data = await response.json();

    if (response.ok) {
      successMessage.value = 'Inicio de sesión exitoso';
      // Aquí puedes redirigir o manejar la respuesta exitosa
      console.log('Login exitoso:', data);
    } else {
      errorMessage.value = data.message || 'Error al iniciar sesión';
    }
  } catch (error) {
    errorMessage.value = 'Error de conexión. Por favor, intenta nuevamente.';
    console.error('Error en login:', error);
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
