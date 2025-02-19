import { defineStore } from 'pinia';
import axios from 'axios';

const API_BASE_URL = 'http://localhost';

export const useZonaStore = defineStore('zonaStore', {
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
        const response = await axios.get(`${API_BASE_URL}/api/zones`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        this.zonas = response.data.data;
      } catch (error) {
        this.errors = 'Error cargando zonas: ' + error.message;
      }
    },
  },
});