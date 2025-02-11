import { defineStore } from 'pinia'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000'

export const usePacientesStore = defineStore('pacientes', {
  state: () => ({
    pacientes: [],
    errors: null,
  }),

  getters: {
    totalPacientes: (state) => state.pacientes.length,
  },

  actions: {
    async fetchPacientes() {
      try {
        const response = await axios.get(API_BASE_URL + '/api/pacients')
        this.pacientes = response.data
      } catch (error) {
        this.errors = 'Error loading pacientes: ' + error.message
      }
    },

    async addPaciente(paciente) {
      try {
        const response = await axios.post(API_BASE_URL + '/api/pacients', paciente)
        this.pacientes.push(response.data)
      } catch (error) {
        this.errors = 'Error adding paciente: ' + error.message
      }
    },

    async updatePaciente(id, paciente) {
      try {
        const response = await axios.put(API_BASE_URL + `/api/pacients/${id}`, paciente)
        const index = this.pacientes.findIndex((p) => p.id === id)
        if (index !== -1) {
          this.pacientes[index] = response.data
        }
      } catch (error) {
        this.errors = 'Error updating paciente: ' + error.message
      }
    },

    async deletePaciente(id) {
      try {
        await axios.delete(API_BASE_URL + `/api/pacients/${id}`)
        this.pacientes = this.pacientes.filter(p => p.id !== id)
      } catch (error) {
        this.errors = 'Error deleting paciente: ' + error.message
      }
    },
  },
})