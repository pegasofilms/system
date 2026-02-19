<template>
  <div class="dogs-page">
    <h1 class="page-title">Imágenes de Perros</h1>
    <p class="page-subtitle">Datos desde Dog API</p>
    
    <div class="controls">
      <button @click="fetchRandomDog" class="fetch-btn" :disabled="loading">
        {{ loading ? 'Cargando...' : 'Obtener Perro Aleatorio' }}
      </button>
      <button @click="fetchMultipleDogs" class="fetch-btn" :disabled="loading">
        {{ loading ? 'Cargando...' : 'Obtener 6 Perros' }}
      </button>
    </div>
    
    <div v-if="error" class="error">
      <p>Error: {{ error }}</p>
    </div>
    
    <div v-if="dogs.length > 0" class="dogs-grid">
      <div v-for="(dog, index) in dogs" :key="index" class="dog-card">
        <img :src="dog" :alt="`Perro ${index + 1}`" class="dog-image" />
      </div>
    </div>
    
    <div v-else-if="!loading" class="empty-state">
      <p>Haz clic en un botón para ver imágenes de perros 🐕</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const dogs = ref<string[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const fetchRandomDog = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const response = await fetch('https://dog.ceo/api/breeds/image/random');
    if (!response.ok) {
      throw new Error('Error al obtener la imagen');
    }
    const data = await response.json();
    dogs.value = [data.message];
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error desconocido';
  } finally {
    loading.value = false;
  }
};

const fetchMultipleDogs = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const response = await fetch('https://dog.ceo/api/breeds/image/random/6');
    if (!response.ok) {
      throw new Error('Error al obtener las imágenes');
    }
    const data = await response.json();
    dogs.value = data.message;
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error desconocido';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.dogs-page {
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

.dogs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.dog-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.dog-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.dog-image {
  width: 100%;
  height: 250px;
  object-fit: cover;
  display: block;
}
</style>
