import { defineStore } from 'pinia'
import axios from 'axios'

// Configuración de axios para manejar cookies y CORS
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

// URL base de la API
const API_BASE_URL = 'http://localhost'

export const useApiStore = defineStore('apiStore', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    pacientes: [], // Lista de pacientes
    contactos: [], // Lista de contactos
    llamadas: [], // Lista de llamadas
    operadores: [], // Lista de operadores
    zonas: [], // Lista de zonas
    informes: [], // Lista de informes
    emergencies: [], // Lista de emergencias
    socials: [], // Lista de informes sociales
    seguiment: [], // Lista de seguimientos
    errors: null, // Errores
  }),

  getters: {
    // Verifica si el usuario está autenticado
    isAuthenticated: (state) => !!state.token,

    // Getters para contar elementos (opcional)
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
    
    setToken(token) {
      this.token = token;
      localStorage.setItem('token', token);
    },

    setUser(user) {
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },

    async fetchUser() {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/user`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });
        this.setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    },

    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    // Acciones para manejar pacientes
    async fetchPacientes() {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/patients`, {
          headers: {
            'Authorization': `Bearer ${this.token}` // Usa el token almacenado
          }
        });
        this.pacientes = response.data; // Almacena los pacientes en el estado
      } catch (error) {
        this.errors = 'Error cargando pacientes: ' + error.message;
        console.error(this.errors);
      }
    },

    async addPaciente(paciente) {
      try {
        const response = await axios.post(`${API_BASE_URL}/api/patients`, paciente, {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });
        this.pacientes.push(response.data); // Añade el nuevo paciente a la lista
      } catch (error) {
        this.errors = 'Error añadiendo paciente: ' + error.message;
      }
    },

    async updatePaciente(id, paciente) {
      try {
        const response = await axios.put(`${API_BASE_URL}/api/patients/${id}`, paciente, {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });
        const index = this.pacientes.findIndex((p) => p.id === id);
        if (index !== -1) {
          this.pacientes[index] = response.data; // Actualiza el paciente en la lista
        }
      } catch (error) {
        this.errors = 'Error actualizando paciente: ' + error.message;
      }
    },

    async deletePaciente(id) {
      try {
        await axios.delete(`${API_BASE_URL}/api/patients/${id}`, {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });
        this.pacientes = this.pacientes.filter(p => p.id !== id); // Elimina el paciente de la lista
      } catch (error) {
        this.errors = 'Error eliminando paciente: ' + error.message;
      }
    },

    // Acciones para manejar contactos
    async fetchContactos() {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/contacts`, {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });
        this.contactos = response.data; // Almacena los contactos en el estado
      } catch (error) {
        this.errors = 'Error cargando contactos: ' + error.message;
      }
    },

    async addContacto(contacto) {
      try {
        const response = await axios.post(`${API_BASE_URL}/api/contacts`, contacto, {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });
        this.contactos.push(response.data); // Añade el nuevo contacto a la lista
      } catch (error) {
        this.errors = 'Error añadiendo contacto: ' + error.message;
      }
    },

    async updateContacto(id, contacto) {
      try {
        const response = await axios.put(`${API_BASE_URL}/api/contacts/${id}`, contacto, {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });
        const index = this.contactos.findIndex((c) => c.id === id);
        if (index !== -1) {
          this.contactos[index] = response.data; // Actualiza el contacto en la lista
        }
      } catch (error) {
        this.errors = 'Error actualizando contacto: ' + error.message;
      }
    },

    async deleteContacto(id) {
      try {
        await axios.delete(`${API_BASE_URL}/api/contacts/${id}`, {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });
        this.contactos = this.contactos.filter(c => c.id !== id); // Elimina el contacto de la lista
      } catch (error) {
        this.errors = 'Error eliminando contacto: ' + error.message;
      }
    },

    // Acciones para manejar llamadas
    async fetchLlamadas() {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/calls`, {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });
        this.llamadas = response.data.data; // Almacena las llamadas en el estado
      } catch (error) {
        this.errors = 'Error cargando llamadas: ' + error.message;
      }
    },

    async addLlamada(llamada) {
      try {
        const response = await axios.post(`${API_BASE_URL}/api/calls`, llamada, {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });
        this.llamadas.push(response.data.data); // Añade la nueva llamada a la lista
      } catch (error) {
        this.errors = 'Error añadiendo llamada: ' + error.message;
      }
    },

    async updateLlamada(id, llamada) {
      try {
        const response = await axios.put(`${API_BASE_URL}/api/calls/${id}`, llamada, {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });
        const index = this.llamadas.findIndex((l) => l.id === id);
        if (index !== -1) {
          this.llamadas[index] = response.data.data; // Actualiza la llamada en la lista
        }
      } catch (error) {
        this.errors = 'Error actualizando llamada: ' + error.message;
      }
    },

    async deleteLlamada(id) {
      try {
        await axios.delete(`${API_BASE_URL}/api/calls/${id}`, {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });
        this.llamadas = this.llamadas.filter(l => l.id !== id); // Elimina la llamada de la lista
      } catch (error) {
        this.errors = 'Error eliminando llamada: ' + error.message;
      }
    },

    // Acciones para manejar operadores
    async fetchOperadores() {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/operators`, {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });
        this.operadores = response.data.data; // Almacena los operadores en el estado
      } catch (error) {
        this.errors = 'Error cargando operadores: ' + error.message;
      }
    },

    // Acciones para manejar zonas
    async fetchZonas() {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/zones`, {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });
        this.zonas = response.data.data; // Almacena las zonas en el estado
      } catch (error) {
        this.errors = 'Error cargando zonas: ' + error.message;
      }
    },

    // Acciones para manejar informes
    async fetchInformes() {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/informes`, {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });
        this.informes = response.data.data; // Almacena los informes en el estado
      } catch (error) {
        this.errors = 'Error cargando informes: ' + error.message;
      }
    },

    async fetchInformeEmergencies(data_inici, data_fi) {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/informes/emergencies?data_inici=${data_inici}&data_fi=${data_fi}`, {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });
        this.emergencies = response.data.data; // Almacena las emergencias en el estado
      } catch (error) {
        this.errors = 'Error cargando informes de emergencias: ' + error.message;
      }
    },

    async fetchInformeSocials(data_inici, data_fi) {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/informes/socials?data_inici=${data_inici}&data_fi=${data_fi}`, {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });
        this.socials = response.data.data; // Almacena los informes sociales en el estado
      } catch (error) {
        this.errors = 'Error cargando informes sociales: ' + error.message;
      }
    },

    async fetchInformeSeguiment(data_inici, data_fi) {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/informes/seguiment?data_inici=${data_inici}&data_fi=${data_fi}`, {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });
        this.seguiment = response.data.data; // Almacena los seguimientos en el estado
      } catch (error) {
        this.errors = 'Error cargando informes de seguimiento: ' + error.message;
      }
    },
  },
});