import { defineStore } from 'pinia'
import axios from 'axios'
const API_BASE_URL = 'http://localhost:3000'

export const useBookStore = defineStore('cridades', {
  state: () => ({
    cridades: [],
    
  }),
  
  getters: {
    totalCridades: (state) => state.cridades.length,
    
  },

  
  actions: {
    async fetchCridades(tipus = '') {
      const response = await axios.get(API_BASE_URL + `/api/cridades${tipus ? `?tipus=${tipus}` : ''}`);
      this.cridades = response.data;
    },
    async addCridada(cridada) {
      await axios.post(API_BASE_URL + '/api/cridades', cridada);
      this.fetchCridades();
    },
    async fetchHistorialByPacient(id) {
      const response = await axios.get(API_BASE_URL + `/api/pacients/${id}/cridades`);
      return response.data;
    },
    async fetchHistorialByTeleoperador(id) {
      const response = await axios.get(API_BASE_URL + `/api/teleoperadors/${id}/cridades`);
      return response.data;
    }
  
    },
});