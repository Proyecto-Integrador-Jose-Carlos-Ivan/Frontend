<template>
    <div class="reports-container">
      <h2>Generar Informes</h2>
  
      <!-- Filtros para generar informes -->
      <div class="filters">
        <label for="report-type">Tipo de informe:</label>
        <select id="report-type" v-model="reportType">
          <option value="emergencias">Emergencias por Zona</option>
          <option value="pacientes">Listado de Pacientes</option>
          <option value="llamadas-previstas">Llamadas Previstas</option>
          <option value="llamadas-realizadas">Llamadas Realizadas</option>
          <option value="historico">Histórico de Llamadas</option>
        </select>
  
        <!-- Filtros adicionales según el tipo de informe -->
        <div v-if="reportType === 'emergencias'">
          <label for="zona">Zona:</label>
          <input type="text" id="zona" v-model="zona" placeholder="Nombre de la zona">
        </div>
  
        <div v-if="reportType === 'llamadas-previstas' || reportType === 'llamadas-realizadas'">
          <label for="fecha">Fecha:</label>
          <input type="date" id="fecha" v-model="fecha">
          <label for="tipo">Tipo de llamada:</label>
          <select id="tipo" v-model="tipo">
            <option value="emergencia">Emergencia</option>
            <option value="social">Social</option>
            <option value="seguimiento">Seguimiento</option>
          </select>
          <label for="zona">Zona:</label>
          <input type="text" id="zona" v-model="zona" placeholder="Nombre de la zona">
        </div>
  
        <div v-if="reportType === 'historico'">
          <label for="paciente">Paciente:</label>
          <select id="paciente" v-model="pacientes">
            <option v-for="paciente in pacientes" :key="paciente.id" :value="paciente.id">
              {{ paciente.nombre }}
            </option>
          </select>
          <label for="tipo">Tipo de llamada:</label>
          <select id="tipo" v-model="tipo">
            <option value="emergencia">Emergencia</option>
            <option value="social">Social</option>
            <option value="seguimiento">Seguimiento</option>
          </select>
        </div>
  
        <button @click="generateReport" class="btn btn-primary">Generar Informe</button>
      </div>
  
      <!-- Mensaje de carga -->
      <div v-if="loading" class="loading">Cargando informe...</div>
  
      <!-- Resultados del informe -->
      <div v-else-if="informes.length > 0" class="report-content">
        <h3>Vista Previa del Informe</h3>
        <pre>{{ informes }}</pre>
  
        <!-- Botones para vista previa y descargar -->
        <div class="report-actions">
          <button @click="downloadReport" class="btn btn-download">Descargar Informe</button>
        </div>
      </div>
  
      <!-- Mensaje si no hay resultados -->
      <div v-else class="no-results">No se encontraron resultados.</div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useInformesStore } from '@/stores/informesStore';
  import { usePacientesStore } from '@/stores/pacientesStore';
  
  export default {
    setup() {
      const informesStore = useInformesStore();
      const pacientesStore = usePacientesStore();
  
      const reportType = ref('emergencias');
      const zona = ref('');
      const fecha = ref('');
      const tipo = ref('');
      const pacienteId = ref('');
      const informes = ref([]);
      const loading = ref(false);
  
      // Cargar pacientes al montar el componente
      onMounted(async () => {
        await pacientesStore.fetchPacientes();
      });
  
      const generateReport = async () => {
        loading.value = true;
        informes.value = [];
  
        try {
          switch (reportType.value) {
            case 'emergencias':
              await informesStore.fetchEmergenciesByZone(zona.value, fecha.value, fecha.value);
              break;
            case 'pacientes':
              await informesStore.fetchPacientesOrdenados();
              break;
            case 'llamadas-previstas':
              await informesStore.fetchLlamadasPrevistas(fecha.value, tipo.value, zona.value);
              break;
            case 'llamadas-realizadas':
              await informesStore.fetchLlamadasRealizadas(fecha.value, tipo.value, zona.value);
              break;
            case 'historico':
              await informesStore.fetchHistoricoLlamadas(pacienteId.value, tipo.value);
              break;
          }
  
          informes.value = informesStore.informes;
        } catch (error) {
          console.error('Error al generar el informe:', error);
        } finally {
          loading.value = false;
        }
      };
  
      const downloadReport = () => {
        const blob = new Blob([JSON.stringify(informes.value, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `informe-${reportType.value}.json`;
        link.click();
        URL.revokeObjectURL(url);
      };
  
      return {
        reportType,
        zona,
        fecha,
        tipo,
        pacienteId,
        informes,
        loading,
        pacientes: pacientesStore.pacientes,
        generateReport,
        downloadReport,
      };
    },
  };
  </script>
  
  <style scoped>
  .reports-container {
    padding: 2rem;
    padding-top: 120px; /* Ajusta este valor según la altura del segundo header */
  }
  
  .filters {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .filters label {
    font-weight: bold;
  }
  
  .filters input,
  .filters select {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .btn {
    padding: 0.5rem 1rem;
    background-color: #009879;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 0.5rem;
  }
  
  .btn:hover {
    background-color: #007f63;
  }
  
  .btn-download {
    background-color: #007bff;
  }
  
  .btn-download:hover {
    background-color: #0056b3;
  }
  
  .loading {
    font-style: italic;
    color: #666;
  }
  
  .report-content {
    background-color: #f0f0f0;
    padding: 1rem;
    border-radius: 4px;
    margin-top: 1rem;
  }
  
  .no-results {
    font-style: italic;
    color: #666;
    margin-top: 1rem;
  }
  
  .report-actions {
    margin-top: 1rem;
    text-align: right;
  }
  </style>