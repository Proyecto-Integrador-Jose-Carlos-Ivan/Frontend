<template>
  <div class="main-container">
    <div class="container">
      <div class="pacientes">
        <!-- Header con "Mis Pacientes" y la fecha -->
        <div class="header-container">
          <h2>Llamadas Programadas de Pacientes</h2>
          
        </div>

        <!-- Tabla de pacientes y llamadas -->
        <table v-if="datosCombinadosFiltrados.length > 0" class="styled-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>DNI</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Categoría</th>
              <th>Subtipo</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="paciente in datosCombinadosFiltrados"
              :key="paciente.id"
              @click="mostrarDetallesPaciente(paciente)"
              class="clickable-row"
            >
              <td>{{ paciente.nombre || "No disponible" }}</td>
              <td>{{ paciente.telefono || "No disponible" }}</td>
              <td>{{ paciente.dni || "No disponible" }}</td>
              <td>
                <div v-if="paciente.llamadas.length > 0">
                  <div v-for="llamada in paciente.llamadas" :key="llamada.id">
                    {{ formatFecha(llamada.fecha_hora) }}
                  </div>
                </div>
                <span v-else>No hay llamadas</span>
              </td>
              <td>
                <div v-if="paciente.llamadas.length > 0">
                  <div v-for="llamada in paciente.llamadas" :key="llamada.id">
                    {{ formatHora(llamada.fecha_hora) }}
                  </div>
                </div>
                <span v-else>No hay llamadas</span>
              </td>
              <td>
                <div v-if="paciente.llamadas.length > 0">
                  <div v-for="llamada in paciente.llamadas" :key="llamada.id">
                    {{ formatCategoria(llamada.categoria) }}
                  </div>
                </div>
                <span v-else>No hay llamadas</span>
              </td>
              <td>
                <div v-if="paciente.llamadas.length > 0">
                  <div v-for="llamada in paciente.llamadas" :key="llamada.id">
                    {{ formatSubtipo(llamada.subtipo) }}
                  </div>
                </div>
                <span v-else>No hay llamadas</span>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else>No hay llamadas este día</p>
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
            <button @click="resetFiltro" class="custom-button">Reiniciar</button>
          </template>
        </VDatePicker>
      </div>

      <!-- Detalles del paciente -->
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
    </div>
  </div>
</template>

<script>
import { useApiStore } from '@/stores/api'; // Importar el store de llamadas

import { computed, ref, onMounted } from 'vue';

export default {
  
  setup() {
    const pacientesStore = useApiStore();
    const callsStore = useApiStore();
    const date = ref(null); // Fecha seleccionada en el calendario (null por defecto)
    const mostrarDetalles = ref(false);
    const pacienteSeleccionado = ref({});

    // Obtener pacientes y llamadas al montar el componente
    onMounted(async () => {
      await pacientesStore.fetchPacientes();
      await callsStore.fetchCalls();
    });

    // Formatear la fecha actual
    const formattedDate = computed(() => {
      if (!date.value) return "No hay fecha seleccionada";
      const day = String(date.value.getDate()).padStart(2, '0');
      const month = String(date.value.getMonth() + 1).padStart(2, '0');
      const year = date.value.getFullYear();
      return `${day}/${month}/${year}`;
    });

    // Combinar datos de pacientes y llamadas, excluyendo pacientes sin llamadas
    const datosCombinados = computed(() => {
      return pacientesStore.pacientes
        .map((paciente) => {
          const llamadasPaciente = callsStore.calls.filter(
            (llamada) => llamada.paciente_id === paciente.id
          );

          return {
            ...paciente,
            llamadas: llamadasPaciente,
          };
        })
        .filter((paciente) => paciente.llamadas.length > 0); // Excluir pacientes sin llamadas
    });
    // Filtrar pacientes por la fecha seleccionada en el calendario y ordenar por hora
    const datosCombinadosFiltrados = computed(() => {
      if (!date.value) return datosCombinados.value; // Si no hay fecha seleccionada, mostrar todos
      const fechaSeleccionada = new Date(date.value).toISOString().split('T')[0]; // Formato YYYY-MM-DD
      return datosCombinados.value.filter((paciente) =>
        paciente.llamadas.some((llamada) =>
          new Date(llamada.fecha_hora).toISOString().split('T')[0] === fechaSeleccionada
        )
      ).sort((a, b) => {
        const horaA = new Date(a.llamadas[0].fecha_hora).getTime();
        const horaB = new Date(b.llamadas[0].fecha_hora).getTime();
        return horaA - horaB;
      });
    });
    // Obtener la fecha actual
    const currentDate = new Date();

    // Establecer la fecha actual como valor predeterminado
    date.value = currentDate;
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

    // Formatear la categoría (ejemplo: "llamadas_sociales" -> "Llamadas Sociales")
    const formatCategoria = (categoria) => {
      if (!categoria) return "No disponible";
      return categoria
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    // Formatear el subtipo (ejemplo: "llamada_social" -> "Llamada Social")
    const formatSubtipo = (subtipo) => {
      if (!subtipo) return "No disponible";
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

    // Restablecer el filtrado
    const resetFiltro = () => {
      date.value = new Date(); // Restablece la fecha seleccionada a la fecha actual
    };

    // Manejar el cambio de fecha en el calendario
   

    // Filtrar pacientes por la fecha seleccionada en el calendario
    computed(() => {
      return pacientesStore.pacientes
        .filter(paciente => {
          return paciente.llamadas.some(llamada => {
            const llamadaFecha = new Date(llamada.fecha_hora).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric"
            });
            return llamadaFecha === formattedDate.value;
          });
        })
        .sort((a, b) => {
          const horaA = new Date(a.llamadas[0].fecha_hora).getTime();
          const horaB = new Date(b.llamadas[0].fecha_hora).getTime();
          return horaA - horaB;
        });
    });
    // Manejar el cambio de fecha en el calendario
    const onDateChange = (newDate) => {
      date.value = new Date(newDate); // Asegurarse de que la fecha se maneje correctamente
    };

    return {
      pacientesStore,
      callsStore,
      date,
      formattedDate,
      datosCombinadosFiltrados,
      formatFecha,
      formatHora,
      formatCategoria,
      formatSubtipo,
      mostrarDetalles,
      pacienteSeleccionado,
      mostrarDetallesPaciente,
      cerrarDetalles,
      moveToday,
      resetFiltro,
      onDateChange,
    };
  },
};
</script>

<style scoped>
.main-container {
  padding-top: 80px; /* Ajusta este valor según la altura de tu header secundario */
}

.container {
  display: grid;
  grid-template-columns: 2fr 1fr; /* Ajustar el ancho de la tabla y la hoja */
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
  margin-bottom: 1.5rem; /* Ajusta el margen inferior según sea necesario */
}

.pacientes {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  overflow-x: auto;
  max-width: 100%;
}

.styled-table {
  width: 100%;
  min-width: 700px; /* Reducir el ancho mínimo de la tabla */
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.9rem;
}

.styled-table thead tr {
  background-color: #3498db;
  color: #ffffff;
}

.styled-table th,
.styled-table td {
  padding: 0.5rem 0.75rem; /* Reducir el padding para compactar la tabla */
  text-align: left;
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
  min-width: 300px; /* Reducir el ancho mínimo de la hoja */
  align-self: start;
  position: sticky;
  top: 90px; /* Ajusta según la altura del header secundario */
  max-height: 80vh; /* Limitar la altura */
  overflow-y: auto; /* Agregar scroll interno */
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