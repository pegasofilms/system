<template>
  <nav class="navbar navbar-expand-lg navbar-light py-3 bg-white navbar-pegaso shadow-sm fixed-top">
    <div class="container d-flex justify-content-between align-items-center">
      <router-link class="navbar-brand d-flex align-items-center" to="/" @click="toggleMenu">
        <img :src="logoPath" :alt="EMPRESA.nombre" width="40" height="40" class="d-inline-block align-text-top me-2">
        <strong>{{ EMPRESA.nombre }}</strong>
      </router-link>
      <button class="navbar-toggler" type="button" @click="toggleMenu" aria-label="Abrir menú">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-end" :class="{ show: menuOpen }" id="navbarAdminMenu">
        <ul class="navbar-nav navbar-pegaso-nav ms-auto align-items-center">
          <li class="nav-item">
            <router-link to="/" class="nav-link nav-pegaso-link" @click="closeMenu"><i class="fa-solid fa-house me-1"></i>Inicio</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/contratos" class="nav-link nav-pegaso-link"><i class="fa-solid fa-file-alt me-1"></i>Contratos</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/cotizar-admin" class="nav-link nav-pegaso-link"><i class="fa-solid fa-calculator me-1"></i>Cotizar</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/tutoriales" class="nav-link nav-pegaso-link"><i class="fa-solid fa-book-open me-1"></i>Tutoriales</router-link>
          </li>
          <li class="nav-item">
            <a class="nav-link nav-pegaso-link" href="#" @click.prevent="openEditarPerfil"><i class="fa-solid fa-user me-1"></i>Editar perfil</a>
          </li>
          <li class="nav-item">
            <a class="nav-link nav-pegaso-link" href="#" @click.prevent="handleLogout"><i class="fa-solid fa-sign-out-alt me-1"></i>Cerrar Sesión</a>
          </li>
        </ul>
      </div>
    </div>
    <EditarPerfilModal :show="showEditarPerfil" @cerrar="showEditarPerfil = false" />
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { EMPRESA } from '@/data/empresa';
import EditarPerfilModal from '@/components/EditarPerfilModal.vue';

withDefaults(
  defineProps<{
    /** Ruta del enlace de la marca */
    brandTo?: string;
  }>(),
  { brandTo: '/' }
);

const router = useRouter();
const { clearSession } = useAuth();

const menuOpen = ref(false);
const showEditarPerfil = ref(false);
const logoPath = `${import.meta.env.BASE_URL}img/logo.png`;

function openEditarPerfil() {
  closeMenu();
  showEditarPerfil.value = true;
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}

function closeMenu() {
  menuOpen.value = false;
}

function handleLogout() {
  closeMenu();
  clearSession();
  router.push('/login');
}
</script>
