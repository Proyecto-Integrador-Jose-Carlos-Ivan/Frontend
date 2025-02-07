import { defineStore } from 'pinia'
import axios from 'axios'

export const useBookStore = defineStore('cridades', {
  state: () => ({
    cridades: [],
    
  }),
  
  getters: {
    totalCridades: (state) => state.cridades.length,
    
  },

  
  actions: {
    async fetchCridades() {
      try {
        const response = await axios.get('http://localhost:3000/cridades')
        this.pacientes = response.data
      } catch (error) {
        this.error = 'Error loading cridades: ' + error.message
      }
    },
    
    async deleteCridades(id) {
      try {
        await axios.delete(`http://localhost:3000/cridades/${id}`)
        this.cridades = this.cridades.filter(cridada => cridada.id !== id)
      } catch (error) {
        this.error = 'Error deleting Cridades: ' + error.message
      }
    },
    
    async addCridada(cridada) {
      try {
        const response = await axios.post('http://localhost:3000/cridades', cridada)
        this.cridades.push(response.data)
      } catch (error) {
        this.error = 'Error adding Cridada: ' + error.message
      }
    },

    async getCridadaById(id) {
        return this.cridades.find((cridada) => cridada.id === id)
      },
      async updatePaciente(updatedCridada) {
        const index = this.cridades.findIndex((cridada) => cridada.id === updatedPaciente.id)
        if (index !== -1) {
          this.cridades[index] = updatedCridada
        }
      },
    },
});