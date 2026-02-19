<template>
  <div class="posts-page">
    <h1 class="page-title">Posts de Ejemplo</h1>
    <p class="page-subtitle">Datos desde JSONPlaceholder API</p>
    
    <div v-if="loading" class="loading">
      <p>Cargando posts...</p>
    </div>
    
    <div v-else-if="error" class="error">
      <p>Error al cargar los posts: {{ error }}</p>
      <button @click="fetchPosts" class="retry-btn">Reintentar</button>
    </div>
    
    <div v-else class="posts-grid">
      <div v-for="post in posts" :key="post.id" class="post-card">
        <h3 class="post-title">{{ post.title }}</h3>
        <p class="post-body">{{ post.body }}</p>
        <div class="post-meta">
          <span>Post ID: {{ post.id }}</span>
          <span>Usuario ID: {{ post.userId }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

const posts = ref<Post[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const fetchPosts = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=12');
    if (!response.ok) {
      throw new Error('Error al obtener los posts');
    }
    posts.value = await response.json();
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error desconocido';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchPosts();
});
</script>

<style scoped>
.posts-page {
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

.loading, .error {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.error {
  color: #d32f2f;
}

.retry-btn {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s;
}

.retry-btn:hover {
  background: #764ba2;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.post-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.post-title {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  line-height: 1.4;
}

.post-body {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  padding-top: 1rem;
  border-top: 1px solid #eee;
  font-size: 0.875rem;
  color: #999;
}
</style>
