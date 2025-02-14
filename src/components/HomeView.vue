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
          <tr v-for="paciente in pacientesStore.pacientes" :key="paciente.id">
            <td>{{ paciente.nombre }}</td>
            <td>{{ paciente.situacion_personal || "No disponible" }}</td>
            <td>{{ formatFecha(paciente.fecha_nacimiento) }}</td>
            <td>{{ paciente.direccion }}</td>
            <td>{{ paciente.dni }}</td>
            <td>{{ paciente.email }}</td>
            <td>{{ paciente.telefono }}</td>
            <td>{{ paciente.sip }}</td>
            <td>{{ paciente.situacion_economica || "No disponible" }}</td>
            <td>{{ paciente.situacion_sanitaria || "No disponible" }}</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
  </div>
</template>

<script>
import { usePacientesStore } from '@/stores/pacientesStore';
import { onMounted } from "vue";

export default {
  setup() {
    const pacientesStore = usePacientesStore();


    const formatFecha = (fecha) => {
      if (!fecha) return "Fecha no disponible";
      const fechaValida = fecha.includes("T") ? fecha : `${fecha}T00:00:00`;
      const date = new Date(fechaValida);
      return date.toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
    };

    onMounted(async () => {
      await pacientesStore.fetchPacientes();
    });

    return {
      pacientesStore,
      formatFecha,
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
}

.styled-table tbody tr:last-of-type {
  border-bottom: 2px solid #ffffff;
}

.actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.btn {
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
  width: 36px;
  height: 36px;
}

.btn.modal-btn {
  width: auto;
  min-width: 120px;
  height: auto;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}

.btn-info {
  background-color: #17a2b8;
  color: white;
}

.btn-warning {
  background-color: #ffc107;
  color: black;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn:hover {
  opacity: 0.8;
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

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
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

  .actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }

  .modal-container {
    width: 95%;
  }

  .grid-container {
    grid-template-columns: 1fr;
  }
}
</style>