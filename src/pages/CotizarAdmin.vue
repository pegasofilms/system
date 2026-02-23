<template>
    <Navbar />
    <CotizacionForm />
</template>

<script setup lang="ts">
import Navbar from '@/components/Navbar.vue';
import CotizacionForm from '@/components/CotizacionForm.vue';
</script>

<style scoped>
/* Compensar altura del navbar fijo */
.cotizar-page {
    padding-top: 76px;
}
</style>