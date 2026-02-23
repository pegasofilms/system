<template>
  <!-- Modo desktop: botones compactos en fila -->
  <div class="d-flex justify-content-end align-items-center gap-1 flex-wrap">
    <button type="button" class="btn btn-sm btn-success me-1"
      title="Abre WhatsApp con mensaje de entrega de videos al cliente" @click.stop="enviarWhatsApp">
      <i class="fa-brands fa-whatsapp"></i>
    </button>
    <button type="button" class="btn btn-sm btn-primary me-1" @click.stop="$emit('ver', contrato)" title="Ver" v-if="variant === 'desktop'"> 
      <i class="fa-solid fa-eye"></i>
    </button>
    <button type="button" class="btn btn-sm btn-secondary me-1" @click.stop="$emit('sugerencia', contrato)"
      title="Sugerencia de publicación">
      <i class="fa-solid fa-bullhorn"></i>
    </button>
    <button type="button" class="btn btn-sm btn-primary me-1" @click.stop="$emit('editar', contrato)" title="Editar">
      <i class="fa-solid fa-pen"></i>
    </button>
    <button type="button" class="btn btn-sm btn-danger" @click.stop="$emit('eliminar', contrato)" title="Eliminar">
      <i class="fa-solid fa-trash"></i>
    </button>
  </div>

  
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Swal from 'sweetalert2';
import type { Contrato } from '@/types/contrato';
import { parseVideosEnlaces } from '@/utils/contratoFormatters';
import { getWhatsAppEntregaVideosUrl } from '@/utils/whatsappService';
import { MENSAJES } from '@/data/mensajes';

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
  if (puedeEnviar.value) {
    const url = getWhatsAppEntregaVideosUrl(props.contrato);
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  } else {
    Swal.fire({
      icon: 'warning',
      title: 'No se puede enviar el mensaje',
      html: MENSAJES.WHATSAPP_ENVIAR_ERROR
    });
  }
}
</script>

<style scoped>
.contratos-acciones-mobile :deep(.btn:hover),
.contratos-acciones-mobile :deep(.btn:focus),
.contratos-acciones-mobile :deep(.btn:active) {
  box-shadow: none !important;
  transform: none;
}

/* Sin hover ni feedback de clic en móvil: mismo aspecto que en reposo */
.contratos-acciones-mobile :deep(.btn:hover),
.contratos-acciones-mobile :deep(.btn:active) {
  background-color: transparent;
  border-color: var(--bs-btn-border-color);
  color: var(--bs-btn-color);
}
</style>
