import { createRouter, createWebHistory } from 'vue-router'
import Prueba from '../components/pruebaCalendario.vue'
import Pacientes from '../components/ListaPacientes.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: Pacientes, },
    { path: '/calendario', component: Prueba, },
  ],
})

export default router
