<template>
  <div class="pegaso-films-page">
    <Navbar />
    <HeroSection />
    <ServiciosSection />
    <ComoTrabajamosSection />
    <ContactoFooter />
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/Navbar.vue';
import HeroSection from '@/components/sections/HeroSection.vue';
import ServiciosSection from '@/components/sections/ServiciosSection.vue';
import ComoTrabajamosSection from '@/components/sections/ComoTrabajamosSection.vue';
import ContactoFooter from '@/components/sections/ContactoFooter.vue';
</script>

<style scoped>
/* Compensar altura del navbar fijo */
.pegaso-films-page {
  padding-top: 76px;
}
</style>
