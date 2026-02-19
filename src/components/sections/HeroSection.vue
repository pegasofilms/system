<template>
  <section id="inicio" class="hero-section">
    <div class="text-white py-5 text-center">
      <div class="container">
        <p class="h4 fw-bold mb-3">¿Quiénes somos?</p>
        <div class="row justify-content-center text-center">
          <p class="col-12 col-md-8">
            Somos una empresa dedicada a la grabación de todo tipo de eventos: bodas, bautizos, cumpleaños, jaripeos, bailes y más. También realizamos producciones audiovisuales como videoclips, eventos en vivo y conciertos.
          </p>
        </div>
        <a href="#contacto" class="btn btn-light mt-3" @click="scrollToContacto">Contratar ahora</a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const scrollToContacto = () => {
  const element = document.getElementById('contacto');
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

<style scoped>
.hero-section {
  background: linear-gradient(0deg, #01153a 0%, #1b294d 0%, #224a9d 100%);
}
</style>
