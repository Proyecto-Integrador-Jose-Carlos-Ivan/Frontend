import { defineStore } from 'pinia'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000'

export const useInformesStore = defineStore('informes', {
  state: () => ({
    informes: [],
    emergencies: [],
    socials: [],
    seguiment: [],
    errors: null,
  }),

  getters: {
    totalInformes: (state) => state.informes.length,
    totalEmergencies: (state) => state.emergencies.length,
    totalSocials: (state) => state.socials.length,
    totalSeguiment: (state) => state.seguiment.length,
  },

  actions: {
    async fetchInformes() {
      try {
        const response = await axios.get(API_BASE_URL + '/api/informes')
        this.informes = response.data
      } catch (error) {
        this.errors = 'Error loading informes: ' + error.message
      }
    },

    async fetchInformeEmergencies(data_inici, data_fi) {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/informes/emergencies?data_inici=${data_inici}&data_fi=${data_fi}`)
        this.emergencies = response.data
      } catch (error) {
        this.errors = 'Error fetching emergency reports: ' + error.message
      }
    },

    async fetchInformeSocials(data_inici, data_fi) {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/informes/socials?data_inici=${data_inici}&data_fi=${data_fi}`)
        this.socials = response.data
      } catch (error) {
        this.errors = 'Error fetching social reports: ' + error.message
      }
    },

    async fetchInformeSeguiment(data_inici, data_fi) {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/informes/seguiment?data_inici=${data_inici}&data_fi=${data_fi}`)
        this.seguiment = response.data
      } catch (error) {
        this.errors = 'Error fetching tracking reports: ' + error.message
      }
    },
  },
})