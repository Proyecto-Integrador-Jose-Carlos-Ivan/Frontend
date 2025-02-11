import { defineStore } from 'pinia'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000'

export const useLlamadasStore = defineStore('llamadas', {
  state: () => ({
    llamadas: [],
    errors: null,
  }),

  getters: {
    totalLlamadas: (state) => state.llamadas.length,
  },

  actions: {
    async fetchLlamadas() {
      try {
        const response = await axios.get(API_BASE_URL + '/api/calls')
        this.llamadas = response.data
      } catch (error) {
        this.errors = 'Error loading llamadas: ' + error.message
      }
    },

    async addLlamada(llamada) {
      try {
        const response = await axios.post(API_BASE_URL + '/api/calls', llamada)
        this.llamadas.push(response.data)
      } catch (error) {
        this.errors = 'Error adding llamada: ' + error.message
      }
    },

    async updateLlamada(id, llamada) {
      try {
        const response = await axios.put(API_BASE_URL + `/api/calls/${id}`, llamada)
        const index = this.llamadas.findIndex((l) => l.id === id)
        if (index !== -1) {
          this.llamadas[index] = response.data
        }
      } catch (error) {
        this.errors = 'Error updating llamada: ' + error.message
      }
    },

    async deleteLlamada(id) {
      try {
        await axios.delete(API_BASE_URL + `/api/calls/${id}`)
        this.llamadas = this.llamadas.filter(l => l.id !== id)
      } catch (error) {
        this.errors = 'Error deleting llamada: ' + error.message
      }
    },
  },
})