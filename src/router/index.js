import { createRouter, createWebHistory } from 'vue-router'
import Prueba from '../components/pruebaCalendario.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: Prueba, },
  ],
})

export default router
