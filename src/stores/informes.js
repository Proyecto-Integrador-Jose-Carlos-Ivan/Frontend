import { defineStore } from 'pinia'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000'
export const useBookStore = defineStore('informes', {
  state: () => ({
    informes: [],
    emergencies: [],

  }),
  
  getters: {
    totalInformes: (state) => state.informes.length,
    
  },

  
  actions: {
    async fetchInformes() {
      try {
        const response = await axios.get(API_BASE_URL + '/informes')
        this.informes = response.data
      } catch (error) {
        this.error = 'Error loading informes: ' + error.message
      }
    },
    
    async deleteInformes(id) {
      try {
        await axios.delete(API_BASE_URL + `/informes/${id}`)
        this.informes = this.informes.filter(infome => infome.id !== id)
      } catch (error) {
        this.error = 'Error deleting informes: ' + error.message
      }
    },
    
    async addInforme(informe) {
      try {
        const response = await axios.post(API_BASE_URL + '/informes', informe)
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
      async fetchInformeEmergencies(data_inici, data_fi) {
        const response = await axios.get(`/api/informes/emergencies?data_inici=${data_inici}&data_fi=${data_fi}`);
        return response.data;
      },
      async fetchInformeSocials(data_inici, data_fi) {
        const response = await axios.get(`/api/informes/socials?data_inici=${data_inici}&data_fi=${data_fi}`);
        return response.data;
      },
      async fetchInformeSeguiment(data_inici, data_fi) {
        const response = await axios.get(`/api/informes/seguiment?data_inici=${data_inici}&data_fi=${data_fi}`);
        return response.data;
      },
    
    },
});