<template>
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
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="paciente in pacientesStore.pacientes" :key="paciente.id">
            <td>{{ paciente.nombre }}</td>
            <td>{{ paciente.situacion_personal }}</td>
            <td>{{ formatFecha(paciente.fecha_nacimiento) }}</td>
            <td>{{ paciente.direccion }}</td>
            <td>{{ paciente.dni }}</td>
            <td>{{ paciente.email }}</td>
            <td>{{ paciente.telefono }}</td>
            <td>{{ paciente.sip }}</td>
            <td>{{ paciente.situacion_economica }}</td>
            <td>{{ paciente.situacion_sanitaria }}</td>
            <td class="actions">
              <button @click="mostrarPaciente(paciente)" class="btn btn-info">
                <Eye size="18" />
              </button>
              <button @click="editarPaciente(paciente)" class="btn btn-warning">
                <Edit size="18" />
              </button>
              <button @click="confirmarEliminar(paciente)" class="btn btn-danger">
                <Trash2 size="18" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal para mostrar paciente -->
    <div v-if="modalMostrar" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h2>Detalles del Paciente</h2>
          <button @click="cerrarModal" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <p><strong>Nombre:</strong> {{ pacienteSeleccionado.nombre }}</p>
          <p><strong>Situación Personal:</strong> {{ pacienteSeleccionado.situacion_personal }}</p>
          <p><strong>Fecha de Nacimiento:</strong> {{ formatFecha(pacienteSeleccionado.fecha_nacimiento) }}</p>
          <p><strong>Dirección:</strong> {{ pacienteSeleccionado.direccion }}</p>
          <p><strong>DNI:</strong> {{ pacienteSeleccionado.dni }}</p>
          <p><strong>Email:</strong> {{ pacienteSeleccionado.email }}</p>
          <p><strong>Teléfono:</strong> {{ pacienteSeleccionado.telefono }}</p>
          <p><strong>SIP:</strong> {{ pacienteSeleccionado.sip }}</p>
          <p><strong>Situación Económica:</strong> {{ pacienteSeleccionado.situacion_economica }}</p>
          <p><strong>Situación Sanitaria:</strong> {{ pacienteSeleccionado.situacion_sanitaria }}</p>
        </div>
      </div>
    </div>

    <!-- Modal para editar paciente -->
    <div v-if="modalEditar" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h2>Editar Paciente</h2>
          <button @click="cerrarModal" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="guardarEdicion">
            <div class="form-group">
              <label for="nombre">Nombre:</label>
              <input id="nombre" v-model="pacienteEditado.nombre" required>
            </div>
            <div class="form-group">
              <label for="situacion_personal">Situación Personal:</label>
              <input id="situacion_personal" v-model="pacienteEditado.situacion_personal">
            </div>
            <div class="form-group">
              <label for="fecha_nacimiento">Fecha de Nacimiento:</label>
              <input id="fecha_nacimiento" type="date" v-model="pacienteEditado.fecha_nacimiento">
            </div>
            <div class="form-group">
              <label for="direccion">Dirección:</label>
              <input id="direccion" v-model="pacienteEditado.direccion">
            </div>
            <div class="form-group">
              <label for="dni">DNI:</label>
              <input id="dni" v-model="pacienteEditado.dni">
            </div>
            <div class="form-group">
              <label for="email">Email:</label>
              <input id="email" type="email" v-model="pacienteEditado.email">
            </div>
            <div class="form-group">
              <label for="telefono">Teléfono:</label>
              <input id="telefono" v-model="pacienteEditado.telefono">
            </div>
            <div class="form-group">
              <label for="sip">SIP:</label>
              <input id="sip" v-model="pacienteEditado.sip">
            </div>
            <div class="form-group">
              <label for="situacion_economica">Situación Económica:</label>
              <input id="situacion_economica" v-model="pacienteEditado.situacion_economica">
            </div>
            <div class="form-group">
              <label for="situacion_sanitaria">Situación Sanitaria:</label>
              <input id="situacion_sanitaria" v-model="pacienteEditado.situacion_sanitaria">
            </div>
            <button type="submit" class="btn btn-primary">Guardar Cambios</button>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal para confirmar eliminación -->
    <div v-if="modalEliminar" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h2>Confirmar Eliminación</h2>
          <button @click="cerrarModal" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <p>¿Está seguro de que desea eliminar al paciente {{ pacienteSeleccionado.nombre }}?</p>
          <div class="modal-actions">
            <button @click="eliminarPaciente" class="btn btn-danger">Sí, Eliminar</button>
            <button @click="cerrarModal" class="btn btn-secondary">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { usePacientesStore } from '@/stores/pacientesStore';
import { ref, onMounted } from "vue";
import { Eye, Edit, Trash2 } from 'lucide-vue-next';

export default {
  components: {
    Eye,
    Edit,
    Trash2
  },
  setup() {
    const pacientesStore = usePacientesStore();
    const modalMostrar = ref(false);
    const modalEditar = ref(false);
    const modalEliminar = ref(false);
    const pacienteSeleccionado = ref({});
    const pacienteEditado = ref({});

    const formatFecha = (fecha) => {
      if (!fecha) return "Fecha no disponible";
      const fechaValida = fecha.includes("T") ? fecha : `${fecha}T00:00:00`;
      const date = new Date(fechaValida);
      return date.toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
    };

    const mostrarPaciente = (paciente) => {
      pacienteSeleccionado.value = paciente;
      modalMostrar.value = true;
      document.body.style.overflow = 'hidden';
    };

    const editarPaciente = (paciente) => {
      pacienteEditado.value = { ...paciente };
      modalEditar.value = true;
      document.body.style.overflow = 'hidden';
    };

    const confirmarEliminar = (paciente) => {
      pacienteSeleccionado.value = paciente;
      modalEliminar.value = true;
      document.body.style.overflow = 'hidden';
    };

    const cerrarModal = () => {
      modalMostrar.value = false;
      modalEditar.value = false;
      modalEliminar.value = false;
      document.body.style.overflow = 'auto';
    };

    const guardarEdicion = async () => {
      await pacientesStore.updatePaciente(pacienteEditado.value.id, pacienteEditado.value);
      cerrarModal();
    };

    const eliminarPaciente = async () => {
      await pacientesStore.deletePaciente(pacienteSeleccionado.value.id);
      cerrarModal();
    };

    onMounted(async () => {
      await pacientesStore.fetchPacientes();
    });

    return {
      pacientesStore,
      formatFecha,
      modalMostrar,
      modalEditar,
      modalEliminar,
      pacienteSeleccionado,
      pacienteEditado,
      mostrarPaciente,
      editarPaciente,
      confirmarEliminar,
      cerrarModal,
      guardarEdicion,
      eliminarPaciente
    };
  }
};
</script>

<style scoped>
.container {
  display: grid;
  grid-template-columns: 1fr;
  justify-content: center;
  padding: 90px 20px 20px;
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
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #3498db;
  color: #ffffff;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.modal-header h2 {
  margin: 0;
  color: white;
  font-size: 1.25rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #ffffff;
  cursor: pointer;
}

.modal-body {
  padding: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
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
}
</style>