// stores/operadoresStore.js
import { defineStore } from 'pinia'
import axios from 'axios'


// Configuración de axios
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

// URL base de la API
const API_BASE_URL = 'http://localhost'

export const useOperadoresStore = defineStore('operadores', {
  state: () => ({
    operadores: [],
    errors: null, 
  }),

  getters: {
    totalOperadores: (state) => state.operadores.length,
  },

  actions: {
    // Cargar los operadores desde la API
    async fetchOperadores() {
      try {
        const response = await axios.get(API_BASE_URL + '/api/operators', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        console.log('Operadores obtenidos:', response.data.data);
        this.operadores = response.data.data
      } catch (error) {
        this.errors = 'Error loading operadores: ' + error.message
        console.error(this.errors)
      }
    },

    // Agregar un nuevo operador
    async addOperador(operador) {
      try {
        const response = await axios.post(API_BASE_URL + '/api/operators', operador, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        this.operadores.push(response.data.data)
      } catch (error) {
        this.errors = 'Error adding operador: ' + error.message
        console.error(this.errors)
      }
    },

    // Actualizar un operador existente
    async updateOperador(id, operador) {
      try {
        const response = await axios.put(`${API_BASE_URL}/api/operators/${id}`, operador, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const index = this.operadores.findIndex((o) => o.id === id)
        if (index !== -1) {
          this.operadores[index] = response.data.data
        }
      } catch (error) {
        this.errors = 'Error updating operador: ' + error.message
        console.error(this.errors)
      }
    },

    // Eliminar un operador
    async deleteOperador(id) {
      try {
        await axios.delete(`${API_BASE_URL}/api/operators/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        this.operadores = this.operadores.filter((o) => o.id !== id)
      } catch (error) {
        this.errors = 'Error deleting operador: ' + error.message
        console.error(this.errors)
      }
    },
  },
})
