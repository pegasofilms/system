import { ref, computed } from 'vue';

interface User {
  id: number;
  username: string;
  email: string | null;
  nombre_completo: string | null;
  telefono?: string | null;
}

const SESSION_KEY = 'pegaso_films_session';
const SESSION_EXPIRY_DAYS = 7; // La sesión expira en 7 días

const currentUser = ref<User | null>(null);
const isAuthenticated = computed(() => currentUser.value !== null);

// Cargar sesión desde localStorage al iniciar
const loadSession = () => {
  try {
    const sessionData = localStorage.getItem(SESSION_KEY);
    if (sessionData) {
      const { user, expiry } = JSON.parse(sessionData);
      // Verificar si la sesión no ha expirado
      if (new Date().getTime() < expiry) {
        currentUser.value = user;
        return true;
      } else {
        // Sesión expirada, limpiar
        clearSession();
      }
    }
  } catch (error) {
    console.error('Error al cargar sesión:', error);
    clearSession();
  }
  return false;
};

// Guardar sesión en localStorage
const saveSession = (user: User) => {
  const expiry = new Date().getTime() + (SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
  const sessionData = {
    user,
    expiry
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
  currentUser.value = user;
};

// Limpiar sesión
const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
  currentUser.value = null;
};

// Inicializar al cargar el módulo
loadSession();

export const useAuth = () => {
  return {
    currentUser,
    isAuthenticated,
    saveSession,
    clearSession,
    loadSession
  };
};
