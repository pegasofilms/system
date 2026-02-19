<template>
  <section id="servicios" class="py-5 bg-white">
    <div class="container">
      <h2 class="h2 fw-bold text-center mb-3">Nuestros servicios</h2>
      <p class="text-muted text-center mb-4">Grabación y transmisión en vivo de todo tipo de eventos</p>
      <div class="row g-3">
        <div v-for="servicio in servicios" :key="servicio.id" class="col-sm-6 col-md-6 col-lg-3 col-xl-3 ">
          <div class="card h-100 text-center p-3">
            <img :src="servicio.imagen" :alt="servicio.titulo" class="mb-2 rounded servicio-img">
            <h3 class="h6 fw-bold mb-1">{{ servicio.titulo }}</h3>
            <p class="small text-muted mb-0">{{ servicio.descripcion }}</p>
          </div>
        </div>
      </div>
      
      <h3 class="h5 fw-bold text-center mt-5 mb-3">Producción audiovisual</h3>
      <p class="text-muted text-center mb-3">Videoclips, spots, anuncios y videos comerciales en nuestras plataformas</p>
      <div class="row g-3">
        <div v-for="produccion in producciones" :key="produccion.id" class="col-sm-6 col-md-6 col-lg-3 col-xl-3 ">
          <div class="card h-100 text-center p-3">
            <i :class="produccion.icono" class="text-primary mb-2" style="font-size: 1.5rem;"></i>
            <h3 class="h6 fw-bold mb-1">{{ produccion.titulo }}</h3>
            <p class="small text-muted mb-0">{{ produccion.descripcion }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const baseUrl = import.meta.env.BASE_URL;
const servicios = ref([
  { id: 1, titulo: 'Bodas', descripcion: 'Grabación y edición de tu boda para que revivas cada momento.', imagen: `${baseUrl}img/boda.jpg` },
  { id: 2, titulo: 'Bautizos', descripcion: 'Capturamos la ceremonia y la celebración de este día especial.', imagen: `${baseUrl}img/bautizo.jpg` },
  { id: 3, titulo: 'Cumpleaños', descripcion: 'Fiestas infantiles y de adultos con recuerdos en video.', imagen: `${baseUrl}img/cumpleanos.jpg` },
  { id: 4, titulo: 'Jaripeos', descripcion: 'Cobertura de jaripeos y eventos charros en vivo.', imagen: `${baseUrl}img/jaripeo.jpg` },
  { id: 5, titulo: 'Bailes', descripcion: 'Grabación de bailes, quinceañeras y fiestas.', imagen: `${baseUrl}img/baile.jpg` },
  { id: 6, titulo: 'Videoclips', descripcion: 'Producción audiovisual profesional para música y artistas.', imagen: `${baseUrl}img/videoclips.jpg` },
  { id: 7, titulo: 'Eventos en vivo', descripcion: 'Transmisión y grabación de eventos en tiempo real.', imagen: `${baseUrl}img/envivo.jpg` },
  { id: 8, titulo: 'Conciertos', descripcion: 'Cobertura de conciertos y presentaciones musicales.', imagen: `${baseUrl}img/conciertos.jpg` },
  { id: 9, titulo: 'Xv años', descripcion: 'Grabación y edición de fiestas de XV años.', imagen: `${baseUrl}img/xvanos.jpg` },
  { id: 10, titulo: 'Eventos culturales', descripcion: 'Cobertura de eventos culturales y transmisión en vivo.', imagen: `${baseUrl}img/eventocultural.jpg` },
  { id: 11, titulo: 'Clausuras', descripcion: 'Grabación y edición de clausuras escolares', imagen: `${baseUrl}img/clausura.jpg` },
  { id: 12, titulo: 'Calendas y convites', descripcion: 'Grabación y edición de calendas y convites.', imagen: `${baseUrl}img/calendaconvite.jpg` }
]);

const producciones = ref([
  { id: 1, titulo: 'Videoclips', descripcion: 'Producción de videoclips musicales.', icono: 'fa-solid fa-film' },
  { id: 2, titulo: 'Spots y anuncios', descripcion: 'Spots publicitarios y anuncios.', icono: 'fa-solid fa-bullhorn' },
  { id: 3, titulo: 'Anuncios en nuestras plataformas', descripcion: 'Difusión de anuncios publicitarios en YouTube y redes.', icono: 'fa-solid fa-tv' },
  { id: 4, titulo: 'Videos comerciales', descripcion: 'Videos comerciales para empresas y marcas.', icono: 'fa-solid fa-briefcase' },
  { id: 5, titulo: 'Flayers', descripcion: 'Diseño de flayers para eventos y promociones.', icono: 'fa-solid fa-image' },
  { id: 6, titulo: 'Subida de videos a plataformas', descripcion: 'Subida de videos a plataformas como YouTube, Facebook, Instagram, etc.', icono: 'fa-solid fa-upload' },
  { id: 7, titulo: 'Diseño de logos', descripcion: 'Diseño de logos para clientes y empresas.', icono: 'fa-solid fa-palette' },
  { id: 8, titulo: 'Asistencia técnica', descripcion: 'Asistencia técnica para eventos y empresas.', icono: 'fa-solid fa-screwdriver-wrench' }
]);
</script>

<style scoped>
.card {
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  border: 1px solid #e0e0e0;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.15) !important;
}

.servicio-img {
  object-fit: cover;
  width: 100%;
  height: 150px;
}
</style>
