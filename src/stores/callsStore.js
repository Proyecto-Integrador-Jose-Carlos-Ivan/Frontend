import { defineStore } from 'pinia';
import axios from 'axios';

// Configuración de axios
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

// URL base de la API
const API_BASE_URL = 'http://localhost'

export const useCallsStore = defineStore('calls', {
  state: () => ({
    calls: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchCalls() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(API_BASE_URL + '/api/calls',{
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
        console.log('Llamadas obtenidas:', response.data.data); // Ajusta la URL de la API
        this.calls = response.data.data;
      } catch (error) {
        this.error = error.message || 'Error al obtener llamadas';
      } finally {
        this.loading = false;
      }
    },

    async addCall(newCall) {
        try {
          const response = await axios.post(API_BASE_URL + '/api/calls', newCall, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          this.calls.push(response.data.data)
        } catch (error) {
          this.errors = 'Error adding operador: ' + error.message
          console.error(this.errors)
        }
      },

      async updateCall(id, call) {
        try {
          const response = await axios.put(`${API_BASE_URL}/api/calls/${id}`, call, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          const index = this.calls.findIndex((p) => p.id === id);
          if (index !== -1) {
            this.calls[index] = response.data.data; // Actualizar el paciente en la lista
          }
        } catch (error) {
          this.errors = 'Error al actualizar el paciente: ' + error.message;
        }
      },

      async removeCall(id) {
        try {
          await axios.delete(`${API_BASE_URL}/api/calls/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          this.calls = this.calls.filter((p) => p.id !== id); // Eliminar el paciente de la lista
        } catch (error) {
          this.errors = 'Error al eliminar el paciente: ' + error.message;
        }
      },
  }
});
