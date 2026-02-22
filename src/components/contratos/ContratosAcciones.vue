<template>
  <!-- Modo desktop: botones compactos en fila -->
  <div v-if="variant === 'desktop'" class="d-flex justify-content-end align-items-center gap-1 flex-wrap">
    <button
      type="button"
      class="btn btn-sm btn-outline-success me-1"
      :disabled="!puedeEnviar"
      :title="puedeEnviar ? 'Abre WhatsApp con mensaje de entrega de videos al cliente' : 'Necesitas teléfono del cliente (10 dígitos) y al menos un enlace de video'"
      @click="enviarWhatsApp"
    >
      <i class="fa-brands fa-whatsapp"></i>
    </button>
    <button type="button" class="btn btn-sm btn-outline-primary me-1" @click="$emit('ver', contrato)" title="Ver">
      <i class="fa-solid fa-eye"></i>
    </button>
    <button type="button" class="btn btn-sm btn-outline-primary me-1" @click="$emit('editar', contrato)" title="Editar">
      <i class="fa-solid fa-pen"></i>
    </button>
    <button
      type="button"
      class="btn btn-sm btn-outline-secondary me-1"
      @click="$emit('sugerencia', contrato)"
      title="Sugerencia de publicación"
    >
      <i class="fa-solid fa-bullhorn"></i>
    </button>
    <button type="button" class="btn btn-sm btn-outline-danger" @click="$emit('eliminar', contrato)" title="Eliminar">
      <i class="fa-solid fa-trash"></i>
    </button>
  </div>

  <!-- Modo mobile: grid de botones con texto -->
  <div v-else class="row">
    <div class="col-6 py-1">
      <button
        type="button"
        class="btn btn-sm btn-outline-success w-100"
        :disabled="!puedeEnviar"
        :title="puedeEnviar ? 'Enviar videos al cliente' : 'Necesitas teléfono y enlaces de video'"
        @click="enviarWhatsApp"
      >
        <i class="fa-brands fa-whatsapp me-1"></i>Enviar al cliente
      </button>
    </div>
    <div class="col-6 py-1">
      <button type="button" class="btn btn-sm btn-outline-primary w-100" @click="$emit('ver', contrato)" title="Ver">
        <i class="fa-solid fa-eye me-1"></i>Ver detalles
      </button>
    </div>
    <div class="col-6 py-1">
      <button type="button" class="btn btn-sm btn-outline-primary w-100" @click="$emit('editar', contrato)" title="Editar">
        <i class="fa-solid fa-pen me-1"></i>Editar
      </button>
    </div>
    <div class="col-6 py-1">
      <button type="button" class="btn btn-sm btn-outline-danger w-100" @click="$emit('eliminar', contrato)" title="Eliminar">
        <i class="fa-solid fa-trash me-1"></i>Eliminar
      </button>
    </div>
    <div class="col-12 py-1">
      <button
        type="button"
        class="btn btn-sm btn-outline-secondary w-100"
        @click="$emit('sugerencia', contrato)"
        title="Sugerencia de publicación"
      >
        <i class="fa-solid fa-bullhorn me-1"></i>Sugerencia de publicación
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Contrato } from '@/types/contrato';
import { parseVideosEnlaces } from '@/utils/contratoFormatters';
import { getWhatsAppEntregaVideosUrl } from '@/utils/whatsappService';

const props = defineProps<{
  contrato: Contrato;
  /** 'desktop' = botones compactos en fila; 'mobile' = grid con texto */
  variant: 'desktop' | 'mobile';
}>();

defineEmits<{
  (e: 'ver', c: Contrato): void;
  (e: 'editar', c: Contrato): void;
  (e: 'eliminar', c: Contrato): void;
  (e: 'sugerencia', c: Contrato): void;
}>();

const puedeEnviar = computed(() => {
  const tel = (props.contrato.telefono || '').replace(/\D/g, '');
  const videos = parseVideosEnlaces(props.contrato.enlaces_videos);
  return tel.length >= 10 && videos.length > 0;
});

function enviarWhatsApp() {
  const url = getWhatsAppEntregaVideosUrl(props.contrato);
  if (url) window.open(url, '_blank', 'noopener,noreferrer');
}
</script>
