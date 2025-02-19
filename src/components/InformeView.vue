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
            <option value="">Todas las zonas</option> <!-- Opción para todas las zonas -->
            <option v-for="zonaItem in zonas" :key="zonaItem.id" :value="zonaItem.id">
              {{ zonaItem.name }}
            </option>
          </select>
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
          <select id="zona" v-model="zona">
            <option value="">Todas las zonas</option> <!-- Opción para todas las zonas -->
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
      <h2>Generar Informes</h2>

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
      <button v-if="emergenciesUrl" @click="openPdfInPopup" class="btn btn-primary">Ver Informe de Emergencias</button>
    </div>
    <teleport to="body">
      <div v-if="showPopup" class="modal-overlay">
        <div class="modal-container">
          <PdfPopup :pdf-url="emergenciesUrl" @close="closePopup" />
        </div>
      </div>
    </teleport>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useApiStore } from '@/stores/api';
import PdfPopup from './PdfPopup.vue';

export default {
  components: { PdfPopup },
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
    const showPopup = ref(false);
    const llamadasPrevistas = ref([]);

    // Remove local zonas declaration and use computed instead
    const zonas = computed(() => informesStore.zonas);

    // Cargar pacientes y zonas al montar el componente
    onMounted(async () => {
      await pacientesStore.fetchPacientes();
      await informesStore.fetchZonas();
      console.log('Zonas fetched:', informesStore.zonas); // Add this line to check if zonas are fetched
    });

    const generateReport = async () => {
      loading.value = true;
      informes.value = [];

      try {
        switch (reportType.value) {
          case 'emergencias':
            await informesStore.fetchEmergenciesByZone(zona.value, fecha.value, fecha.value);
            emergenciesUrl.value = informesStore.emergencies;
            showPopup.value = true; // Open popup automatically
            break;
          case 'pacientes':
            await informesStore.fetchPacientesOrdenados();
            // Set the PDF URL from informes and open popup
            emergenciesUrl.value = informesStore.informes;
            showPopup.value = true;
            break;
          case 'llamadas-previstas':
            await informesStore.fetchLlamadasPrevistas(fecha.value, tipo.value, zona.value);
            emergenciesUrl.value = informesStore.llamadasPrevistas;
            showPopup.value = true;
            break;
          case 'llamadas-realizadas':
            await informesStore.fetchLlamadasRealizadas(fecha.value, tipo.value, zona.value);
            emergenciesUrl.value = informesStore.informes;
            showPopup.value = true;
            break;
          case 'historico':
            await informesStore.fetchHistoricoLlamadas(pacienteId.value, tipo.value);
            emergenciesUrl.value = informesStore.informes;
            showPopup.value = true;
            break;
        }

        informes.value = informesStore.informes;
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
        await informesStore.fetchEmergenciesByZone('', '', ''); // Sin filtros
        informes.value = informesStore.emergencies;
      } catch (error) {
        console.error('Error al cargar todas las emergencias:', error);
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

    const openPdfInPopup = () => {
      showPopup.value = true;
    };

    const closePopup = () => {
      showPopup.value = false;
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
      downloadReport,
      emergenciesUrl,
      openPdfInPopup,
      showPopup,
      closePopup,
      llamadasPrevistas,
    };
  },
};
</script>

<style scoped>
.reports-container {
  display: grid;
  grid-template-columns: 400px 1fr; /* Filtros más anchos a la izquierda */
  gap: 2rem;
  padding: 2rem;
  padding-top: 120px;
}

.filters-column {
  grid-column: 1;
  position: sticky;
  top: 120px;
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
  width: 100%; /* Asegura que los inputs y selects ocupen todo el ancho */
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

/* Estilos del modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
}

.modal-container {
  background-color: white;
  padding: 1.5rem;
  border-radius: 12px;
  width: 90%; /* Adjust width */
  max-width: 800px; /* Maximum width */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .reports-container {
    grid-template-columns: 1fr; /* Una sola columna en móviles */
  }

  .filters-column {
    grid-column: 1;
    position: static;
  }
}
</style>