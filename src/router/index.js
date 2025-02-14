import { createRouter, createWebHistory } from 'vue-router'
import Pacientes from '../components/ListaPacientes.vue'
import ListaPacientes from '../components/ListaPacientes.vue'
import ListaLlamadas from '@/components/ListaLlamadas.vue'
import HomeView from '../components/HomeView.vue'
import InformeView from '@/components/InformeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: HomeView },
    { path: '/pacientes', component: Pacientes },
    { path: '/calendario', component: ListaPacientes},
    { path: '/llamadas', component: ListaLlamadas },
    {
      path: '/informes',
      name: 'Reports',
      component: InformeView,
    },

  ],
})

export default router

/*import { createRouter, createWebHistory } from 'vue-router'
import { useApiStore } from '@/stores/api'
import Pacientes from '../components/ListaPacientes.vue'
import LoginView from '@/components/LoginView.vue'
import ListaPacientes from '../components/ListaPacientes.vue'
import ListaLlamadas from '@/components/ListaLlamadas.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/pacientes',
    name: 'Pacientes',
    component: Pacientes,
    meta: { requiresAuth: true }
  },
  {
    path: '/llamadas',
    name: 'Llamadas',
    component: ListaLlamadas,
    meta: { requiresAuth: true }
  },
  {
    path: '/calendario',
    name: 'Calendario',
    component: ListaPacientes,
    meta: { requiresAuth: true }
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const apiStore = useApiStore()
  if (to.matched.some(record => record.meta.requiresAuth) && !apiStore.isAuthenticated) {
    next('/')
  } else if (to.path === '/' && apiStore.isAuthenticated) {
    next('/pacientes')
  } else {
    next()
  }
})

export default router*/