<template>
  <nav v-if="currentUser && isMobile" class="mobile-bottom-nav" aria-label="Navegación principal">
    <router-link to="/cotizar" class="nav-item" :class="{ active: isActive('/cotizar') }" @click="closeNav">
      <i class="fa-solid fa-calculator" aria-hidden="true"></i>
      <span class="nav-label">Cotizar</span>
    </router-link>
    <router-link to="/videos" class="nav-item" :class="{ active: isActive('/videos') }" @click="closeNav">
      <i class="fa-solid fa-video" aria-hidden="true"></i>
      <span class="nav-label">Videos</span>
    </router-link>
    <router-link to="/contratos" class="nav-item" :class="{ active: isActive('/contratos') }" @click="closeNav">
      <i class="fa-solid fa-file-alt" aria-hidden="true"></i>
      <span class="nav-label">Contrato</span>
    </router-link>
    <router-link to="/pendientes" class="nav-item" :class="{ active: isActive('/pendientes') }" @click="closeNav">
      <i class="fa-solid fa-list-check" aria-hidden="true"></i>
      <span class="nav-label">Pendientes</span>
    </router-link>
    <router-link to="/tutoriales" class="nav-item" :class="{ active: isActive('/tutoriales') }" @click="closeNav">
      <i class="fa-solid fa-book-open" aria-hidden="true"></i>
      <span class="nav-label">Tutoriales</span>
    </router-link>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const { currentUser } = useAuth();
const route = useRoute();
const isMobile = ref(false);

const MOBILE_BREAKPOINT = 991; // mismo que navbar-expand-lg (lg)

const checkMobile = () => {
  isMobile.value = window.innerWidth <= MOBILE_BREAKPOINT;
};

const isActive = (path: string) => {
  return route.path === path;
};

const closeNav = () => {
  // Cualquier lógica extra al tocar un ítem (ej. cerrar overlays)
};

watch(
  [currentUser, isMobile],
  ([user, mobile]) => {
    if (user && mobile) {
      document.body.classList.add('has-mobile-bottom-nav');
    } else {
      document.body.classList.remove('has-mobile-bottom-nav');
    }
  },
  { immediate: true }
);

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
  document.body.classList.remove('has-mobile-bottom-nav');
});
</script>

<style scoped>
.mobile-bottom-nav {
  display: none;
}

@media (max-width: 991px) {
  .mobile-bottom-nav {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 56px;
    padding-bottom: env(safe-area-inset-bottom, 0);
    background: #fff;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.08);
    z-index: 1020;
    align-items: center;
    justify-content: space-around;
  }

  .nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    padding: 6px 4px;
    color: #6c757d;
    text-decoration: none;
    font-size: 0.7rem;
    transition: color 0.2s, background 0.2s;
    min-height: 56px;
  }

  .nav-item i {
    font-size: 1.25rem;
  }

  .nav-item:hover,
  .nav-item:focus {
    color: #0d6efd;
  }

  .nav-item.active {
    color: #0d6efd;
    font-weight: 600;
  }

  .nav-label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }

}
</style>

<style>
/* Espacio global para que el contenido no quede tapado por la barra en móvil */
body.has-mobile-bottom-nav {
  padding-bottom: calc(56px + env(safe-area-inset-bottom, 0px));
}
</style>
