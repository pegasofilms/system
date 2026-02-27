<template>
  <ul class="nav nav-tabs videos-tabs mb-2" role="tablist">
    <li class="nav-item" role="presentation">
      <button type="button" class="nav-link" :class="{ active: modelValue === 'nopala' }" role="tab"
        :aria-selected="modelValue === 'nopala'" @click="select('nopala')">
        VIDEOS
      </button>
    </li>
    <li class="nav-item" role="presentation"> 
      <button type="button" class="nav-link" :class="{ active: modelValue === 'live' }" role="tab"
        :aria-selected="modelValue === 'live'" @click="select('live')">
        LIVE
      </button>
    </li>
    <li class="nav-item" role="presentation"> 
      <button type="button" class="nav-link" :class="{ active: modelValue === 'privado' }" role="tab"
        :aria-selected="modelValue === 'privado'" @click="select('privado')">
        PRIVADO
      </button>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { ChannelKey } from '@/services/videosApi';

defineProps<{ modelValue: ChannelKey }>();
const emit = defineEmits<{ 'update:modelValue': [value: ChannelKey] }>();

function select(key: ChannelKey) {
  emit('update:modelValue', key);
}
</script>

<style scoped>
.videos-tabs {
  border-bottom: 2px solid #dee2e6;
}

.videos-tabs .nav-link {
  font-weight: 600;
  color: #6c757d;
  border: none;
  border-bottom: 3px solid transparent;
  background: transparent;
  padding: 0.75rem 1rem;
  cursor: pointer;
}

.videos-tabs .nav-link:hover {
  color: #dc3545;
  border-bottom-color: rgba(220, 53, 69, 0.3);
}

.videos-tabs .nav-link.active {
  color: #dc3545;
  border-bottom-color: #dc3545;
  background: transparent;
}
</style>
