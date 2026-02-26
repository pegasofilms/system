<template>
  <section id="videos" class="py-4 bg-white">
    <div class="container">
      <h2 class="h2 fw-bold text-center mb-2">Videos</h2>
      <div class="videos-intro mb-2">
        <p class="videos-intro-text">Busca el video de tu evento</p>
      </div>
      <div v-if="isAdmin" class="text-center mt-2">
        <a :href="enlacesYouTube.canal" target="_blank" rel="noopener noreferrer"
          class="btn btn-outline-primary me-2 mb-2">
          <i class="fa-solid fa-sync me-2"></i>Sincronizar videos
        </a>
      </div>

      <div class="videos-guide">
        <i class="fa-solid fa-circle-info me-2" aria-hidden="true"></i>
        <span><strong>Guía:</strong> Si tu evento fue grabado en una fecha determinada, el video puede aparecer algunas
          semanas después; la subida y edición no son inmediatas.</span>
      </div>

      <VideosTabs v-model="activeTab" />
      <VideosGrid :channel-key="activeTab" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { getEnlacesYouTube } from '@/data/empresa';
import VideosTabs from '@/components/videos/VideosTabs.vue';
import VideosGrid from '@/components/videos/VideosGrid.vue';
import type { ChannelKey } from '@/services/videosApi';

const { isAuthenticated } = useAuth();
const isAdmin = computed(() => isAuthenticated.value);

const enlacesYouTube = getEnlacesYouTube();
const activeTab = ref<ChannelKey>('nopala');
</script>

<style scoped>
.videos-intro {
  max-width: 42rem;
  margin-left: auto;
  margin-right: auto;
}

.videos-intro-text {
  color: #495057;
  text-align: center;
  margin-bottom: 0.75rem;
  font-size: 1.05rem;
}

.videos-guide {
  display: flex;
  align-items: flex-start;
  gap: 0.25rem;
  padding: 0.75rem 1rem;
  background: #f8f9fa;
  border-left: 4px solid var(--bs-primary);
  border-radius: 0 6px 6px 0;
  font-size: 0.9rem;
  color: #6c757d;
}

.videos-guide i {
  color: var(--bs-primary);
  margin-top: 0.15rem;
  flex-shrink: 0;
}
</style>
