<template>
    <NavbarAdmin />
    <CotizacionForm />
</template>

<script setup lang="ts">
import NavbarAdmin from '@/components/NavbarAdmin.vue';
import CotizacionForm from '@/components/CotizacionForm.vue';
</script>

<style scoped>
/* Compensar altura del navbar fijo */
.cotizar-page {
    padding-top: 76px;
}
</style>