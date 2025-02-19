import { defineStore } from 'pinia';
import axios from 'axios';

// Configuración de axios
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

// Token de autenticación
// const token = '1|E3CKHEQ1chLIwQSBTLQv4aGrX0EmCZcGJCHIjG4L11bf2a48';

const API_BASE_URL = 'http://localhost';

export const useInformesStore = defineStore('informesStore', {
  state: () => ({
    informes: [], // Lista de informes
    emergencies: [], // Informes de emergencias
    socials: [], // Informes de llamadas sociales
    seguiment: [], // Informes de seguimiento
    errors: null, // Errores
    loading: false, // Estado de carga
  }),

  actions: {
    // Obtener informe de emergencias por zona y fecha
    async fetchEmergenciesByZone(zona, startDate, endDate) {
      this.loading = true;
      try {
        const response = await axios.get(`${API_BASE_URL}/api/informes/emergencies`, {
          params: { zona, startDate, endDate },
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        this.emergencies = response.data.data;
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
        const response = await axios.get(`${API_BASE_URL}/api/reports/patients-list`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          responseType: 'blob'
        });
        // Check if the response returns a valid Blob
        if (response.data && response.data.size > 0) {
          const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
          this.informes = url;
        } else {
          console.error("Response data is not a valid blob");
          this.informes = ""; // Ensure informes is a string
        }
      } catch (error) {
        console.error("Error fetching pacientes ordenados:", error);
        this.errors = 'Error cargando pacientes: ' + error.message;
        this.informes = ""; // Fallback value to ensure PDF URL is a string
      } finally {
        this.loading = false;
      }
    },

    // Obtener llamadas previstas para un día específico
    async fetchLlamadasPrevistas(fecha, tipo, zona) {
      this.loading = true;
      try {
        const response = await axios.get(`${API_BASE_URL}/api/llamadas/previstas`, {
          params: { fecha, tipo, zona },
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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
        const response = await axios.get(`${API_BASE_URL}/api/llamadas/realizadas`, {
          params: { fecha, tipo, zona },
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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
        const response = await axios.get(`${API_BASE_URL}/api/llamadas/historico`, {
          params: { pacienteId, tipo },
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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
        const response = await axios.get(`${API_BASE_URL}/api/informes`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        this.informes = response.data.data;
      } catch (error) {
        this.errors = 'Error cargando informes: ' + error.message;
      }
    },

    async fetchInformeEmergencies(data_inici, data_fi) {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/informes/emergencies?data_inici=${data_inici}&data_fi=${data_fi}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        this.emergencies = response.data.data;
      } catch (error) {
        this.errors = 'Error cargando informes de emergencias: ' + error.message;
      }
    },

    async fetchInformeSocials(data_inici, data_fi) {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/informes/socials?data_inici=${data_inici}&data_fi=${data_fi}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        this.socials = response.data.data;
      } catch (error) {
        this.errors = 'Error cargando informes sociales: ' + error.message;
      }
    },

    async fetchInformeSeguiment(data_inici, data_fi) {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/informes/seguiment?data_inici=${data_inici}&data_fi=${data_fi}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        this.seguiment = response.data.data;
      } catch (error) {
        this.errors = 'Error cargando informes de seguimiento: ' + error.message;
      }
    },
  },
  
});