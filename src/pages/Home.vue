<template>
  <div class="pegaso-films-page">
    <Navbar />
    <HeroSection />
    <ServiciosSection />
    <ComoTrabajamosSection />
    <VideosSection />
    <RedesSocialesSection />
    <ContactoFooter />
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/Navbar.vue';
import HeroSection from '@/components/sections/HeroSection.vue';
import ServiciosSection from '@/components/sections/ServiciosSection.vue';
import ComoTrabajamosSection from '@/components/sections/ComoTrabajamosSection.vue';
import VideosSection from '@/components/sections/VideosSection.vue';
import RedesSocialesSection from '@/components/sections/RedesSocialesSection.vue';
import ContactoFooter from '@/components/sections/ContactoFooter.vue';
</script>

<style scoped>
.pegaso-films-page {
  padding: 0;
}
</style>
