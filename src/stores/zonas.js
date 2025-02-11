import { defineStore } from 'pinia'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000'

export const useZonasStore = defineStore('zonas', {
  state: () => ({
    zonas: [],
    errors: null,
  }),

  getters: {
    totalZonas: (state) => state.zonas.length,
  },

  actions: {
    async fetchZonas() {
      try {
        const response = await axios.get(API_BASE_URL + '/api/zones')
        this.zonas = response.data
      } catch (error) {
        this.errors = 'Error loading zonas: ' + error.message
      }
    },
  },
})