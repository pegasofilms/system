<template>
  <div id="app">
    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<style scoped></style>
<style>
/* Navbar fijo: compartido por Navbar y NavbarAdmin */
.navbar.fixed-top {
  z-index: 1030;
}
</style>
