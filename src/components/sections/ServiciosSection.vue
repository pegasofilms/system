<template>
  <section id="servicios" class="py-5 bg-white">
    <div class="container">
      <h2 class="h2 fw-bold text-center mb-3">Nuestros servicios</h2>
      <p class="text-muted text-center mb-4">Grabación y transmisión en vivo de todo tipo de eventos</p>
      <div class="row g-3">
        <div v-for="servicio in servicios" :key="servicio.id" class="col-sm-6 col-md-6 col-lg-3 col-xl-3 ">
          <div class="card h-100 text-center p-3">
            <div class="servicio-img-wrap mb-2 rounded overflow-hidden position-relative">
              <div v-show="!imagenCargada[servicio.id]" class="servicio-skeleton" aria-hidden="true"></div>
              <img
                :src="servicio.imagen"
                :alt="servicio.titulo"
                class="servicio-img"
                :class="{ 'servicio-img-loaded': imagenCargada[servicio.id] }"
                @load="marcarImagenCargada(servicio.id)"
              >
            </div>
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
            <div class="d-flex justify-content-center">
              <i :class="produccion.icono" class="text-primary mb-2" style="font-size: 1.5rem;"></i>
            </div>
            <h3 class="h6 fw-bold mb-1">{{ produccion.titulo }}</h3>
            <p class="small text-muted mb-0">{{ produccion.descripcion }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

const baseUrl = import.meta.env.BASE_URL;

const imagenCargada = reactive<Record<number, boolean>>({});
function marcarImagenCargada(id: number) {
  imagenCargada[id] = true;
}
const servicios = ref([
  { id: 1, titulo: 'Bodas', descripcion: 'Capturamos el momento desde la ceremonia, la convivencia y el banquete hasta el baile popular, para que revivas cada instante.', imagen: `${baseUrl}img/boda.jpg` },
  { id: 2, titulo: 'Bautizos', descripcion: 'Guardamos para siempre la emoción del día: la ceremonia, los abrazos y la fiesta con quienes más quieren a tu bebé.', imagen: `${baseUrl}img/bautizo.jpg` },
  { id: 3, titulo: 'Cumpleaños', descripcion: 'Desde la torta y las mañanitas hasta la piñata: el video que atesorarán niños y adultos por años.', imagen: `${baseUrl}img/cumpleanos.jpg` },
  { id: 4, titulo: 'Jaripeos', descripcion: 'La adrenalina del ruedo, la música y el ambiente charro en vivo, para que no se pierda ni un detalle.', imagen: `${baseUrl}img/jaripeo.jpg` },
  { id: 5, titulo: 'Bailes', descripcion: 'La pista, los vestidos, la primera pieza y toda la fiesta: el recuerdo en video de tu baile o quinceañera.', imagen: `${baseUrl}img/baile.jpg` },
  { id: 6, titulo: 'Videoclips', descripcion: 'Llevamos tu música a la pantalla con una producción que refleje tu estilo y llegue a tu audiencia.', imagen: `${baseUrl}img/videoclips.jpg` },
  { id: 7, titulo: 'Eventos en vivo', descripcion: 'Quien no pueda estar presente lo vive en tiempo real; quien sí estuvo, lo revive cuando quiera.', imagen: `${baseUrl}img/envivo.jpg` },
  { id: 8, titulo: 'Conciertos', descripcion: 'Cada nota, cada aplauso y el ambiente del escenario: la cobertura que tu evento musical merece.', imagen: `${baseUrl}img/conciertos.jpg` },
  { id: 9, titulo: 'Xv años', descripcion: 'Desde la entrada hasta el vals y la última canción: el video de la noche en que se convirtió en princesa.', imagen: `${baseUrl}img/xvanos.jpg` },
  { id: 10, titulo: 'Eventos culturales', descripcion: 'Tradición, danza, música y comunidad: llevamos tu evento cultural a quien quiera vivirlo o revivirlo.', imagen: `${baseUrl}img/eventocultural.jpg` },
  { id: 11, titulo: 'Clausuras', descripcion: 'Capturamos ese hermoso momento de pasar a una etapa más en la vida de nuestros hijos; un recuerdo para siempre.', imagen: `${baseUrl}img/clausura.jpg` },
  { id: 12, titulo: 'Calendas y convites', descripcion: 'La música, el color y la alegría de la calenda o el convite, para que tu comunidad lo conserve en video.', imagen: `${baseUrl}img/calendaconvite.jpg` }
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

.servicio-img-wrap {
  width: 100%;
  height: 150px;
  background: #e9ecef;
}

.servicio-skeleton {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    #e9ecef 0%,
    #f1f3f5 50%,
    #e9ecef 100%
  );
  background-size: 200% 100%;
  animation: skeleton-pulse 1.2s ease-in-out infinite;
}

.servicio-img {
  position: absolute;
  inset: 0;
  object-fit: cover;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.servicio-img-loaded {
  opacity: 1;
}

@keyframes skeleton-pulse {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
