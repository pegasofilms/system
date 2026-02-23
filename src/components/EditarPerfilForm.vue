<template>
  <div class="container my-3">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="shadow-lg border-0 rounded-2">
          <div class="card-header bg-primary text-center py-2">
            <h2 class="h3 fw-bold mb-0 text-primary">Editar perfil</h2>
            <p class="mb-0 mt-2 small opacity-75 text-primary">Modifica los datos que desees. Los cambios se guardan en tu cuenta.</p>
          </div>
          <div class="card-body p-4 p-md-5">
            <form @submit.prevent="guardar">
              <div class="mb-3">
                <label class="form-label fw-semibold">Usuario (nombre para iniciar sesión) <span class="text-danger">*</span></label>
                <input v-model="form.username" type="text" class="form-control" placeholder="Usuario" required
                  autocomplete="username">
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold">Correo electrónico</label>
                <input v-model="form.email" type="email" class="form-control" placeholder="correo@ejemplo.com"
                  autocomplete="email">
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold">Nombre completo</label>
                <input v-model="form.nombre_completo" type="text" class="form-control" placeholder="Tu nombre completo"
                  autocomplete="name">
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold">Teléfono</label>
                <input v-model="form.telefono" type="tel" class="form-control" placeholder="10 dígitos (ej. 9541234567)"
                  maxlength="10" inputmode="numeric" pattern="[0-9]*">
                <div v-if="telefonoInvalido" class="form-text text-danger">El teléfono debe tener 10 dígitos.</div>
              </div>

              <div v-if="errorMessage" class="alert alert-danger py-2 small mb-3">
                {{ errorMessage }}
              </div>

              <div class="d-flex gap-2 justify-content-end mt-4">
                <button type="button" class="btn btn-secondary" @click="cancelar">Cancelar</button>
                <button type="submit" class="btn btn-primary" :disabled="saving">
                  <span v-if="saving" class="spinner-border spinner-border-sm me-1" aria-hidden="true"></span>
                  Guardar cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { useAuth } from '@/composables/useAuth';
import { supabase } from '@/utils/supabase';

const router = useRouter();
const { currentUser, saveSession } = useAuth();

const form = ref({
  username: '',
  email: '',
  nombre_completo: '',
  telefono: '',
});

const saving = ref(false);
const errorMessage = ref('');

const telefonoInvalido = computed(() => {
  const t = (form.value.telefono || '').replace(/\D/g, '');
  return t.length > 0 && t.length !== 10;
});

onMounted(() => {
  const u = currentUser.value;
  if (u) {
    form.value = {
      username: u.username || '',
      email: u.email ?? '',
      nombre_completo: u.nombre_completo ?? '',
      telefono: u.telefono ?? '',
    };
  }
});

function cancelar() {
  router.back();
}

async function guardar() {
  const u = currentUser.value;
  if (!u) return;
  if (telefonoInvalido.value) return;

  saving.value = true;
  errorMessage.value = '';

  try {
    const { error } = await supabase
      .from('user')
      .update({
        username: form.value.username.trim(),
        email: form.value.email?.trim() || null,
        nombre_completo: form.value.nombre_completo?.trim() || null,
        telefono: form.value.telefono?.replace(/\D/g, '') || null,
      })
      .eq('id', u.id);

    if (error) {
      errorMessage.value = error.message || 'Error al guardar';
      return;
    }

    const updatedUser = {
      ...u,
      username: form.value.username.trim(),
      email: form.value.email?.trim() || null,
      nombre_completo: form.value.nombre_completo?.trim() || null,
      telefono: form.value.telefono?.replace(/\D/g, '') || null,
    };
    saveSession(updatedUser);
    
    await Swal.fire({
      icon: 'success',
      title: 'Ya se actualizó',
      text: 'Tu perfil se guardó correctamente.',
      timer: 2000,
      showConfirmButton: false,
    });
    
    router.push('/editar-perfil');
  } catch (e: unknown) {
    errorMessage.value = e instanceof Error ? e.message : 'Error al guardar';
  } finally {
    saving.value = false;
  }
}
</script>
