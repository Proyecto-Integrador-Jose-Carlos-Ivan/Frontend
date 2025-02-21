<template>
    <div class="main-container">
      <div class="container">
        <h2>Añadir Llamada Saliente</h2>
  
        <!-- Formulario para añadir llamadas salientes -->
        <Form @submit="guardarLlamada" :validation-schema="schema" class="form-container">
          <div class="form-group">
            <label for="fecha_hora">Fecha y Hora:</label>
            <Field type="datetime-local" id="fecha_hora" name="fecha_hora" v-model="llamadaActual.fecha_hora" />
            <ErrorMessage name="fecha_hora" class="error-message" />
          </div>
          <div class="form-group">
            <label for="operador">Operador:</label>
            <Field as="select" id="operador" name="operador_id" v-model="llamadaActual.operador_id">
              <option v-for="operador in operadorStore.operadores" :key="operador.id" :value="operador.id">
                {{ operador.name }}
              </option>
            </Field>
            <ErrorMessage name="operador_id" class="error-message" />
          </div>
          <div class="form-group">
            <label for="paciente">Paciente:</label>
            <Field as="select" id="paciente" name="paciente_id" v-model="llamadaActual.paciente_id">
              <option v-for="paciente in pacienteStore.pacientes" :key="paciente.id" :value="paciente.id">
                {{ paciente.nombre }}
              </option>
            </Field>
            <ErrorMessage name="paciente_id" class="error-message" />
          </div>
          <div class="form-group">
            <label for="descripcion">Descripción:</label>
            <Field as="textarea" id="descripcion" name="descripcion" v-model="llamadaActual.descripcion" />
            <ErrorMessage name="descripcion" class="error-message" />
          </div>
          <div class="form-group">
            <label for="tipo">Tipo de Llamada:</label>
            <Field as="select" id="tipo" name="tipo" v-model="llamadaActual.tipo">
              <option value="planificada">Planificada</option>
              <option value="no_planificada">No Planificada</option>
            </Field>
            <ErrorMessage name="tipo" class="error-message" />
          </div>
          <div class="form-group">
          <label for="categoria">Categoria:</label>
          <Field as="select" id="categoria" name="categoria" v-model="llamadaActual.categoria">
            <option value="planificada">Planificada</option>
            <option value="no_planificada">No Planificada</option>
            <option value="atencion_emergencias">Atencion Emergencias</option>
            <option value="comunicaciones_no_urgentes">Comunicaciones No Urgentes</option>
          </Field>
          <ErrorMessage name="categoria" class="error-message" />
        </div>
          <div class="form-group">
            <label for="subtipo">Subtipo:</label>
            <Field as="select" id="subtipo" name="subtipo" v-model="llamadaActual.subtipo">
              <option value="seguimiento">Seguimiento</option>
              <option value="verificacion">Verificación</option>
              <option value="emergencia">Emergencia</option>
              <option value="informacion">Información</option>
            </Field>
            <ErrorMessage name="subtipo" class="error-message" />
          </div>
          <button type="submit" class="btn btn-primary">Añadir Llamada</button>
        </Form>
  
        <!-- Mensaje de confirmación -->
        <div v-if="mostrarMensaje" class="mensaje-exito">
          La llamada saliente se ha añadido correctamente.
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { useApiStore } from '@/stores/api';
  import { ref, onMounted } from 'vue';
  import { Form, Field, ErrorMessage } from 'vee-validate';
  import * as yup from 'yup';
  
  export default {
    components: {
      Form,
      Field,
      ErrorMessage
    },
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
        categoria: '',
        sentido: 'saliente'
      });
  
      const mostrarMensaje = ref(false);
  
      const guardarLlamada = async () => {
        try {
          console.log('Subtipo value:', llamadaActual.value.subtipo);
          const token = localStorage.getItem('authToken');
          await callStore.addCall(llamadaActual.value, {
            headers: {
              Authorization: `Bearer ${token}`,
              'X-CSRF-TOKEN': localStorage.getItem('csrf_token'),
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
          categoria: '', 
          sentido: 'saliente'
        };
      };
  
      onMounted(async () => {
        await operadorStore.fetchOperadores();
        await pacienteStore.fetchPacientes();
      });
  
      const schema = yup.object({
        fecha_hora: yup.string().required('Fecha y Hora es requerido'),
        operador_id: yup.string().required('Operador es requerido'),
        paciente_id: yup.string().required('Paciente es requerido'),
        descripcion: yup.string().required('Descripción es requerida'),
        tipo: yup.string().required('Tipo de Llamada es requerido'),
        subtipo: yup.string().required('Subtipo es requerido'),
        categoria: yup.string().required('Categoria es requerida')
      });
  
      return {
        callStore,
        pacienteStore,
        operadorStore,
        llamadaActual,
        mostrarMensaje,
        guardarLlamada,
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
  
  .error-message {
    color: red;
    font-size: 0.875em;
    margin-top: 0.25em;
  }
  </style>
  