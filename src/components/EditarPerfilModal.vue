<template>
  <Teleport to="body">
  <div ref="modalEl" class="modal fade" tabindex="-1" aria-labelledby="editarPerfilTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content modal-pegaso">
        <div class="modal-header modal-header-pegaso">
          <div class="d-flex align-items-center gap-2 w-100">
            <span class="modal-header-pegaso-icon"><i class="fa-solid fa-user-pen"></i></span>
            <h5 class="modal-title mb-0" id="editarPerfilTitle">Editar perfil</h5>
            <button type="button" class="btn-close btn-close-white ms-auto" aria-label="Cerrar" @click="cerrar"></button>
          </div>
        </div>
        <form @submit.prevent="guardar">
          <div class="modal-body">
            <p class="text-muted small mb-3">Modifica los datos que desees. Los cambios se guardan en tu cuenta.</p>

            <div class="mb-3">
              <label class="form-label">Usuario (nombre para iniciar sesión)</label>
              <input v-model="form.username" type="text" class="form-control" placeholder="Usuario" required
                autocomplete="username">
            </div>

            <div class="mb-3">
              <label class="form-label">Correo electrónico</label>
              <input v-model="form.email" type="email" class="form-control" placeholder="correo@ejemplo.com"
                autocomplete="email">
            </div>

            <div class="mb-3">
              <label class="form-label">Nombre completo</label>
              <input v-model="form.nombre_completo" type="text" class="form-control" placeholder="Tu nombre completo"
                autocomplete="name">
            </div>

            <div class="mb-3">
              <label class="form-label">Teléfono</label>
              <input v-model="form.telefono" type="tel" class="form-control" placeholder="10 dígitos (ej. 9541234567)"
                maxlength="10" inputmode="numeric" pattern="[0-9]*">
              <div v-if="telefonoInvalido" class="form-text text-danger">El teléfono debe tener 10 dígitos.</div>
            </div>

            <div v-if="errorMessage" class="alert alert-danger py-2 small mb-0">
              {{ errorMessage }}
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="cerrar">Cancelar</button>
            <button type="submit" class="btn btn-primary" :disabled="saving">
              <span v-if="saving" class="spinner-border spinner-border-sm me-1" aria-hidden="true"></span>
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { Modal } from 'bootstrap';
import Swal from 'sweetalert2';
import { useAuth } from '@/composables/useAuth';
import { supabase } from '@/utils/supabase';

const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits<{
  (e: 'cerrar'): void;
}>();

const { currentUser, saveSession } = useAuth();
const modalEl = ref<HTMLElement | null>(null);
let modalInstance: InstanceType<typeof Modal> | null = null;

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

watch(
  () => props.show,
  (visible) => {
    if (!modalEl.value) return;
    if (visible) {
      const u = currentUser.value;
      if (u) {
        form.value = {
          username: u.username || '',
          email: u.email ?? '',
          nombre_completo: u.nombre_completo ?? '',
          telefono: u.telefono ?? '',
        };
      }
      errorMessage.value = '';
      modalInstance?.dispose();
      modalInstance = new Modal(modalEl.value);
      modalInstance.show();
    } else {
      modalInstance?.hide();
    }
  }
);

watch(modalEl, (el) => {
  if (!el) return;
  el.addEventListener('hidden.bs.modal', () => emit('cerrar'));
}, { flush: 'post' });

function cerrar() {
  modalInstance?.hide();
  emit('cerrar');
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
    cerrar();
    await Swal.fire({
      icon: 'success',
      title: 'Ya se actualizó',
      text: 'Tu perfil se guardó correctamente.',
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (e: unknown) {
    errorMessage.value = e instanceof Error ? e.message : 'Error al guardar';
  } finally {
    saving.value = false;
  }
}
</script>
