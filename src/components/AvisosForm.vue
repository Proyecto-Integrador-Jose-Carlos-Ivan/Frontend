<template>
  <div class="main-container">
    <div class="container">
      <h2>Añadir Aviso</h2>
      <Form @submit="guardarAviso" :validation-schema="schema" class="form-container">
        <div class="form-group">
          <label for="fecha">Fecha:</label>
          <Field type="date" id="fecha" name="fecha" v-model="avisoActual.fecha" />
          <ErrorMessage name="fecha" class="error-message" />
        </div>
        <div class="form-group">
          <label for="dia_semana">Día de la Semana:</label>
          <Field type="text" id="dia_semana" name="dia_semana" v-model="avisoActual.dia_semana" />
          <ErrorMessage name="dia_semana" class="error-message" />
        </div>
        <div class="form-group">
          <label for="operador">Operador:</label>
          <Field as="select" id="operador" name="operador_id" v-model="avisoActual.operador_id">
            <option v-for="operador in filteredOperadores" :key="operador.id" :value="operador.id">
              {{ operador.name }}
            </option>
          </Field>
          <ErrorMessage name="operador_id" class="error-message" />
        </div>
        <div class="form-group">
          <label for="paciente">Paciente:</label>
          <Field as="select" id="paciente" name="paciente_id" v-model="avisoActual.paciente_id">
            <option v-for="paciente in pacienteStore.pacientes" :key="paciente.id" :value="paciente.id">
              {{ paciente.nombre }}
            </option>
          </Field>
          <ErrorMessage name="paciente_id" class="error-message" />
        </div>
        <div class="form-group">
          <label for="zona">Zona:</label>
          <Field as="select" id="zona" name="zona_id" v-model="avisoActual.zona_id">
            <option v-for="zona in zonaStore.zonas" :key="zona.id" :value="zona.id">
              {{ zona.name }}
            </option>
          </Field>
          <ErrorMessage name="zona_id" class="error-message" />
        </div>
        <div class="form-group">
          <label for="tipo">Tipo de Aviso:</label>
          <Field as="select" id="tipo" name="tipo" v-model="avisoActual.tipo" @change="updateSubtipos">
            <option value="avisos">Avisos</option>
            <option value="protocolos">Protocolos</option>
            <option value="ausencias_retornos">Ausencias y Retornos</option>
          </Field>
          <ErrorMessage name="tipo" class="error-message" />
        </div>
        <div class="form-group" v-if="subtipos.length > 0">
          <label for="subtipo">Subtipo:</label>
          <Field as="select" id="subtipo" name="subtipo" v-model="avisoActual.subtipo">
            <option v-for="subtipo in subtipos" :key="subtipo" :value="subtipo">
              {{ formatText(subtipo) }}
            </option>
          </Field>
          <ErrorMessage name="subtipo" class="error-message" />
        </div>
        <div class="form-group">
          <label for="recurrencia">Recurrencia:</label>
          <Field as="select" id="recurrencia" name="recurrencia" v-model="avisoActual.recurrencia">
            <option value="puntual">Puntual</option>
            <option value="periodic">Periódico</option>
          </Field>
          <ErrorMessage name="recurrencia" class="error-message" />
        </div>
        <div class="form-group">
          <label for="descripcion">Descripción:</label>
          <Field as="textarea" id="descripcion" name="descripcion" v-model="avisoActual.descripcion" />
          <ErrorMessage name="descripcion" class="error-message" />
        </div>
        <button type="submit" class="btn btn-primary">Añadir Aviso</button>
      </Form>
      <div v-if="mostrarMensaje" class="mensaje-exito">
        El aviso se ha añadido correctamente.
      </div>
    </div>
  </div>
</template>

<script>
import { useApiStore } from '@/stores/api';
import { ref, onMounted, computed } from 'vue';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';

export default {
  components: {
    Form,
    Field,
    ErrorMessage
  },
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
      recurrencia: '',
    });

    const subtipos = ref([]);
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
        recurrencia: '',
      };
      subtipos.value = [];
    };

    const updateSubtipos = () => {
      const tipo = avisoActual.value.tipo;
      if (tipo === 'avisos') {
        subtipos.value = ['medicacion', 'especial'];
      } else if (tipo === 'protocolos') {
        subtipos.value = ['emergencias', 'duelo', 'alta_hospitalaria'];
      } else if (tipo === 'ausencias_retornos') {
        subtipos.value = ['suspension', 'retorn', 'fi_ausencia'];
      } else {
        subtipos.value = [];
      }
    };

    const formatText = (text) => {
      return text.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
    };

    const filteredOperadores = computed(() => {
      return operadorStore.operadores.filter(operador => operador.role !== 'admin' && operador.name !== 'Admin');
    });

    onMounted(async () => {
      await operadorStore.fetchOperadores();
      await pacienteStore.fetchPacientes();
      await zonaStore.fetchZonas();
    });

    const schema = yup.object({
      fecha: yup.string().required('Fecha es requerida'),
      dia_semana: yup.string().required('Día de la Semana es requerido'),
      operador_id: yup.string().required('Operador es requerido'),
      paciente_id: yup.string().required('Paciente es requerido'),
      zona_id: yup.string().required('Zona es requerida'),
      tipo: yup.string().required('Tipo de Aviso es requerido'),
      subtipo: yup.string().required('Subtipo es requerido'),
      recurrencia: yup.string().required('Recurrencia es requerida'),
      descripcion: yup.string().required('Descripción es requerida')
    });

    return {
      avisoStore,
      pacienteStore,
      operadorStore,
      zonaStore,
      avisoActual,
      subtipos,
      mostrarMensaje,
      guardarAviso,
      updateSubtipos,
      formatText,
      filteredOperadores,
      schema
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
  padding: 7px 15px;
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

.error-message {
  color: red;
  font-size: 0.875em;
  margin-top: 0.25em;
}
</style>
