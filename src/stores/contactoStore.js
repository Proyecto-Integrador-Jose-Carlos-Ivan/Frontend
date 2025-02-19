import { defineStore } from 'pinia';
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

// const token = '1|E3CKHEQ1chLIwQSBTLQv4aGrX0EmCZcGJCHIjG4L11bf2a48';

const API_BASE_URL = 'http://localhost';

export const useContactoStore = defineStore('contactoStore', {
  state: () => ({
    contactos: [],
    errors: null,
  }),

  getters: {
    totalContactos: (state) => state.contactos.length,
  },

  actions: {
    async fetchContactos() {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/contacts`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        this.contactos = response.data;
      } catch (error) {
        this.errors = 'Error cargando contactos: ' + error.message;
      }
    },

    async addContacto(contacto) {
      try {
        const response = await axios.post(`${API_BASE_URL}/api/contacts`, contacto, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        this.contactos.push(response.data);
      } catch (error) {
        this.errors = 'Error añadiendo contacto: ' + error.message;
      }
    },

    async updateContacto(id, contacto) {
      try {
        const response = await axios.put(`${API_BASE_URL}/api/contacts/${id}`, contacto, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const index = this.contactos.findIndex((c) => c.id === id);
        if (index !== -1) {
          this.contactos[index] = response.data;
        }
      } catch (error) {
        this.errors = 'Error actualizando contacto: ' + error.message;
      }
    },

    async deleteContacto(id) {
      try {
        await axios.delete(`${API_BASE_URL}/api/contacts/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        this.contactos = this.contactos.filter(c => c.id !== id);
      } catch (error) {
        this.errors = 'Error eliminando contacto: ' + error.message;
      }
    },
  },
});