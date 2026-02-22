<template>
  <nav class="navbar navbar-expand-lg navbar-light py-3 bg-white navbar-pegaso shadow-sm">
    <div class="container d-flex justify-content-between align-items-center">
      <router-link class="navbar-brand d-flex align-items-center" to="/" @click="goToHome">
        <img :src="logoPath" :alt="EMPRESA.nombre" width="40" height="40" class="d-inline-block align-text-top me-2">
        <strong>{{ EMPRESA.nombre }}</strong>
      </router-link>
      <button class="navbar-toggler" type="button" @click="toggleMenu" aria-label="Abrir menú">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-end" :class="{ show: menuOpen }" id="navbarNav">
        <ul class="navbar-nav navbar-pegaso-nav ms-auto align-items-center">
          <li class="nav-item">
            <a class="nav-link nav-pegaso-link" href="#" @click.prevent="handleNavClick('inicio')"><i class="fa-solid fa-house me-1"></i>Inicio</a>
          </li>
          <li class="nav-item">
            <a class="nav-link nav-pegaso-link" href="#" @click.prevent="handleNavClick('servicios')"><i class="fa-solid fa-gear me-1"></i>Servicios</a>
          </li>
          <li class="nav-item">
            <a class="nav-link nav-pegaso-link" href="#" @click.prevent="handleNavClick('como-trabajamos')"><i class="fa-solid fa-satellite-dish me-1"></i>Como trabajamos</a>
          </li>
          <li class="nav-item">
            <a class="nav-link nav-pegaso-link" href="#" @click.prevent="handleNavClick('videos')"><i class="fa-solid fa-video me-1"></i>Videos</a>
          </li>
          <li class="nav-item">
            <a class="nav-link nav-pegaso-link" href="#" @click.prevent="handleNavClick('contacto')"><i class="fa-solid fa-envelope me-1"></i>Contacto</a>
          </li>
          <li class="nav-item">
            <router-link to="/login" class="nav-link nav-pegaso-link"><i class="fa-solid fa-right-to-bracket me-1"></i>Iniciar sesión</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { EMPRESA } from '@/data/empresa';

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

const handleNavClick = async (id: string) => {
  menuOpen.value = false;
  
  // Si no estamos en la página de inicio, navegar primero
  if (router.currentRoute.value.path !== '/') {
    await router.push('/');
    // Esperar a que Vue renderice los componentes
    await nextTick();
    // Dar tiempo adicional para que los componentes se monten completamente
    await new Promise(resolve => setTimeout(resolve, 200));
    scrollToSection(id);
  } else {
    // Si ya estamos en la página de inicio, esperar a que el DOM esté listo
    await nextTick();
    scrollToSection(id);
  }
};

const scrollToSection = (id: string, retries = 5) => {
  const element = document.getElementById(id);
  
  if (element) {
    // Calcular el offset del navbar (altura aproximada del navbar)
    const navbarHeight = 80; // Ajusta según la altura real de tu navbar
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - navbarHeight;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  } else if (retries > 0) {
    // Si el elemento no existe, reintentar después de un breve delay
    setTimeout(() => {
      scrollToSection(id, retries - 1);
    }, 100);
  } else {
    console.warn(`No se pudo encontrar el elemento con id: ${id}`);
  }
};
</script>
