<template>
  <footer id="contacto" class="bg-dark text-white">
    <div class="container py-4">
      <div class="justify-content-center">
        <div class="text-center">
          <h2 class="h4 fw-bold mb-1 text-white">Contrataciones</h2>
          <p class="text-white-50 mb-3 small">Reserva tu fecha o solicita información. Te respondemos por teléfono o WhatsApp.</p>
          <div class="d-flex flex-column flex-sm-row justify-content-center align-items-center gap-2">
            <a :href="`tel:+${EMPRESA.telefono}`" class="btn btn-outline-light btn px-4 rounded-pill">
              <i class="fa-solid fa-phone me-2" aria-hidden="true"></i> {{ EMPRESA.telefonoFormateado }}
            </a>
            <a :href="urlWhatsAppContacto" target="_blank" rel="noopener noreferrer" class="btn btn-success px-4 rounded-pill">
              <i class="fa-brands fa-whatsapp me-2" aria-hidden="true"></i> Escribir por WhatsApp
            </a>
          </div>
          <hr class="border-secondary my-3 opacity-50">
          <p class="small text-white-50 mb-0">
            <img :src="logoPath" alt="" width="40" height="40" class="align-middle me-2" aria-hidden="true">
            <span class="fw-semibold text-white">{{ EMPRESA.nombre }}</span> · Gracias por la preferencia.
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { EMPRESA } from '@/data/empresa';

const logoPath = `${import.meta.env.BASE_URL}img/logo.png`;

const urlWhatsAppContacto = computed(
  () => `https://wa.me/${EMPRESA.telefono}?text=${encodeURIComponent(EMPRESA.whatsappMensajeCotizar)}`
);
</script>

<style scoped>
</style>
