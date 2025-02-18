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
    pacientes: [], // Lista de pacientes
    contactos: [], // Lista de contactos
    calls: [], // Lista de llamadas
    operadores: [], // Lista de operadores
    zonas: [], // Lista de zonas
    informes: [], // Lista de informes
    emergencies: [], // Informes de emergencias
    socials: [], // Informes de llamadas sociales
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

    async login (payload) {
      try {
        const response = await axios.post(`${API_BASE_URL}/api/login`, payload);
        const token = response.data.data.token;
        localStorage.setItem("token", token);
        this.token = token; // Actualizar el estado del store
      } catch (error) {
        console.error('Error al iniciar sesión:', error.response.data);
        this.errors = error.response.data; // Guardar errores en el estado
      }
    },
    // Acciones para manejar pacientes
    async fetchPacientes() {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/patients`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });
        console.log('Pacientes obtenidos:', response.data.data); // Verificar los datos
        this.pacientes = response.data.data; // Asignar los pacientes al estado
      } catch (error) {
        this.errors = 'Error al cargar los pacientes: ' + error.message;
        console.error(this.errors);
      }
    },

    // Agregar un nuevo paciente
    async addPaciente(paciente) {
      try {
        const response = await axios.post(`${API_BASE_URL}/api/patients`, paciente, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });
        this.pacientes.push(response.data.data); // Agregar el nuevo paciente a la lista
      } catch (error) {
        this.errors = 'Error al agregar el paciente: ' + error.message;
      }
    },

    // Actualizar un paciente existente
    async updatePaciente(id, paciente) {
      try {
        const response = await axios.put(`${API_BASE_URL}/api/patients/${id}`, paciente, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });
        const index = this.pacientes.findIndex((p) => p.id === id);
        if (index !== -1) {
          this.pacientes[index] = response.data.data; // Actualizar el paciente en la lista
        }
      } catch (error) {
        this.errors = 'Error al actualizar el paciente: ' + error.message;
      }
    },

    // Eliminar un paciente
    async deletePaciente(id) {
      try {
        await axios.delete(`${API_BASE_URL}/api/patients/${id}`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });
        this.pacientes = this.pacientes.filter((p) => p.id !== id); // Eliminar el paciente de la lista
      } catch (error) {
        this.errors = 'Error al eliminar el paciente: ' + error.message;
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
        this.contactos = response.data;
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
        this.contactos.push(response.data);
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
            'Authorization': `Bearer ${this.token}`
          }
        });
        this.contactos = this.contactos.filter(c => c.id !== id);
      } catch (error) {
        this.errors = 'Error eliminando contacto: ' + error.message;
      }
    },

    // Acciones para manejar llamadas
    async fetchCalls() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(API_BASE_URL + '/api/calls',{
            headers: {
              Authorization: `Bearer ${this.token}`,
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
              Authorization: `Bearer ${this.token}`,
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
              Authorization: `Bearer ${this.token}`,
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
              Authorization: `Bearer ${this.token}`,
            },
          });
          this.calls = this.calls.filter((p) => p.id !== id); // Eliminar el paciente de la lista
        } catch (error) {
          this.errors = 'Error al eliminar el paciente: ' + error.message;
        }
      },

    // Acciones para manejar operadores
    async fetchOperadores() {
      try {
        const response = await axios.get(API_BASE_URL + '/api/operators' ,{
            headers: {
              Authorization: `Bearer ${this.token}`,
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
            'Authorization': `Bearer ${this.token}`
          }
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
            'Authorization': `Bearer ${this.token}`
          }
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
        await axios.delete(`${API_BASE_URL}/api/operators/${id}` ,{
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });
        this.operadores = this.operadores.filter((o) => o.id !== id)
      } catch (error) {
        this.errors = 'Error deleting operador: ' + error.message
        console.error(this.errors)
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
        this.zonas = response.data.data;
      } catch (error) {
        this.errors = 'Error cargando zonas: ' + error.message;
      }
    },

    // Acciones para manejar informes
    async fetchEmergenciesByZone(zona, startDate, endDate) {
      this.loading = true;
      try {
        const response = await axios.get(`${API_BASE_URL}/api/reports/emergencies`, {
          params: { 
            zona: zona || null, // Si no hay zona, no se envía el parámetro
            startDate: startDate || '2014-01-01',
            endDate: endDate || new Date().toISOString().split('T')[0],
          },
          headers: { 
            Authorization: `Bearer ${this.token}`,
          },
          responseType: 'blob'
        });

        // Crear un enlace de descarga para el PDF
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        this.emergencies = url;

      } catch (error) {
        this.errors = 'Error cargando emergencias: ' + error.message;
      } finally {
        this.loading = false;
      }
    },

    // Obtener listado de pacientes ordenados por apellido
    async fetchPacientesOrdenados() {
      this.loading = true;
      try {
        const response = await axios.get(`${API_BASE_URL}/reports/patients-list`, {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        this.informes = response.data.data;
      } catch (error) {
        this.errors = 'Error cargando pacientes: ' + error.message;
      } finally {
        this.loading = false;
      }
    },

    // Obtener llamadas previstas para un día específico
    async fetchLlamadasPrevistas(fecha, tipo, zona) {
      this.loading = true;
      try {
        const response = await axios.get(`${API_BASE_URL}/api/calls/previstas`, {
          params: { fecha, tipo, zona },
          headers: { Authorization: `Bearer ${this.token}` },
        });
        this.informes = response.data.data;
      } catch (error) {
        this.errors = 'Error cargando llamadas previstas: ' + error.message;
      } finally {
        this.loading = false;
      }
    },

    // Obtener llamadas realizadas para un día específico
    async fetchLlamadasRealizadas(fecha, tipo, zona) {
      this.loading = true;
      try {
        const response = await axios.get(`${API_BASE_URL}/api/calls/realizadas`, {
          params: { fecha, tipo, zona },
          headers: { Authorization: `Bearer ${this.token}` },
        });
        this.informes = response.data.data;
      } catch (error) {
        this.errors = 'Error cargando llamadas realizadas: ' + error.message;
      } finally {
        this.loading = false;
      }
    },

    // Obtener histórico de llamadas por beneficiario y tipo
    async fetchHistoricoLlamadas(pacienteId, tipo) {
      this.loading = true;
      try {
        const response = await axios.get(`${API_BASE_URL}/api/calls/historico`, {
          params: { pacienteId, tipo },
          headers: { Authorization: `Bearer ${this.token}` },
        });
        this.informes = response.data.data;
      } catch (error) {
        this.errors = 'Error cargando histórico de llamadas: ' + error.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchInformes() {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/reports`, {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });
        this.informes = response.data.data;
      } catch (error) {
        this.errors = 'Error cargando informes: ' + error.message;
      }
    },

    async fetchInformeEmergencies(data_inici, data_fi) {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/reports/emergencies?data_inici=${data_inici}&data_fi=${data_fi}`, {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });
        this.emergencies = response.data.data;
      } catch (error) {
        this.errors = 'Error cargando informes de emergencias: ' + error.message;
      }
    },

    async fetchInformeSocials(data_inici, data_fi) {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/reports/socials?data_inici=${data_inici}&data_fi=${data_fi}`, {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });
        this.socials = response.data.data;
      } catch (error) {
        this.errors = 'Error cargando informes sociales: ' + error.message;
      }
    },

    async fetchInformeSeguiment(data_inici, data_fi) {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/reports/seguiment?data_inici=${data_inici}&data_fi=${data_fi}`, {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });
        this.seguiment = response.data.data;
      } catch (error) {
        this.errors = 'Error cargando informes de seguimiento: ' + error.message;
      }
    },
  },

});