import { defineStore } from 'pinia'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000'

export const useContactosStore = defineStore('contactos', {
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
  },
})