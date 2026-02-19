<template>
  <div class="jokes-page">
    <h1 class="page-title">Chistes Aleatorios</h1>
    <p class="page-subtitle">Datos desde Joke API</p>
    
    <div class="controls">
      <button @click="fetchJoke" class="fetch-btn" :disabled="loading">
        {{ loading ? 'Cargando...' : 'Obtener Chiste' }}
      </button>
      <select v-model="jokeType" class="type-select">
        <option value="any">Cualquiera</option>
        <option value="programming">Programación</option>
        <option value="misc">Misceláneo</option>
        <option value="dark">Oscuro</option>
        <option value="pun">Juego de palabras</option>
      </select>
    </div>
    
    <div v-if="error" class="error">
      <p>Error: {{ error }}</p>
    </div>
    
    <div v-if="joke" class="joke-card">
      <div v-if="joke.type === 'single'" class="joke-single">
        <p class="joke-text">{{ joke.joke }}</p>
      </div>
      <div v-else class="joke-twopart">
        <p class="joke-setup">{{ joke.setup }}</p>
        <p class="joke-delivery">{{ joke.delivery }}</p>
      </div>
      <div class="joke-meta">
        <span class="joke-category">Categoría: {{ joke.category }}</span>
        <span class="joke-type">Tipo: {{ joke.type === 'single' ? 'Simple' : 'Dos partes' }}</span>
      </div>
    </div>
    
    <div v-else-if="!loading" class="empty-state">
      <p>Haz clic en el botón para obtener un chiste 😄</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Joke {
  id: number;
  type: 'single' | 'twopart';
  joke?: string;
  setup?: string;
  delivery?: string;
  category: string;
}

const joke = ref<Joke | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const jokeType = ref('any');

const fetchJoke = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const typeParam = jokeType.value !== 'any' ? `?type=${jokeType.value}` : '';
    const response = await fetch(`https://v2.jokeapi.dev/joke/Any${typeParam}`);
    if (!response.ok) {
      throw new Error('Error al obtener el chiste');
    }
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.message || 'Error en la API');
    }
    
    joke.value = data;
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error desconocido';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.jokes-page {
  padding: 2rem 0;
}

.page-title {
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: #666;
  margin-bottom: 2rem;
}

.controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;
  flex-wrap: wrap;
}

.fetch-btn {
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: background 0.3s;
}

.fetch-btn:hover:not(:disabled) {
  background: #764ba2;
}

.fetch-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.type-select {
  padding: 0.75rem 1rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
}

.error {
  padding: 1rem;
  background: #ffebee;
  color: #d32f2f;
  border-radius: 6px;
  margin-bottom: 2rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  color: #666;
  font-size: 1.1rem;
}

.joke-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 700px;
  margin: 0 auto;
}

.joke-single .joke-text {
  font-size: 1.25rem;
  line-height: 1.6;
  color: #333;
  margin-bottom: 1.5rem;
}

.joke-twopart {
  margin-bottom: 1.5rem;
}

.joke-setup {
  font-size: 1.25rem;
  line-height: 1.6;
  color: #333;
  margin-bottom: 1rem;
  font-weight: 500;
}

.joke-delivery {
  font-size: 1.25rem;
  line-height: 1.6;
  color: #667eea;
  font-weight: 600;
  padding-left: 1rem;
  border-left: 3px solid #667eea;
}

.joke-meta {
  display: flex;
  justify-content: space-between;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
  font-size: 0.875rem;
  color: #999;
  flex-wrap: wrap;
  gap: 0.5rem;
}
</style>
