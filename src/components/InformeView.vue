<template>
    <div class="reports-container">
      <h2>Informes</h2>
      <div class="filters">
        <label for="report-type">Tipo de informe:</label>
        <select id="report-type" v-model="reportType">
          <option value="emergencies">Emergencias</option>
          <option value="social">Llamadas sociales</option>
          <option value="follow-up">Seguimiento</option>
        </select>
        <label for="start-date">Fecha inicio:</label>
        <input type="date" id="start-date" v-model="startDate">
        <label for="end-date">Fecha fin:</label>
        <input type="date" id="end-date" v-model="endDate">
        <button @click="generateReport" class="btn btn-primary">Generar Informe</button>
      </div>
      <div v-if="loading" class="loading">Cargando informe...</div>
      <div v-else-if="report" class="report-content">
        <!-- Aquí se mostraría el contenido del informe -->
        <pre>{{ report }}</pre>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useApiStore } from '@/stores/api';
  
  export default {
    setup() {
      const apiStore = useApiStore();
      const reportType = ref('emergencies');
      const startDate = ref('');
      const endDate = ref('');
      const report = ref(null);
      const loading = ref(false);
  
      const generateReport = async () => {
        loading.value = true;
        try {
          const response = await apiStore.getReport(reportType.value, startDate.value, endDate.value);
          report.value = response;
        } catch (error) {
          console.error('Error al generar el informe:', error);
          report.value = 'Error al generar el informe. Por favor, inténtelo de nuevo.';
        } finally {
          loading.value = false;
        }
      };
  
      return {
        reportType,
        startDate,
        endDate,
        report,
        loading,
        generateReport
      };
    }
  };
  </script>
  
  <style scoped>
  .reports-container {
    padding: 2rem;
  }
  
  .filters {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .btn {
    padding: 0.5rem 1rem;
    background-color: #009879;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .btn:hover {
    background-color: #007f67;
  }
  
  .loading {
    font-style: italic;
    color: #666;
  }
  
  .report-content {
    background-color: #f0f0f0;
    padding: 1rem;
    border-radius: 4px;
  }
  </style>