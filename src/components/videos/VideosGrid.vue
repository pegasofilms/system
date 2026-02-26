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
          <a :href="watchUrl(video.video_id)" target="_blank" rel="noopener noreferrer"
            class="card h-100 shadow-sm video-card-link">
            <div class="ratio ratio-16x9 bg-dark overflow-hidden">
              <img :src="thumbnailUrl(video)" :alt="video.title" class="video-thumb" loading="lazy">
            </div>
            <div class="card-body d-flex flex-column">
              <h6 class="card-title">{{ video.title }}</h6>
              <span class="video-date mt-auto">{{ formatDate(video.published_at) }}</span>
            </div>
          </a>
        </div>
      </div>
      <p v-if="!filteredAndSorted.length" class="text-muted text-center py-3 mb-0">
        {{ searchQuery ? 'No hay videos que coincidan con la búsqueda.' : 'No hay videos con los filtros seleccionados.'
        }}
      </p>
    </template>
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
    return;
  }
  videos.value = data ?? [];
  const n = new Date();
  searchQuery.value = '';
  showAll.value = false;
  selectedYear.value = String(n.getFullYear());
  selectedMonth.value = String(n.getMonth() + 1);
  order.value = 'desc';
}

watch(() => props.channelKey, load, { immediate: true });
watch(() => props.refreshTrigger, () => { if (props.refreshTrigger > 0) load(); });
</script>

<style scoped>
.video-card-link {
  color: inherit;
  text-decoration: none;
  border-radius: 0.375rem;
  transition: box-shadow 0.2s, transform 0.2s;
}

.video-card-link:hover {
  color: inherit;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
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
</style>
