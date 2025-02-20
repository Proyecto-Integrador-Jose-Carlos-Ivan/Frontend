<template>
  <div class="reports-container">
    <!-- Columna izquierda: Filtros -->
    <div class="filters-column">
      <div class="filters">
        <h2>Filtros del Informe</h2>

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
          <select id="zona" v-model="zona">
            <option value="">Todas las zonas</option>
            <option v-for="zonaItem in zonas" :key="zonaItem.id" :value="zonaItem.id">
              {{ zonaItem.name }}
            </option>
          </select>
        </div>

        <div v-if="reportType === 'llamadas-realizadas'">
          <label for="fecha">Fecha:</label>
          <input type="date" id="fecha" v-model="fecha">
          <label for="tipo">Tipo de llamada:</label>
          <select id="tipo" v-model="tipo">
            <option value="emergencia">Emergencia</option>
            <option value="social">Social</option>
            <option value="seguimiento">Seguimiento</option>
          </select>
          <label for="zona">Zona:</label>
          <select id="zona" v-model="zona">
            <option value="">Todas las zonas</option>
            <option v-for="zonaItem in zonas" :key="zonaItem.id" :value="zonaItem.id">
              {{ zonaItem.name }}
            </option>
          </select>
        </div>

        <div v-if="reportType === 'llamadas-previstas'">
          <label for="fecha">Fecha:</label>
          <input type="date" id="fecha" v-model="fecha">
          <label for="zona">Zona:</label>
          <select id="zona" v-model="zona">
            <option value="">Todas las zonas</option>
            <option v-for="zonaItem in zonas" :key="zonaItem.id" :value="zonaItem.id">
              {{ zonaItem.name }}
            </option>
          </select>
        </div>

        <div v-if="reportType === 'historico'">
          <label for="paciente">Paciente:</label>
          <select id="paciente" v-model="pacienteId">
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
        <button @click="showAllEmergencies" class="btn btn-secondary">Mostrar Todas las Emergencias</button>
      </div>
    </div>

    <!-- Columna derecha: Contenido principal -->
    <div class="main-content">
      <!-- Mensaje de carga -->
      <div v-if="loading" class="loading">Cargando informe...</div>

      <!-- Resultados del informe -->
      <div v-else-if="emergenciesUrl" class="report-content">
        <h3>Vista Previa del Informe</h3>
        <div class="pdf-content">
          <vue-pdf-embed :source="emergenciesUrl" :page="1" />
        </div>
        <div class="report-actions">
          <button @click="downloadPdf" class="btn btn-download">Descargar Informe</button>
        </div>
      </div>


    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useApiStore } from '@/stores/api';
import VuePdfEmbed from 'vue-pdf-embed';

export default {
  components: { VuePdfEmbed },
  setup() {
    const informesStore = useApiStore();
    const pacientesStore = useApiStore();

    const reportType = ref('emergencias');
    const zona = ref('');
    const fecha = ref('');
    const tipo = ref('');
    const pacienteId = ref('');
    const informes = ref([]);
    const loading = ref(false);
    const emergenciesUrl = ref(null);

    const zonas = computed(() => informesStore.zonas);

    onMounted(async () => {
      await pacientesStore.fetchPacientes();
      await informesStore.fetchZonas();
    });

    const generateReport = async () => {
      loading.value = true;
      informes.value = [];

      try {
        switch (reportType.value) {
          case 'emergencias':
          informes.value = [];
            await informesStore.fetchEmergenciesByZone(zona.value, fecha.value, fecha.value);
            emergenciesUrl.value = informesStore.emergencies;
            break;
          case 'pacientes':
          informes.value = [];
            await informesStore.fetchPacientesOrdenados();
            emergenciesUrl.value = informesStore.informes;
            break;
          case 'llamadas-previstas':
          informes.value = [];
            await informesStore.fetchLlamadasPrevistas(fecha.value, zona.value);
            emergenciesUrl.value = informesStore.informes;
            break;
          case 'llamadas-realizadas':
          informes.value = [];
            await informesStore.fetchLlamadasRealizadas(fecha.value, tipo.value, zona.value);
            emergenciesUrl.value = informesStore.informes;
            break;
          case 'historico':
          informes.value = [];
            await informesStore.fetchHistoricoLlamadas(pacienteId.value, tipo.value);
            emergenciesUrl.value = informesStore.informes;
            break;
        }
      } catch (error) {
        console.error('Error al generar el informe:', error);
      } finally {
        loading.value = false;
      }
    };

    const showAllEmergencies = async () => {
      loading.value = true;
      informes.value = [];

      try {
        await informesStore.fetchEmergenciesByZone('', '', '');
        informes.value = informesStore.emergencies;
      } catch (error) {
        console.error('Error al cargar todas las emergencias:', error);
      } finally {
        loading.value = false;
      }
    };

    const downloadPdf = () => {
      const link = document.createElement('a');
      link.href = emergenciesUrl.value;
      link.download = 'informe_emergencias.pdf';
      link.click();
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
      zonas,
      generateReport,
      showAllEmergencies,
      emergenciesUrl,
      downloadPdf,
    };
  },
};
</script>

<style scoped>
.reports-container {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 2rem;
  padding: 2rem;
  padding-top: 140px; /* Ajustar el padding superior */
}

.filters-column {
  grid-column: 1;
  position: sticky;
  top: 140px; /* Ajustar la posición sticky */
  height: fit-content;
}

.filters {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.filters label {
  font-weight: bold;
}

.filters input,
.filters select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
}

.btn {
  padding: 0.5rem 1rem;
  background-color: #009879;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
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

.pdf-content {
  flex-grow: 1;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.pdf-content ::v-deep .vue-pdf-embed {
  width: 800px;
  height: 500px;
}

@media (max-width: 768px) {
  .reports-container {
    grid-template-columns: 1fr;
    padding: 80px 10px 10px; /* Ajustar el padding para móviles */
  }

  .filters-column {
    position: static;
    margin-bottom: 1rem;
  }

  .filters {
    padding: 1rem;
  }

  .pdf-content ::v-deep .vue-pdf-embed {
    width: 100%;
    height: auto;
  }
}
</style>