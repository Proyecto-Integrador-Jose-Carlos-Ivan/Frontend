// stores/operadoresStore.js
import { defineStore } from 'pinia'
import axios from 'axios'


// Configuración de axios
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

// Token de autenticación
const token = '4|7Q3PY0h4AJvN1XVnbzMjOR7s9LQQA9FzyEFOsSxi00d1e7ea';

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
        const response = await axios.get(API_BASE_URL + '/api/operators' ,{
            headers: {
              Authorization: `Bearer ${token}`,
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
        const response = await axios.post(API_BASE_URL + '/api/operators', operador)
        this.operadores.push(response.data.data)
      } catch (error) {
        this.errors = 'Error adding operador: ' + error.message
        console.error(this.errors)
      }
    },

    // Actualizar un operador existente
    async updateOperador(id, operador) {
      try {
        const response = await axios.put(`${API_BASE_URL}/api/operators/${id}`, operador)
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
        await axios.delete(`${API_BASE_URL}/api/operators/${id}`)
        this.operadores = this.operadores.filter((o) => o.id !== id)
      } catch (error) {
        this.errors = 'Error deleting operador: ' + error.message
        console.error(this.errors)
      }
    },
  },
})
