<template>
  <section class="py-5 bg-light">
    <div class="container">
      <h2 class="h2 fw-bold text-center mb-4">Ejemplos de Integración con APIs</h2>
      <p class="text-muted text-center mb-4">Componentes de ejemplo que consumen APIs públicas</p>
      <div class="row g-4">
        <div class="col-md-4">
          <div class="card h-100">
            <div class="card-body text-center">
              <h3 class="h5 fw-bold mb-3">📝 Posts</h3>
              <p class="text-muted mb-3">Consulta posts de ejemplo desde JSONPlaceholder API</p>
              <router-link to="/posts" class="btn btn-primary">Ver Posts</router-link>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card h-100">
            <div class="card-body text-center">
              <h3 class="h5 fw-bold mb-3">🐕 Perros</h3>
              <p class="text-muted mb-3">Obtén imágenes aleatorias de perros desde Dog API</p>
              <router-link to="/dogs" class="btn btn-primary">Ver Perros</router-link>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card h-100">
            <div class="card-body text-center">
              <h3 class="h5 fw-bold mb-3">😄 Chistes</h3>
              <p class="text-muted mb-3">Disfruta de chistes aleatorios desde Joke API</p>
              <router-link to="/jokes" class="btn btn-primary">Ver Chistes</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped>
.bg-light {
  background-color: #f8f9fa !important;
}

.card {
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  border: 1px solid #e0e0e0;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.15) !important;
}
</style>
