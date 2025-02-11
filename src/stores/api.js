import { defineStore } from 'pinia'
import axios from 'axios'

// Definir la URL base de la API
const API_BASE_URL = 'http://localhost:3000'

export const useApiStore = defineStore('apiStore', {
  state: () => ({
    pacientes: [],
    contactos: [],
    llamadas: [],
    operadores: [],
    zonas: [],
    informes: [],
    emergencies: [],
    socials: [],
    seguiment: [],
    errors: null,  // Para manejar los errores
  }),

  getters: {
    totalPacientes: (state) => state.pacientes.length,
    totalContactos: (state) => state.contactos.length,
    totalLlamadas: (state) => state.llamadas.length,
    totalOperadores: (state) => state.operadores.length,
    totalZonas: (state) => state.zonas.length,
    totalInformes: (state) => state.informes.length,
    totalEmergencies: (state) => state.emergencies.length,
    totalSocials: (state) => state.socials.length,
    totalSeguiment: (state) => state.seguiment.length,
  },

  actions: {
    // Pacientes
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


    // Contactos
    async fetchContactos() {
      try {
        const response = await axios.get(API_BASE_URL + '/api/contacts')
        this.contactos = response.data
      } catch (error) {
        this.errors = 'Error loading contactos: ' + error.message
      }
    },

    async addContacto(contacto) {
      try {
        const response = await axios.post(API_BASE_URL + '/api/contacts', contacto)
        this.contactos.push(response.data)
      } catch (error) {
        this.errors = 'Error adding contacto: ' + error.message
      }
    },

    async updateContacto(id, contacto) {
      try {
        const response = await axios.put(API_BASE_URL + `/api/contacts/${id}`, contacto)
        const index = this.contactos.findIndex((c) => c.id === id)
        if (index !== -1) {
          this.contactos[index] = response.data
        }
      } catch (error) {
        this.errors = 'Error updating contacto: ' + error.message
      }
    },

    async deleteContacto(id) {
      try {
        await axios.delete(API_BASE_URL + `/api/contacts/${id}`)
        this.contactos = this.contactos.filter(c => c.id !== id)
      } catch (error) {
        this.errors = 'Error deleting contacto: ' + error.message
      }
    },


    
    // Llamadas
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

    // Operadores
    async fetchOperadores() {
      try {
        const response = await axios.get(API_BASE_URL + '/api/operators')
        this.operadores = response.data
      } catch (error) {
        this.errors = 'Error loading operadores: ' + error.message
      }
    },

    // Zonas
    async fetchZonas() {
      try {
        const response = await axios.get(API_BASE_URL + '/api/zones')
        this.zonas = response.data
      } catch (error) {
        this.errors = 'Error loading zonas: ' + error.message
      }
    },

    // Informes
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