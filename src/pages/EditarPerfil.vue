<template>
  <div class="editar-perfil-page">
    <Navbar />
    <EditarPerfilForm />
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/Navbar.vue';
import EditarPerfilForm from '@/components/EditarPerfilForm.vue';
</script>

<style scoped>
/* Compensar altura del navbar fijo */
.editar-perfil-page {
  padding-top: 76px;
  min-height: 100vh;
  background-color: #f8f9fa;
}
</style>
