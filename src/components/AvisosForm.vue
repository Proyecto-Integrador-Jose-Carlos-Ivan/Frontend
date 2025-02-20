<template>
  <div class="main-container">
    <div class="container">
      <h2>Añadir Aviso</h2>

      <!-- Formulario para añadir avisos -->
      <form @submit.prevent="guardarAviso" class="form-container">
        <div class="form-group">
          <label for="fecha">Fecha:</label>
          <input type="date" id="fecha" v-model="avisoActual.fecha" required>
        </div>
        <div class="form-group">
          <label for="dia_semana">Día de la Semana:</label>
          <input type="text" id="dia_semana" v-model="avisoActual.dia_semana" required>
        </div>
        <div class="form-group">
          <label for="operador">Operador:</label>
          <select id="operador" v-model="avisoActual.operador_id" required>
            <option v-for="operador in operadorStore.operadores" :key="operador.id" :value="operador.id">
              {{ operador.name }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="paciente">Paciente:</label>
          <select id="paciente" v-model="avisoActual.paciente_id" required>
            <option v-for="paciente in pacienteStore.pacientes" :key="paciente.id" :value="paciente.id">
              {{ paciente.nombre }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="zona">Zona:</label>
          <select id="zona" v-model="avisoActual.zona_id" required>
            <option v-for="zona in zonaStore.zonas" :key="zona.id" :value="zona.id">
              {{ zona.name }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="tipo">Tipo de Aviso:</label>
          <select id="tipo" v-model="avisoActual.tipo" required>
            <option value="avisos">Avisos</option>
            <option value="protocolos">Protocolos</option>
            <option value="ausencias_retornos">Ausencia de Retornos</option>
          </select>
        </div>
        <div class="form-group">
          <label for="subtipo">Subtipo:</label>
          <select id="subtipo" v-model="avisoActual.subtipo" required>
            <option value="suspension">Suspension</option>
            <option value="especial">Especial</option>
            <option value="fi_ausencia">Fin de Ausencia</option>
            <option value="retorn">Retorno</option>
            <option value="alta_hospitalaria">Alta Hospitalaria</option>
            <option value="duelo">Duelo</option>
            <option value="medicacion">Medicacion</option>
          </select>
        </div>
        <div class="form-group">
          <label for="recurrencia">Recurrencia:</label>
          <select id="recurrencia" v-model="avisoActual.recurrencia" required>
            <option value="puntual">Puntual</option>
            <option value="periodic">Periódico</option>
          </select>
        </div>
        <div class="form-group">
          <label for="descripcion">Descripción:</label>
          <textarea id="descripcion" v-model="avisoActual.descripcion" required></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Añadir Aviso</button>
      </form>

      <!-- Mensaje de confirmación -->
      <div v-if="mostrarMensaje" class="mensaje-exito">
        El aviso se ha añadido correctamente.
      </div>
    </div>
  </div>
</template>

<script>
import { useApiStore } from '@/stores/api';
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const avisoStore = useApiStore();
    const pacienteStore = useApiStore();
    const operadorStore = useApiStore();
    const zonaStore = useApiStore();

    const avisoActual = ref({
      fecha: '',
      dia_semana: '',
      operador_id: '',
      paciente_id: '',
      zona_id: '',
      tipo: '',
      subtipo: '',
      descripcion: '',
      recurrencia: '', // Add this field
    });

    const mostrarMensaje = ref(false);

    const guardarAviso = async () => {
      try {
        await avisoStore.addAviso(avisoActual.value, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            'X-CSRF-TOKEN': localStorage.getItem('csrf_token'),
          }
        });
        mostrarMensaje.value = true;
        resetFormulario();

        setTimeout(() => {
          mostrarMensaje.value = false;
        }, 3000);
      } catch (error) {
        console.error('Error al añadir el aviso:', error);
      }
    };

    const resetFormulario = () => {
      avisoActual.value = {
        fecha: '',
        dia_semana: '',
        operador_id: '',
        paciente_id: '',
        zona_id: '',
        tipo: '',
        subtipo: '',
        descripcion: '',
        recurrencia: '', // Reset this field
      };
    };

    onMounted(async () => {
      await operadorStore.fetchOperadores();
      await pacienteStore.fetchPacientes();
      await zonaStore.fetchZonas();
    });

    return {
      avisoStore,
      pacienteStore,
      operadorStore,
      zonaStore,
      avisoActual,
      mostrarMensaje,
      guardarAviso
    };
  }
};
</script>

<style scoped>
.main-container {
  padding-top: 80px;
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
