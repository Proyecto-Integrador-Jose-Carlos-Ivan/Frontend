import { defineStore } from 'pinia'
import axios from 'axios'

export const useBookStore = defineStore('informes', {
  state: () => ({
    informes: [],
    
  }),
  
  getters: {
    totalInformes: (state) => state.informes.length,
    
  },

  
  actions: {
    async fetchInformes() {
      try {
        const response = await axios.get('http://localhost:3000/informes')
        this.informes = response.data
      } catch (error) {
        this.error = 'Error loading informes: ' + error.message
      }
    },
    
    async deleteInformes(id) {
      try {
        await axios.delete(`http://localhost:3000/informes/${id}`)
        this.informes = this.informes.filter(infome => infome.id !== id)
      } catch (error) {
        this.error = 'Error deleting informes: ' + error.message
      }
    },
    
    async addInforme(informe) {
      try {
        const response = await axios.post('http://localhost:3000/informes', informe)
        this.informes.push(response.data)
      } catch (error) {
        this.error = 'Error adding Informes: ' + error.message
      }
    },

    async getInformeById(id) {
        return this.informes.find((informe) => informe.id === id)
      },
      async updateInforme(updatedInforme) {
        const index = this.informes.findIndex((informe) => informe.id === updatedInforme.id)
        if (index !== -1) {
          this.informes[index] = updatedInforme
        }
      },
    },
});