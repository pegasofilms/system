<template>
  <div class="videos-grid">
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-danger" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-2 text-muted">Cargando videos...</p>
    </div>
    <div v-else-if="error" class="alert alert-warning text-center">
      {{ error }}
    </div>
    <div v-else-if="!videos.length" class="text-center py-5 text-muted">
      No hay videos en este canal.
    </div>
    <template v-else>
      <div class="videos-toolbar bg-light rounded-3 my-2 py-2 px-2 shadow-sm">
        <div class="videos-toolbar-inner">
          <div class="videos-toolbar-search-wrap">
            <div class="input-group input-group-sm videos-toolbar-search">
              <span class="input-group-text bg-white border-end-0" aria-label="Buscar">
                <i class="fa-solid fa-magnifying-glass text-muted" aria-hidden="true"></i>
              </span>
              <input v-model.trim="searchQuery" type="search" class="form-control border-start-0 ps-0"
                placeholder="Buscar por título..." aria-label="Buscar videos">
            </div>
          </div>
          <div class="videos-toolbar-item">
            <div class="form-check mb-0">
              <input id="filter-todo" v-model="showAll" type="checkbox" class="form-check-input">
              <label for="filter-todo" class="form-check-label small text-muted">Todos</label>
            </div>
          </div>
          <div class="videos-toolbar-item">
            <select v-model="order" class="form-select form-select-sm videos-toolbar-select">
              <option value="desc">Más recientes</option>
              <option value="asc">Más antiguos</option>
            </select>
          </div>
          <div class="videos-toolbar-item">
            <select v-model="selectedYear" class="form-select form-select-sm videos-toolbar-select" :disabled="showAll">
              <option value="" disabled selected hidden>Año</option>
              <option v-for="y in yearsList" :key="y" :value="String(y)">{{ y }}</option>
            </select>
          </div>
          <div class="videos-toolbar-item">
            <select v-model="selectedMonth" class="form-select form-select-sm videos-toolbar-select"
              :disabled="showAll">
              <option value="">Todos</option>
              <option v-for="m in monthOptions" :key="m.value" :value="m.value">{{ m.label }}</option>
            </select>
          </div>
        </div>
      </div>
      <div class="row g-4">
        <div v-for="video in filteredAndSorted" :key="video.video_id" class="col-md-6 col-lg-4">
          <div class="card h-100 shadow-sm video-card" :class="{ 'is-selected': isSelected(video.video_id) }"
            role="link" tabindex="0" :aria-label="`Abrir video: ${video.title ?? 'Video'}`">
            <div class="ratio ratio-16x9 bg-dark overflow-hidden video-card-thumb">
              <img :src="thumbnailUrl(video)" :alt="video.title" class="video-thumb" loading="lazy">
              <button type="button" class="video-select-btn" :class="{ 'is-selected': isSelected(video.video_id) }"
                :aria-pressed="isSelected(video.video_id)"
                :title="isSelected(video.video_id) ? 'Quitar de selección' : 'Seleccionar'"
                @click.stop="toggleSelected(video.video_id)">
                <i v-if="isSelected(video.video_id)" class="fa-solid fa-check"></i>
                <span class="visually-hidden">
                  {{ isSelected(video.video_id) ? 'Quitar de selección' : 'Seleccionar' }}
                </span>
              </button>
            </div>
            <div class="card-body d-flex flex-column">
              <h6 class="card-title">{{ video.title }}</h6>
              <div class="video-card-actions">
                <a :href="watchUrl(video.video_id)" target="_blank" rel="noopener noreferrer" @click.stop
                  class="btn  btn-outline-danger" title="Ver en YouTube">
                  <i class="fa-solid fa-play me-1"></i>Play
                </a>
                <a :href="shareWhatsAppUrl(video)" target="_blank" rel="noopener noreferrer" @click.stop
                  class="btn btn-outline-success" title="Compartir por WhatsApp">
                  <i class="fa-brands fa-whatsapp me-1"></i>Compartir
                </a>
              </div>
              <span class="video-date mt-auto">{{ formatDate(video.published_at) }}</span>
            </div>
          </div>
        </div>
      </div>
      <p v-if="!filteredAndSorted.length" class="text-muted text-center py-3 mb-0">
        {{ searchQuery ? 'No hay videos que coincidan con la búsqueda.' : 'No hay videos con los filtros seleccionados.'
        }}
      </p>
    </template>

    <div v-if="selectedCount > 0" class="videos-share-bar" role="region" aria-label="Acciones de selección">
      <div class="videos-share-bar-inner">
        <div class="videos-share-bar-left">
          <div class="fw-semibold">{{ selectedCount }} seleccionado{{ selectedCount === 1 ? '' : 's' }}</div>
        </div>
        <div class="videos-share-bar-actions">
          <a :href="selectedWhatsAppUrl" target="_blank" rel="noopener noreferrer" class="btn btn-success"
            title="Compartir por WhatsApp">
            <i class="fa-brands fa-whatsapp me-1"></i>Compartir
          </a>
          <button type="button" class="btn btn-outline-secondary" @click="clearSelection">
            Limpiar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { fetchVideosByChannel, CHANNEL_NAMES, type ChannelKey, type VideoRow } from '@/services/videosApi';

const props = withDefaults(
  defineProps<{ channelKey: ChannelKey; refreshTrigger?: number }>(),
  { refreshTrigger: 0 }
);

const videos = ref<VideoRow[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const now = new Date();
const currentYear = String(now.getFullYear());
const currentMonth = String(now.getMonth() + 1);

const searchQuery = ref('');
const showAll = ref(false);
const selectedYear = ref(currentYear);
const selectedMonth = ref(currentMonth);
const order = ref<'desc' | 'asc'>('desc');

const selectedIds = ref<Set<string>>(new Set());

const monthOptions = [
  { value: '1', label: 'Enero' }, { value: '2', label: 'Febrero' }, { value: '3', label: 'Marzo' },
  { value: '4', label: 'Abril' }, { value: '5', label: 'Mayo' }, { value: '6', label: 'Junio' },
  { value: '7', label: 'Julio' }, { value: '8', label: 'Agosto' }, { value: '9', label: 'Septiembre' },
  { value: '10', label: 'Octubre' }, { value: '11', label: 'Noviembre' }, { value: '12', label: 'Diciembre' },
];

const yearsList = computed(() => {
  const set = new Set<number>();
  for (const v of videos.value) {
    if (v.published_at) {
      const y = new Date(v.published_at).getFullYear();
      if (!isNaN(y)) set.add(y);
    }
  }
  return Array.from(set).sort((a, b) => b - a);
});

const filteredAndSorted = computed(() => {
  let list = videos.value;
  if (!showAll.value) {
    list = list.filter((v) => {
      if (!v.published_at) return false;
      const d = new Date(v.published_at);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1);
      if (selectedYear.value && String(y) !== selectedYear.value) return false;
      if (selectedMonth.value && m !== selectedMonth.value) return false;
      return true;
    });
  }
  const q = searchQuery.value.toLowerCase();
  if (q) {
    list = list.filter((v) => (v.title ?? '').toLowerCase().includes(q));
  }
  const asc = order.value === 'asc';
  return [...list].sort((a, b) => {
    const ta = a.published_at ? new Date(a.published_at).getTime() : 0;
    const tb = b.published_at ? new Date(b.published_at).getTime() : 0;
    return asc ? ta - tb : tb - ta;
  });
});

function watchUrl(videoId: string) {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

/** URL de WhatsApp sin número: abre la app con el mensaje y el usuario elige a quién enviarlo */
function shareWhatsAppUrl(video: VideoRow) {
  const url = watchUrl(video.video_id);
  const title = video.title?.trim() || 'Video';
  const text = `${title}: ${url}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

const selectedCount = computed(() => selectedIds.value.size);

function isSelected(videoId: string) {
  return selectedIds.value.has(videoId);
}

function toggleSelected(videoId: string) {
  const next = new Set(selectedIds.value);
  if (next.has(videoId)) next.delete(videoId);
  else next.add(videoId);
  selectedIds.value = next;
}

function clearSelection() {
  selectedIds.value = new Set();
}

const selectedVideos = computed(() => {
  const list = videos.value.filter((v) => selectedIds.value.has(v.video_id));
  return [...list].sort((a, b) => {
    const ta = a.published_at ? new Date(a.published_at).getTime() : 0;
    const tb = b.published_at ? new Date(b.published_at).getTime() : 0;
    return tb - ta;
  });
});

const selectedShareText = computed(() => {
  return selectedVideos.value
    .map((v, idx) => `${idx + 1}. ${(v.title?.trim() || 'Video')}: ${watchUrl(v.video_id)}`)
    .join('\n');
});

const selectedWhatsAppUrl = computed(() => {
  const text = selectedShareText.value.trim();
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
});

function thumbnailUrl(video: VideoRow) {
  return video.thumbnail_medium_url ?? video.thumbnail_high_url ?? video.thumbnail_default_url ?? '';
}

function formatDate(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
}

async function load() {
  loading.value = true;
  error.value = null;
  const channelTitle = CHANNEL_NAMES[props.channelKey];
  const { data, error: err } = await fetchVideosByChannel(channelTitle);
  loading.value = false;
  if (err) {
    error.value = err.message;
    videos.value = [];
    selectedIds.value = new Set();
    return;
  }
  videos.value = data ?? [];
  const n = new Date();
  searchQuery.value = '';
  showAll.value = false;
  selectedYear.value = String(n.getFullYear());
  selectedMonth.value = String(n.getMonth() + 1);
  order.value = 'desc';
  selectedIds.value = new Set();
}

watch(() => props.channelKey, load, { immediate: true });
watch(() => props.refreshTrigger, () => { if (props.refreshTrigger > 0) load(); });
</script>

<style scoped>
.videos-grid {
  padding-bottom: 5.5rem;
}

.video-card {
  border-radius: 0.375rem;
  transition: box-shadow 0.2s, transform 0.2s;
  
  user-select: none;
  position: relative;
}

.video-card:hover {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.video-card.is-selected {
  border: 2px solid #dc3545;
  box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.15);
}

.video-card:focus-visible {
  outline: none;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.video-card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
  position: relative;
  z-index: 2;
}

.video-card-thumb {
  position: relative;
}

.video-select-btn {
  position: absolute;
  margin: .5rem;
  right: 0.5rem;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.95);
  background: transparent;
  color: #fff;
  font-size: 0.9rem;
  z-index: 3;
  cursor: pointer;
  box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.25);
}

.video-select-btn.is-selected {
  background: #dc3545;
  border-color: rgba(255, 255, 255, 0.95);
}

.video-select-btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.video-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.375rem 0.375rem 0 0;
}

.card-body {
  flex: 1;
}

.card-title {
  font-size: 0.95rem;
  white-space: normal;
  word-wrap: break-word;
}

.video-date {
  font-size: 0.8rem;
  color: #6c757d;
}

/* Barra tipo YouTube Studio – distribución con CSS */
.videos-toolbar-inner {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.videos-toolbar-search-wrap {
  width: 100%;
}

.videos-toolbar-item {
  width: 100%;
}

.videos-toolbar-item .form-select,
.videos-toolbar-item .form-control {
  width: 100%;
}

@media (min-width: 576px) {
  .videos-toolbar-inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    align-items: center;
  }

  .videos-toolbar-search-wrap {
    grid-column: 1 / -1;
  }

  .videos-toolbar-item .form-select {
    width: 100%;
    min-width: 0;
  }
}

@media (min-width: 992px) {
  .videos-toolbar-inner {
    grid-template-columns: 1fr auto auto auto auto;
    gap: 1rem;
  }

  .videos-toolbar-search-wrap {
    grid-column: auto;
    min-width: 12rem;
    max-width: 20rem;
  }

  .videos-toolbar-item {
    width: auto;
    min-width: 7.5rem;
  }

  .videos-toolbar-item .form-select {
    width: 100%;
    min-width: 7.5rem;
  }
}

.videos-toolbar-search.input-group {
  border-radius: 1.5rem;
  background: #fff;
  border: 1px solid #dee2e6;
  overflow: hidden;
}

.videos-toolbar-search .input-group-text {
  border: none;
  border-radius: 1.5rem 0 0 1.5rem;
}

.videos-toolbar-search .form-control {
  border: none;
  border-radius: 0 1.5rem 1.5rem 0;
  background: transparent;
}

.videos-toolbar-search .form-control:focus {
  box-shadow: none;
}

.videos-toolbar-select {
  min-width: 7.5rem;
}

.videos-share-bar {
  position: fixed;
  left: 50%;
  bottom: 0rem;
  transform: translateX(-50%);
  width: 100%;
  z-index: 1030;
}

.videos-share-bar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 0.75rem;
  /* border-radius: 0.75rem; */
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 0.75rem 1.5rem rgba(0, 0, 0, 0.15);
}

.videos-share-bar-left {
  min-width: 0;
}

.videos-share-bar-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}
</style>
