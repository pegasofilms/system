<template>
  <div id="app">
    <main>
      <RouterView />
    </main>
    <MobileBottomNav />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import MobileBottomNav from '@/components/MobileBottomNav.vue';
</script>

<style scoped></style>
<style>
/* Navbar fijo */
.navbar.fixed-top {
  z-index: 1030;
}
</style>
