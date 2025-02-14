<template>
  <div class="main-container">
    <div class="container">
      <div class="pacientes">
        <h2>Lista de Pacientes</h2>

        <table class="styled-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Situación Personal</th>
              <th>Dirección</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>SIP</th>
              <th>Situación Sanitaria</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="paciente in pacientesStore.pacientes" :key="paciente.id" @click="showPacienteDetails(paciente)">
              <td>{{ paciente.nombre }}</td>
              <td>{{ paciente.situacion_personal || "No disponible" }}</td>
              <td>{{ paciente.direccion }}</td>
              <td>{{ paciente.email }}</td>
              <td>{{ paciente.telefono }}</td>
              <td>{{ paciente.sip }}</td>
              <td>{{ paciente.situacion_sanitaria || "No disponible" }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal para mostrar detalles del paciente -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-container">
        <div class="modal-header">
          <h2>Detalles del Paciente</h2>
          <button @click="closeModal" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <div v-if="selectedPaciente">
            <p><strong>Nombre:</strong> {{ selectedPaciente.nombre }}</p>
            <p><strong>Situación Personal:</strong> {{ selectedPaciente.situacion_personal || "No disponible" }}</p>
            <p><strong>Dirección:</strong> {{ selectedPaciente.direccion }}</p>
            <p><strong>Email:</strong> {{ selectedPaciente.email }}</p>
            <p><strong>Teléfono:</strong> {{ selectedPaciente.telefono }}</p>
            <p><strong>SIP:</strong> {{ selectedPaciente.sip }}</p>
            <p><strong>Situación Sanitaria:</strong> {{ selectedPaciente.situacion_sanitaria || "No disponible" }}</p>
            <p><strong>Fecha de Nacimiento:</strong> {{ formatFecha(selectedPaciente.fecha_nacimiento) }}</p>
            <p><strong>DNI:</strong> {{ selectedPaciente.dni || "No disponible" }}</p>
            <p><strong>Situación Económica:</strong> {{ selectedPaciente.situacion_economica || "No disponible" }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { usePacientesStore } from '@/stores/pacientesStore';
import { ref, onMounted } from "vue";

export default {
  setup() {
    const pacientesStore = usePacientesStore();
    const showModal = ref(false); // Controla la visibilidad del modal
    const selectedPaciente = ref(null); // Almacena el paciente seleccionado

    const formatFecha = (fecha) => {
      if (!fecha) return "Fecha no disponible";
      const fechaValida = fecha.includes("T") ? fecha : `${fecha}T00:00:00`;
      const date = new Date(fechaValida);
      return date.toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
    };

    // Muestra el modal con los detalles del paciente
    const showPacienteDetails = (paciente) => {
      selectedPaciente.value = paciente;
      showModal.value = true;
    };

    // Cierra el modal
    const closeModal = () => {
      showModal.value = false;
      selectedPaciente.value = null;
    };

    onMounted(async () => {
      await pacientesStore.fetchPacientes();
    });

    return {
      pacientesStore,
      formatFecha,
      showModal,
      selectedPaciente,
      showPacienteDetails,
      closeModal,
    };
  }
};
</script>

<style scoped>
.main-container {
  padding-top: 80px; /* Asegura que el contenido no se solape con el header secundario */
}

.container {
  display: grid;
  grid-template-columns: 1fr;
  justify-content: center;
  padding: 80px 20px 20px;
}

.pacientes {
  width: auto;
  max-width: 90vw;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  overflow-x: auto;
}

h2 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-top: 1rem;
  margin-bottom: 1.5rem;
  text-align: center;
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

.styled-table tbody tr:nth-child(even) {
  background-color: #f8f9fa;
}

.styled-table tbody tr:hover {
  background-color: #e9ecef;
  cursor: pointer; /* Cambia el cursor al pasar sobre una fila */
}

.styled-table tbody tr:last-of-type {
  border-bottom: 2px solid #ffffff;
}

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
  z-index: 1000;
}

.modal-container {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 1rem;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.modal-header h2 {
  margin: 0;
  color: #343a40;
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6c757d;
  cursor: pointer;
  transition: color 0.3s ease;
}

.close-btn:hover {
  color: #343a40;
}

.modal-body {
  padding: 1.5rem;
  flex-grow: 1;
  overflow-y: auto;
}

.modal-body p {
  margin-bottom: 1rem;
  font-size: 1rem;
  color: #2c3e50;
}

@media (max-width: 768px) {
  .container {
    padding: 80px 10px 10px;
  }

  .pacientes {
    padding: 1rem;
  }

  .styled-table {
    font-size: 14px;
    min-width: 100%;
  }

  .styled-table th,
  .styled-table td {
    padding: 0.5rem;
  }

  .modal-container {
    width: 95%;
  }
}
</style>