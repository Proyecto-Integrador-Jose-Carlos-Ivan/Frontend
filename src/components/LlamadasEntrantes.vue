<template>
  <div class="main-container">
    <div class="container">
      <h2>Añadir Llamada Entrante</h2>

      <!-- Formulario para añadir llamadas entrantes -->
      <form @submit.prevent="guardarLlamada" class="form-container">
        <div class="form-group">
          <label for="fecha_hora">Fecha y Hora:</label>
          <input type="datetime-local" id="fecha_hora" v-model="llamadaActual.fecha_hora" required>
        </div>
        <div class="form-group">
          <label for="operador">Operador:</label>
          <select id="operador" v-model="llamadaActual.operador_id" required>
            <option v-for="operador in operadorStore.operadores" :key="operador.id" :value="operador.id">
              {{ operador.name }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="paciente">Paciente:</label>
          <select id="paciente" v-model="llamadaActual.paciente_id" required>
            <option v-for="paciente in pacienteStore.pacientes" :key="paciente.id" :value="paciente.id">
              {{ paciente.nombre }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="descripcion">Descripción:</label>
          <textarea id="descripcion" v-model="llamadaActual.descripcion" required></textarea>
        </div>
        <div class="form-group">
          <label for="tipo">Tipo de Llamada:</label>
          <select id="tipo" v-model="llamadaActual.tipo" required>
            <option value="emergencia">Emergencia</option>
            <option value="no_urgente">No Urgente</option>
          </select>
        </div>
        <div class="form-group">
          <label for="tipo">Categoria:</label>
          <select id="tipo" v-model="llamadaActual.categoria" required>
            <option value="planificada">Planificada</option>
            <option value="no_planificada">No Planificada</option>
            <option value="atencion_emergencias">Atencion Emergencias</option>
            <option value="comunicaciones_no_urgentes">Comunicaciones No Urgentes</option>
          </select>
        </div>
        <div class="form-group">
          <label for="subtipo">Subtipo:</label>
          <select id="subtipo" v-model="llamadaActual.subtipo" required>
            <option value="emergencias_sanitarias">Emergencia Sanitaria</option>
            <option value="llamadas_accidentales">Llamada Accidental</option>
            <option value="emergencias_crisis_soledad">Crisis de Soledad</option>
            <option value="emergencias_alarma_sin_respuesta">Alarma sin Respuesta</option>
            <option value="notificar_ausencias">Notificación Ausencia</option>
            <option value="otros">Otros</option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary">Añadir Llamada</button>
      </form>

      <!-- Mensaje de confirmación -->
      <div v-if="mostrarMensaje" class="mensaje-exito">
        La llamada entrante se ha añadido correctamente.
      </div>
    </div>
  </div>
</template>

<script>
import { useApiStore } from '@/stores/api';

import { ref, onMounted } from 'vue';

export default {
  setup() {
    const callStore = useApiStore();
    const pacienteStore = useApiStore();
    const operadorStore = useApiStore();

    const llamadaActual = ref({
      fecha_hora: '',
      operador_id: '',
      paciente_id: '',
      descripcion: '',
      tipo: '',
      subtipo: '',
      categoria: '', // Ensure this field is included
      sentido: 'entrante' // Siempre será "entrante"
    });

    const mostrarMensaje = ref(false);

    const guardarLlamada = async () => {
      try {
        console.log('Subtipo value:', llamadaActual.value.subtipo); // Log the subtipo value
        await callStore.addCall(llamadaActual.value, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            'X-CSRF-TOKEN': localStorage.getItem('csrf_token'), // Ensure CSRF token is included
          }
        });
        mostrarMensaje.value = true;
        resetFormulario();

        setTimeout(() => {
          mostrarMensaje.value = false;
        }, 3000);
      } catch (error) {
        console.error('Error al añadir la llamada:', error);
      }
    };

    const resetFormulario = () => {
      llamadaActual.value = {
        fecha_hora: '',
        operador_id: '',
        paciente_id: '',
        descripcion: '',
        tipo: '',
        subtipo: '',
        categoria: '', // Ensure this field is included
        sentido: 'entrante'
      };
    };

    onMounted(async () => {
      await operadorStore.fetchOperadores();
      await pacienteStore.fetchPacientes();
    });

    return {
      callStore,
      pacienteStore,
      operadorStore,
      llamadaActual,
      mostrarMensaje,
      guardarLlamada
    };
  }
};
</script>

<style scoped>
.main-container {
  padding-top: 80px; /* Asegura que el contenido no se solape con el header secundario */
}
.container {
  padding: 20px 20px 20px;
  max-width: 800px;
  margin: 0 auto;
}

h2 {
  color: #009879;
  margin-bottom: 20px;
}

.form-container {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #009879;
  font-weight: bold;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1em;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s ease;
}

.btn-primary {
  background-color: #009879;
  color: white;
}

.btn-primary:hover {
  background-color: #007f63;
}

.mensaje-exito {
  margin-top: 20px;
  padding: 10px;
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
  text-align: center;
}
</style>
