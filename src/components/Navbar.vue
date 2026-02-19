<template>
  <nav class="navbar navbar-expand-lg navbar-light py-3 bg-white navbar-pegaso">
    <div class="container d-flex justify-content-between align-items-center">
      <router-link class="navbar-brand d-flex align-items-center" to="/">
        <img :src="logoPath" alt="PEGASO FILMS" width="40" height="40" class="d-inline-block align-text-top me-2">
        <strong>PEGASO FILMS</strong>
      </router-link>
      <button class="navbar-toggler" type="button" @click="toggleMenu" aria-label="Abrir menú">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-end" :class="{ show: menuOpen }" id="navbarNav">
        <ul class="navbar-nav gap-2 gap-lg-3 ms-auto align-items-center">
          <li class="nav-item">
            <a class="nav-link" href="#inicio" @click="scrollTo('inicio')">Inicio</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#servicios" @click="scrollTo('servicios')">Servicios</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#videos" @click="scrollTo('videos')">Videos</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#contacto" @click="scrollTo('contacto')">Contacto</a>
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

const menuOpen = ref(false);
const logoPath = `${import.meta.env.BASE_URL}img/logo.png`;

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const scrollTo = (id: string) => {
  menuOpen.value = false;
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
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
