<template>
  <div class="container">
      <div class="pacientes">
          <h2>Fecha actual: {{ formattedDate }}</h2>

          <table v-if="pacientes.length > 0" class="styled-table">
              <thead>
                  <tr>
                      <th>Nombre</th>
                      <th>Situación Personal</th>
                      <th>Fecha de Nacimiento</th>
                      <th>Dirección</th>
                      <th>DNI</th>
                      <th>Email</th>
                      <th>Teléfono</th>
                      <th>SIP</th>
                      <th>Situación Económica</th>
                      <th>Situación Sanitaria</th>
                  </tr>
              </thead>
              <tbody>
                  <tr v-for="paciente in pacientes" :key="paciente.id">
                      <td>{{ paciente.nombre || "No disponible" }}</td>
                      <td>{{ paciente.situacion_personal || "No disponible" }}</td>
                      <td>{{ formatFecha(paciente.fecha_nacimiento) }}</td>
                      <td>{{ paciente.direccion || "No disponible" }}</td>
                      <td>{{ paciente.dni || "No disponible" }}</td>
                      <td>{{ paciente.email || "No disponible" }}</td>
                      <td>{{ paciente.telefono || "No disponible" }}</td>
                      <td>{{ paciente.sip || "No disponible" }}</td>
                      <td>{{ paciente.situacion_economica || "No disponible" }}</td>
                      <td>{{ paciente.situacion_sanitaria || "No disponible" }}</td>
                  </tr>
              </tbody>
          </table>
          <p v-else>Cargando pacientes...</p>
      </div>

      <div class="calendario">
          <VDatePicker 
              v-model="date"
              mode="date"
              expanded
              :attributes="attributes"
              @update:modelValue="onDateChange">
              <template #footer>
                  <button @click="moveToday" class="custom-button">Hoy</button>
              </template>
          </VDatePicker>
      </div>
  </div>
</template>

<script>
import { usePacientesStore } from '@/stores/pacientesStore'; // Importamos la store
import { computed, ref, onMounted } from 'vue';

export default {
  setup() {
      const store = usePacientesStore(); // Inicializamos la store
      const date = ref(new Date()); // Fecha actual seleccionada en el calendario

      // Computed para obtener pacientes desde la store
      const pacientes = computed(() => store.pacientes);

      // Formatear fecha actual
      const formattedDate = computed(() => {
          const day = String(date.value.getDate()).padStart(2, '0');
          const month = String(date.value.getMonth() + 1).padStart(2, '0');
          const year = date.value.getFullYear();
          return `${day}/${month}/${year}`;
      });

      // Formatear fechas de pacientes
      const formatFecha = (fecha) => {
          if (!fecha) return "No disponible";
          const dateObj = new Date(fecha);
          return dateObj.toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
      };

      // Atributos para marcar las fechas en el calendario
      const attributes = computed(() =>
          store.pacientes.map(paciente => ({
              key: paciente.id,
              dates: [new Date(paciente.fecha_nacimiento)],
              dot: true,
              bar: 'red',
          }))
      );

      // Cambiar fecha en el calendario
      const onDateChange = (newDate) => {
          date.value = newDate;
      };

      // Volver a la fecha de hoy
      const moveToday = () => {
          date.value = new Date();
      };

      // Cargar pacientes al montar el componente
      onMounted(async () => {
          await store.fetchPacientes();
          console.log("Pacientes cargados:", store.pacientes);
      });

      return {
          store,
          pacientes,
          date,
          formattedDate,
          formatFecha,
          attributes,
          onDateChange,
          moveToday
      };
  },
};
</script>

<style scoped>
.container {
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 1.5rem;
  max-width: 100%;
  margin: 0 auto;
  padding: 90px 1rem 20px; /* Increased top padding */
  align-items: start;
}

.pacientes {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  overflow-x: auto;
  max-width: 100%;
}

h2 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-top: 1rem; /* Added top margin */
  margin-bottom: 1.5rem; /* Increased bottom margin */
}

.styled-table {
  width: 100%;
  min-width: 900px;
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
  padding: 0.75rem 1rem;
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

.calendario {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  min-width: 350px;
  align-self: start;
  position: sticky;
  top: 90px; /* Adjusted to account for the fixed header */
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
}

.custom-button:hover {
  background-color: #2980b9;
}

@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
    padding: 80px 10px 10px; /* Adjusted top padding for mobile */
  }

  .calendario {
    position: static;
    margin-top: 1rem;
  }
}
</style>
