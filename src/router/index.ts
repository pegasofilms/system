import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '@/pages/Home.vue';
import Login from '@/pages/Login.vue';
import Contratos from '@/pages/Contratos.vue';
import Cotizar from '@/pages/Cotizar.vue';
import { useAuth } from '@/composables/useAuth';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/contratos',
    name: 'Contratos',
    component: Contratos,
    meta: { requiresAuth: true }
  },
  {
    path: '/cotizar',
    name: 'Cotizar',
    component: Cotizar
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

// Guard de navegación para proteger rutas
router.beforeEach((to, _from, next) => {
  const { isAuthenticated } = useAuth();

  // Si la ruta requiere autenticación y el usuario no está autenticado
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next({ name: 'Login' });
    return;
  }

  // Si la ruta requiere ser invitado (no autenticado) y el usuario está autenticado
  if (to.meta.requiresGuest && isAuthenticated.value) {
    next({ name: 'Contratos' });
    return;
  }

  next();
});

export default router;
