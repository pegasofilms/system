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
        <router-link to="/cotizar" class="btn btn-light mt-3">Cotizar ahora</router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped>
.hero-section {
  background: linear-gradient(0deg, #01153a 0%, #1b294d 0%, #224a9d 100%);
}
</style>
