<template>
  <div id="app">
    <Navbar />
    <main>
  <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import Navbar from '@/components/Navbar.vue';
</script>

<style scoped>
</style>
