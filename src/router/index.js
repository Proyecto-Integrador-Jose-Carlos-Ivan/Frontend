import { createRouter, createWebHistory } from 'vue-router';
import Pacientes from '../components/ListaPacientes.vue';
import ListaPacientes from '../components/ListaPacientes.vue';
import HomeView from '../components/HomeView.vue';
import InformeView from '@/components/InformeView.vue';
import LlamadasEntrantes from '@/components/LlamadasEntrantes.vue';
import LlamadasSalientes from '@/components/LlamadasSalientes.vue';
import LoginView from '@/components/LoginView.vue';
import { useApiStore } from '@/stores/api';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: LoginView,
    },
    {
      path: '/home',
      component: HomeView,
      
    },
    {
      path: '/pacientes',
      component: Pacientes,
     
    },
    {
      path: '/calendario',
      component: ListaPacientes,
     
    },
    {
      path: '/llamadasEntrantes',
      component: LlamadasEntrantes,
      
    },
    {
      path: '/llamadasSalientes',
      component: LlamadasSalientes,
      
    },
    {
      path: '/informes',
      name: 'Reports',
      component: InformeView,
    },

    
    
  ],
});
router.beforeEach((to, from, next) => {
  const apiStore = useApiStore();

  if (to.meta.requiresAuth && !apiStore.isAuthenticated) {
    next('/');
  } else {
    next();
  }
});


export default router;