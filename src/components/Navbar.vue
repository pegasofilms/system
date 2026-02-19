<template>
  <nav class="navbar navbar-expand-lg navbar-light py-3 bg-white navbar-pegaso">
    <div class="container d-flex justify-content-between align-items-center">
      <router-link class="navbar-brand d-flex align-items-center" to="/" @click="goToHome">
        <img :src="logoPath" alt="PEGASO FILMS" width="40" height="40" class="d-inline-block align-text-top me-2">
        <strong>PEGASO FILMS</strong>
      </router-link>
      <button class="navbar-toggler" type="button" @click="toggleMenu" aria-label="Abrir menú">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-end" :class="{ show: menuOpen }" id="navbarNav">
        <ul class="navbar-nav gap-2 gap-lg-3 ms-auto align-items-center">
          <li class="nav-item">
            <a class="nav-link" href="#" @click.prevent="handleNavClick('inicio')">Inicio</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#" @click.prevent="handleNavClick('servicios')">Servicios</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#" @click.prevent="handleNavClick('videos')">Videos</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#" @click.prevent="handleNavClick('contacto')">Contacto</a>
          </li>
          <!-- <li class="nav-item">
            <router-link to="/posts" class="nav-link">Ejemplos API</router-link>
          </li> -->
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const menuOpen = ref(false);
const logoPath = `${import.meta.env.BASE_URL}img/logo.png`;

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const goToHome = () => {
  menuOpen.value = false;
  if (router.currentRoute.value.path !== '/') {
    router.push('/');
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const handleNavClick = (id: string) => {
  menuOpen.value = false;
  
  // Si no estamos en la página de inicio, navegar primero
  if (router.currentRoute.value.path !== '/') {
    router.push('/').then(() => {
      // Esperar un momento para que la página se renderice
      setTimeout(() => {
        scrollToSection(id);
      }, 100);
    });
  } else {
    // Si ya estamos en la página de inicio, hacer scroll directamente
    scrollToSection(id);
  }
};

const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};
</script>

<style scoped>
.navbar-pegaso .navbar-brand,
.navbar-pegaso .navbar-brand strong,
.navbar-pegaso .nav-link {
  color: rgb(0, 36, 102) !important;
  font-weight: bold;
}

.navbar-brand {
  text-decoration: none;
}

.navbar-toggler {
  border: none;
  padding: 0.25rem 0.5rem;
}

.navbar-toggler:focus {
  box-shadow: none;
}

.navbar-collapse {
  transition: all 0.3s ease;
}

@media (max-width: 991px) {
  .navbar-collapse {
    margin-top: 1rem;
  }
}
</style>
