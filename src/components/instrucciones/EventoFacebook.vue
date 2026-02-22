<template>
  <div class="instruccion">
    <ol class="pasos list-group list-group-numbered">
      <li class="list-group-item">Entra a Facebook e inicia sesión.</li>
      <li class="list-group-item">En la página de inicio, haz clic en <strong>Crear</strong> (o el ícono «+» según la versión).</li>
      <li class="list-group-item">Selecciona <strong>Evento</strong>.</li>
      <li class="list-group-item">Completa el nombre del evento, fecha, hora y lugar.</li>
      <li class="list-group-item">Añade una imagen de portada y una descripción si lo deseas.</li>
      <li class="list-group-item">Elige si el evento es <strong>Público</strong>, <strong>Privado</strong> o solo para amigos.</li>
      <li class="list-group-item">Haz clic en <strong>Publicar</strong> o <strong>Crear evento</strong>.</li>
    </ol>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.instruccion { text-align: left; }
.pasos { max-width: 100%; }
</style>
