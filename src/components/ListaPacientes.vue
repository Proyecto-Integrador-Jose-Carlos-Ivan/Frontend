<template>
  <div class="main-container">
    <div class="container">
      <div class="pacientes">
        <!-- Header con "Mis Pacientes" y la fecha -->
        <div class="header-container">
          <h2>Llamadas y Avisos de Pacientes</h2>
          <div class="filter-buttons">
            <button @click="changeFilter('llamadas')" :class="{ active: mostrarLlamadas && !mostrarTodos }">Mostrar Llamadas</button>
            <button @click="changeFilter('avisos')" :class="{ active: !mostrarLlamadas && !mostrarTodos }">Mostrar Avisos</button>
            <button @click="changeFilter('todo')" :class="{ active: mostrarTodos }">Mostrar Todo</button>
          </div>
        </div>

        <!-- Tabla de pacientes y llamadas/avisos -->
        <table v-if="datosPaginados.length > 0" class="styled-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>DNI</th>
              <th>Fecha</th>
              <th v-if="mostrarLlamadas || mostrarTodos">Hora</th>
              <th>Categoría</th>
              <th>Subtipo</th>
              <th>Tipo</th>
              <th v-if="!mostrarLlamadas">Recurrencia</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="paciente in datosPaginados"
              :key="paciente.id"
              @click="mostrarDetallesPaciente(paciente)"
              class="clickable-row"
            >
              <td>{{ paciente.nombre || "No disponible" }}</td>
              <td>{{ paciente.telefono || "No disponible" }}</td>
              <td>{{ paciente.dni || "No disponible" }}</td>
              <td>{{ formatFecha(paciente.fecha_hora || paciente.fecha) }}</td>
              <td v-if="mostrarLlamadas || mostrarTodos">{{ mostrarLlamadas ? formatHora(paciente.fecha_hora) : (paciente.tipo === 'Llamada' ? formatHora(paciente.fecha_hora) : "N/A") }}</td>
              <td>{{ paciente.categoria ? formatCategoria(paciente.categoria) : "N/A" }}</td>
              <td>{{ paciente.subtipo ? formatSubtipo(paciente.subtipo) : "N/A" }}</td>
              <td>{{ paciente.tipo }}</td>
              <td v-if="!mostrarLlamadas">{{ paciente.recurrencia || "N/A" }}</td>
            </tr>
          </tbody>
        </table>
        <p v-else>No hay datos disponibles para esta fecha</p>
        <div class="pagination" v-if="totalPages > 1">
          <button @click="prevPage" :disabled="currentPage === 1">Anterior</button>
          <span>Página {{ currentPage }} de {{ totalPages }}</span>
          <button @click="nextPage" :disabled="currentPage === totalPages">Siguiente</button>
        </div>
      </div>

      <!-- Calendario o detalles del paciente -->
      <div class="calendario" v-if="!mostrarDetalles">
        <VDatePicker
          v-model="date"
          mode="date"
          expanded
          @update:modelValue="onDateChange"
        >
          <template #footer>
            <button @click="moveToday" class="custom-button">Hoy</button>
          </template>
        </VDatePicker>
      </div>

      <!-- Detalles del paciente -->
      <transition name="detalles-paciente">
        <div class="detalles-paciente" v-if="mostrarDetalles">
          <div class="detalles-header">
            <h2>Detalles del Paciente</h2>
            <button @click="cerrarDetalles" class="close-btn">&times;</button>
          </div>
          <div class="detalles-body">
            <div class="form-group">
              <label><strong>Nombre:</strong></label>
              <span>{{ pacienteSeleccionado.nombre }}</span>
            </div>
            <div class="form-group">
              <label><strong>Teléfono:</strong></label>
              <span>{{ pacienteSeleccionado.telefono }}</span>
            </div>
            <div class="form-group">
              <label><strong>DNI:</strong></label>
              <span>{{ pacienteSeleccionado.dni }}</span>
            </div>
            <div class="form-group">
              <label><strong>Email:</strong></label>
              <span>{{ pacienteSeleccionado.email }}</span>
            </div>
            <div class="form-group">
              <label><strong>Dirección:</strong></label>
              <span>{{ pacienteSeleccionado.direccion }}</span>
            </div>
            <div class="form-group">
              <label><strong>SIP:</strong></label>
              <span>{{ pacienteSeleccionado.sip }}</span>
            </div>
            <div class="form-group">
              <label><strong>Situación Personal:</strong></label>
              <span>{{ pacienteSeleccionado.situacion_personal }}</span>
            </div>
            <div class="form-group">
              <label><strong>Situación Económica:</strong></label>
              <span>{{ pacienteSeleccionado.situacion_economica }}</span>
            </div>
            <div class="form-group">
              <label><strong>Situación Sanitaria:</strong></label>
              <span>{{ pacienteSeleccionado.situacion_sanitaria }}</span>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { useApiStore } from '@/stores/api'; // Importar el store de llamadas y avisos
import { computed, ref, onMounted } from 'vue';

export default {
  setup() {
    const pacientesStore = useApiStore();
    const callsStore = useApiStore();
    const avisosStore = useApiStore();
    const date = ref(null); // Fecha seleccionada en el calendario (null por defecto)
    const mostrarDetalles = ref(false);
    const pacienteSeleccionado = ref({});
    const mostrarLlamadas = ref(true); // Estado para alternar entre llamadas y avisos
    const mostrarTodos = ref(false); // Estado para mostrar todo

    // Obtener pacientes, llamadas y avisos al montar el componente
    onMounted(async () => {
      await pacientesStore.fetchPacientes();
      await callsStore.fetchCalls();
      await avisosStore.fetchAvisos();
    });

    // Función para normalizar fechas (ignorar hora y zona horaria)
    const normalizarFecha = (fecha) => {
      const dateObj = new Date(fecha);
      return new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
    };

    // Combinar datos de pacientes y llamadas, excluyendo pacientes sin llamadas
    const datosCombinadosLlamadas = computed(() => {
      return pacientesStore.pacientes
        .map((paciente) => {
          const llamadasPaciente = callsStore.calls.filter(
            (llamada) => llamada.paciente_id === paciente.id
          );

          return llamadasPaciente.map((llamada) => ({
            ...paciente,
            ...llamada,
            tipo: `Llamada ${llamada.sentido}` // Include call direction in the type
          }));
        })
        .flat();
    });

    // Combinar datos de pacientes y avisos, excluyendo pacientes sin avisos
    const datosCombinadosAvisos = computed(() => {
      return pacientesStore.pacientes
        .map((paciente) => {
          const avisosPaciente = avisosStore.avisos.filter(
            (aviso) => aviso.paciente_id === paciente.id
          );

          return avisosPaciente.map((aviso) => ({
            ...paciente,
            ...aviso,
            tipo: 'Aviso',
            categoria: aviso.tipo // Rellenar el campo categoria con el dato "tipo"
          }));
        })
        .flat();
    });

    // Combinar datos de pacientes, llamadas y avisos
    const datosCombinadosTodo = computed(() => {
      return [...datosCombinadosLlamadas.value, ...datosCombinadosAvisos.value];
    });

    // Filtrar pacientes por la fecha seleccionada en el calendario y ordenar por hora (llamadas)
    const datosCombinadosLlamadasFiltrados = computed(() => {
      if (!date.value) return datosCombinadosLlamadas.value; // Si no hay fecha seleccionada, mostrar todos

      const fechaSeleccionada = normalizarFecha(date.value); // Normalizar la fecha seleccionada

      return datosCombinadosLlamadas.value
        .filter((paciente) => {
          const fechaLlamada = normalizarFecha(paciente.fecha_hora); // Normalizar la fecha de la llamada
          return fechaLlamada.getTime() === fechaSeleccionada.getTime(); // Comparar fechas
        })
        .sort((a, b) => {
          const horaA = new Date(a.fecha_hora).getTime();
          const horaB = new Date(b.fecha_hora).getTime();
          return horaA - horaB;
        });
    });

    // Filtrar pacientes por la fecha seleccionada en el calendario y ordenar por hora (avisos)
    const datosCombinadosAvisosFiltrados = computed(() => {
      if (!date.value) return datosCombinadosAvisos.value; // Si no hay fecha seleccionada, mostrar todos

      const fechaSeleccionada = normalizarFecha(date.value); // Normalizar la fecha seleccionada

      return datosCombinadosAvisos.value
        .filter((paciente) => {
          const fechaAviso = normalizarFecha(paciente.fecha); // Normalizar la fecha del aviso
          return fechaAviso.getTime() === fechaSeleccionada.getTime(); // Comparar fechas
        })
        .sort((a, b) => {
          const horaA = new Date(a.fecha).getTime();
          const horaB = new Date(b.fecha).getTime();
          return horaA - horaB;
        });
    });

    // Filtrar pacientes por la fecha seleccionada en el calendario y ordenar por hora (todo)
    const datosCombinadosTodoFiltrados = computed(() => {
      if (!date.value) return datosCombinadosTodo.value; // Si no hay fecha seleccionada, mostrar todos

      const fechaSeleccionada = normalizarFecha(date.value); // Normalizar la fecha seleccionada

      return datosCombinadosTodo.value
        .filter((paciente) => {
          const fechaPaciente = normalizarFecha(paciente.fecha_hora || paciente.fecha); // Normalizar la fecha del paciente
          return fechaPaciente.getTime() === fechaSeleccionada.getTime(); // Comparar fechas
        })
        .sort((a, b) => {
          const horaA = new Date(a.fecha_hora || a.fecha).getTime();
          const horaB = new Date(b.fecha_hora || b.fecha).getTime();
          return horaA - horaB;
        });
    });

    // Formatear la fecha
    const formatFecha = (fechaHora) => {
      if (!fechaHora) return "No disponible";
      const dateObj = new Date(fechaHora);
      return dateObj.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    // Formatear la hora
    const formatHora = (fechaHora) => {
      if (!fechaHora) return "No disponible";
      const dateObj = new Date(fechaHora);
      return dateObj.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    // Formatear la categoría
    const formatCategoria = (categoria) => {
      if (!categoria) return "N/A";
      return categoria
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    // Formatear el subtipo
    const formatSubtipo = (subtipo) => {
      if (!subtipo) return "N/A";
      return subtipo
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    // Mostrar detalles del paciente
    const mostrarDetallesPaciente = (paciente) => {
      pacienteSeleccionado.value = paciente;
      mostrarDetalles.value = true;
    };

    // Cerrar detalles del paciente
    const cerrarDetalles = () => {
      mostrarDetalles.value = false;
    };

    // Mover el calendario al día de hoy
    const moveToday = () => {
      date.value = new Date(); // Establece la fecha actual
    };

    // Manejar el cambio de fecha en el calendario
    const onDateChange = (newDate) => {
      date.value = new Date(newDate); // Asegurarse de que la fecha se maneje correctamente
    };

    // Obtener datos filtrados según el estado
    const datosFiltrados = computed(() => {
      if (mostrarTodos.value) return datosCombinadosTodoFiltrados.value;
      return mostrarLlamadas.value ? datosCombinadosLlamadasFiltrados.value : datosCombinadosAvisosFiltrados.value;
    });

    const currentPage = ref(1);
    const itemsPerPage = 4; // Show only 4 patients per page

    const totalPages = computed(() => {
      return Math.ceil(datosFiltrados.value.length / itemsPerPage);
    });

    const datosPaginados = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return datosFiltrados.value.slice(start, end);
    });

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };

    const changeFilter = (filter) => {
      currentPage.value = 1; // Reset pagination to page 1
      if (filter === 'llamadas') {
        mostrarLlamadas.value = true;
        mostrarTodos.value = false;
      } else if (filter === 'avisos') {
        mostrarLlamadas.value = false;
        mostrarTodos.value = false;
      } else if (filter === 'todo') {
        mostrarLlamadas.value = false;
        mostrarTodos.value = true;
        date.value = null; // Reset the date selector
      }
    };

    return {
      pacientesStore,
      callsStore,
      avisosStore,
      date,
      mostrarLlamadas,
      mostrarTodos,
      datosFiltrados,
      formatFecha,
      formatHora,
      formatCategoria,
      formatSubtipo,
      mostrarDetalles,
      pacienteSeleccionado,
      mostrarDetallesPaciente,
      cerrarDetalles,
      moveToday,
      onDateChange,
      currentPage,
      totalPages,
      datosPaginados,
      nextPage,
      prevPage,
      changeFilter,
    };
  },
};
</script>

<style scoped>
.main-container {
  display: grid;
  justify-content: center; /* Centrar el contenido horizontalmente */
  padding-top: 100px; /* Ajusta este valor según la altura de tu header secundario */
  padding-bottom: 20px; /* Añadir padding inferior */
}

.container {
  display: grid;
  grid-template-columns: 1fr 300px; /* Ensanchar el cuadro que contiene la tabla y reducir el ancho del calendario */
  gap: 1.5rem;
  max-width: 100%;
  margin: 0 auto;
  padding: 20px; /* Ajusta el padding según sea necesario */
  align-items: start;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem; /* Reducir el margen inferior */
}

.filter-buttons {
  display: flex;
  gap: 1rem;
}

.filter-buttons button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #3498db;
  color: white;
  font-weight: 600;
}

.filter-buttons button.active {
  background-color: #2980b9;
}

.pacientes {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1rem; /* Reducir el padding */
  overflow-x: visible; /* Cambiar a visible para evitar scroll horizontal */
  max-width: 100%;
  width: 100%; /* Asegurar que ocupe todo el espacio disponible */
}

.styled-table {
  width: 100%; /* La tabla ocupa el 100% del ancho disponible */
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.9rem;
  table-layout: auto; /* Asegurar que las columnas se ajusten al contenido */
}

.styled-table thead tr {
  background-color: #3498db;
  color: #ffffff;
}

.styled-table th,
.styled-table td {
  padding: 0.5rem 0.75rem; /* Reducir el padding para compactar la tabla */
  text-align: left;
  white-space: nowrap; /* Evitar que el texto se divida en varias líneas */
}

.styled-table th {
  font-weight: 600;
}

.styled-table tbody tr:nth-child(even) {
  background-color: #f8f9fa;
}

.styled-table tbody tr:hover {
  background-color: #e9ecef;
}

.clickable-row {
  cursor: pointer;
}

.clickable-row:hover {
  background-color: #e9ecef;
}

.calendario {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  min-width: 300px; /* Reducir el ancho mínimo del calendario */
  align-self: start;
  position: sticky;
  top: 90px; /* Ajusta según la altura del header secundario */
}

.detalles-paciente {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  min-width: 300px;
  align-self: start;
  position: sticky;
  top: 90px;
  max-height: 70vh; /* Decrease the max height */
  overflow-y: auto;
  width: 100%;
  max-width: 1000px; /* Increase the max width */
  margin: 0 auto; /* Center the details window */
  transition: transform 0.3s ease, opacity 0.3s ease; /* Add smooth animation */
}

.detalles-paciente-enter-active,
.detalles-paciente-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.detalles-paciente-enter-from,
.detalles-paciente-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

.detalles-paciente-enter-to,
.detalles-paciente-leave-from {
  transform: translateY(0);
  opacity: 1;
}

.detalles-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.detalles-header h2 {
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
}

.close-btn:hover {
  color: #343a40;
}

.detalles-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
}

.custom-button {
  background-color: #3498db;
  color: white;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%; /* Extender el botón "Hoy" */
  margin-top: 0.5rem; /* Espacio entre botones */
}

.custom-button:hover {
  background-color: #2980b9;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

.pagination button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #3498db;
  color: white;
  font-weight: 600;
}

.pagination button:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.pagination span {
  font-weight: 600;
}

@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
    padding: 80px 10px 10px; /* Ajusta el padding para móviles */
  }

  .calendario,
  .detalles-paciente {
    position: static;
    margin-top: 1rem;
  }
}
</style>