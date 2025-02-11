import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/HomeView.vue'
import Pacientes from '../components/ListaPacientes.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: Home, },
    { path: '/calendario', component: Pacientes, },
  ],
})

export default router
