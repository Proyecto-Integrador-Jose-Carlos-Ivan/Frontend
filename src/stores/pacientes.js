import { defineStore } from 'pinia'
import axios from 'axios'

export const useBookStore = defineStore('pacientes', {
  state: () => ({
    pacientes: [],
    
  }),
  
  getters: {
    totalPacientes: (state) => state.pacientes.length,
    
  },

  
  actions: {
    async fetchPacientes() {
      try {
        const response = await axios.get('http://localhost:3000/pacientes')
        this.pacientes = response.data
      } catch (error) {
        this.error = 'Error loading pacientes: ' + error.message
      }
    },
    
    async deletePaciente(id) {
      try {
        await axios.delete(`http://localhost:3000/pacientes/${id}`)
        this.pacientes = this.pacientes.filter(paciente => paciente.id !== id)
      } catch (error) {
        this.error = 'Error deleting pacientes: ' + error.message
      }
    },
    
    async addPaciente(paciente) {
      try {
        const response = await axios.post('http://localhost:3000/pacientes', paciente)
        this.pacientes.push(response.data)
      } catch (error) {
        this.error = 'Error adding book: ' + error.message
      }
    },

    async getPacienteById(id) {
        return this.pacientes.find((paciente) => paciente.id === id)
      },
      async updatePaciente(updatedPaciente) {
        const index = this.pacientes.findIndex((paciente) => paciente.id === updatedPaciente.id)
        if (index !== -1) {
          this.pacientes[index] = updatedPaciente
        }
      },
    },
});