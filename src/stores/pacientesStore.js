import { defineStore } from 'pinia';
import axios from 'axios';

// Configuración de axios
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

// Token de autenticación
const token = '1|E3CKHEQ1chLIwQSBTLQv4aGrX0EmCZcGJCHIjG4L11bf2a48';

// URL base de la API
const API_BASE_URL = 'http://localhost';

export const usePacientesStore = defineStore('pacientesStore', {
  state: () => ({
    pacientes: [], // Lista de pacientes
    searchQuery: '',
    errors: null,  // Errores
  }),

  getters: {
    totalPacientes: (state) => state.pacientes.length,
    pacientesFiltrados: (state) => {
      return state.pacientes.filter(paciente =>
        paciente.name.toLowerCase().includes(state.searchQuery.toLowerCase())
      )
    }, // Total de pacientes
  },

  actions: {
    // Obtener la lista de pacientes
    async fetchPacientes() {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/patients`, {
          headers: {
            Authorization: `Bearer ${token}`,
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
            Authorization: `Bearer ${token}`,
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
            Authorization: `Bearer ${token}`,
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
            Authorization: `Bearer ${token}`,
          },
        });
        this.pacientes = this.pacientes.filter((p) => p.id !== id); // Eliminar el paciente de la lista
      } catch (error) {
        this.errors = 'Error al eliminar el paciente: ' + error.message;
      }
    },
  },
});