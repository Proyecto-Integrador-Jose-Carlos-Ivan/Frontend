import { createRouter, createWebHistory } from 'vue-router';
import Pacientes from '../components/ListaPacientes.vue';
import ListaPacientes from '../components/ListaPacientes.vue';
import HomeView from '../components/HomeView.vue';
import InformeView from '@/components/InformeView.vue';
import LlamadasEntrantes from '@/components/LlamadasEntrantes.vue';
import LlamadasSalientes from '@/components/LlamadasSalientes.vue';
import LoginView from '@/components/LoginView.vue';
import { useApiStore } from '@/stores/api';
import GoogleCallback from '@/components/GoogleCallback.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false }, // No requiere autenticación
    },
    {
      path: '/google-callback',
      name: 'google-callback',
      component: GoogleCallback,
      meta: { requiresAuth: false }, // No requiere autenticación
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }, // Requiere autenticación
    },
    {
      path: '/pacientes',
      name: 'pacientes',
      component: Pacientes,
      meta: { requiresAuth: true }, // Requiere autenticación
    },
    {
      path: '/calendario',
      name: 'calendario',
      component: ListaPacientes,
      meta: { requiresAuth: true }, // Requiere autenticación
    },
    {
      path: '/llamadasEntrantes',
      name: 'llamadasEntrantes',
      component: LlamadasEntrantes,
      meta: { requiresAuth: true }, // Requiere autenticación
    },
    {
      path: '/llamadasSalientes',
      name: 'llamadasSalientes',
      component: LlamadasSalientes,
      meta: { requiresAuth: true }, // Requiere autenticación
    },
    {
      path: '/informes',
      name: 'informes',
      component: InformeView,
      meta: { requiresAuth: true }, // Requiere autenticación
    },
  ],
});

// Protección de rutas
router.beforeEach((to, from, next) => {
  const apiStore = useApiStore();

  // Si la ruta requiere autenticación y el usuario no está autenticado, redirige a login
  if (to.meta.requiresAuth && !apiStore.isAuthenticated) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;