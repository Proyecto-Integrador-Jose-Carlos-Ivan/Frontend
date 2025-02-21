<template>
  <div class="main-container">
    <div class="container">
      <h2>Dar de Alta a un Paciente</h2>
      <Form @submit="guardarAlta" :validation-schema="schema" class="form-container">
        <div class="form-group">
          <label for="nombre">Nombre:</label>
          <Field id="nombre" name="nombre" v-model="nuevoPaciente.nombre" />
          <ErrorMessage name="nombre" class="error-message" />
        </div>
        <div class="form-group">
          <label for="fecha_nacimiento">Fecha de Nacimiento:</label>
          <Field id="fecha_nacimiento" type="date" name="fecha_nacimiento" v-model="nuevoPaciente.fecha_nacimiento" />
          <ErrorMessage name="fecha_nacimiento" class="error-message" />
        </div>
        <div class="form-group">
          <label for="dni">DNI:</label>
          <Field id="dni" name="dni" v-model="nuevoPaciente.dni" />
          <ErrorMessage name="dni" class="error-message" />
        </div>
        <div class="form-group">
          <label for="sip">SIP:</label>
          <Field id="sip" name="sip" v-model="nuevoPaciente.sip" />
          <ErrorMessage name="sip" class="error-message" />
        </div>
        <div class="form-group">
          <label for="telefono">Teléfono:</label>
          <Field id="telefono" name="telefono" v-model="nuevoPaciente.telefono" />
          <ErrorMessage name="telefono" class="error-message" />
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <Field id="email" type="email" name="email" v-model="nuevoPaciente.email" />
          <ErrorMessage name="email" class="error-message" />
        </div>
        <div class="form-group">
          <label for="direccion">Dirección:</label>
          <Field id="direccion" name="direccion" v-model="nuevoPaciente.direccion" />
          <ErrorMessage name="direccion" class="error-message" />
        </div>
        <div class="form-group">
          <label for="contacto">Contacto:</label>
          <Field id="contacto" name="contacto" v-model="nuevoPaciente.contacto" />
        </div>
        <div class="form-group">
          <label for="zona_id">Zona:</label>
          <Field as="select" id="zona_id" name="zona_id" v-model="nuevoPaciente.zona_id">
            <option v-for="zona in zonas" :key="zona.id" :value="zona.id">
              {{ zona.name }}
            </option>
          </Field>
          <ErrorMessage name="zona_id" class="error-message" />
        </div>
        <div class="form-group">
          <label for="operador_id">Operador:</label>
          <Field as="select" id="operador_id" name="operador_id" v-model="nuevoPaciente.operador_id">
            <option v-for="operador in operadores" :key="operador.id" :value="operador.id">
              {{ operador.name }}
            </option>
          </Field>
          <ErrorMessage name="operador_id" class="error-message" />
        </div>
        <div class="form-group">
          <label for="situacion_personal">Situación Personal:</label>
          <Field as="textarea" id="situacion_personal" name="situacion_personal" v-model="nuevoPaciente.situacion_personal" />
        </div>
        <div class="form-group">
          <label for="situacion_sanitaria">Situación Sanitaria:</label>
          <Field as="textarea" id="situacion_sanitaria" name="situacion_sanitaria" v-model="nuevoPaciente.situacion_sanitaria" />
        </div>
        <div class="form-group">
          <label for="situacion_habitage">Situación de Hábitat:</label>
          <Field as="textarea" id="situacion_habitage" name="situacion_habitage" v-model="nuevoPaciente.situacion_habitage" />
        </div>
        <div class="form-group">
          <label for="autonomia">Autonomía:</label>
          <Field as="textarea" id="autonomia" name="autonomia" v-model="nuevoPaciente.autonomia" />
        </div>
        <div class="form-group">
          <label for="situacion_economica">Situación Económica:</label>
          <Field as="textarea" id="situacion_economica" name="situacion_economica" v-model="nuevoPaciente.situacion_economica" />
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Dar de alta</button>
          <router-link to="/home" class="btn btn-secondary">Cancelar</router-link>
        </div>
      </Form>
    </div>
  </div>
</template>

<script>
import { useApiStore } from '@/stores/api';
import { useRouter } from 'vue-router';
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
    const apiStore = useApiStore();
    const router = useRouter();
    const zonas = ref([]);
    const operadores = ref([]);

    const nuevoPaciente = ref({
      nombre: '',
      fecha_nacimiento: '',
      direccion: '',
      dni: '',
      sip: '',
      telefono: '',
      email: '',
      contacto: '',
      zona_id: '',
      operador_id: '',
      situacion_personal: '',
      situacion_sanitaria: '',
      situacion_habitage: '',
      autonomia: '',
      situacion_economica: ''
    });

    onMounted(async () => {
      await apiStore.fetchZonas();
      zonas.value = apiStore.zonas;
      await apiStore.fetchOperadores();
      operadores.value = apiStore.operadores;
    });

    const guardarAlta = async () => {
      try {
        await apiStore.addPaciente(nuevoPaciente.value);
        router.push('/home');
      } catch (error) {
        console.error('Error al agregar el paciente:', error);
      }
    };

    const schema = yup.object({
      nombre: yup.string().required('Nombre es requerido'),
      fecha_nacimiento: yup.string().required('Fecha de Nacimiento es requerida'),
      dni: yup.string().required('DNI es requerido'),
      sip: yup.string().required('SIP es requerido'),
      telefono: yup.string().required('Teléfono es requerido'),
      email: yup.string().email('Email no es válido').required('Email es requerido'),
      direccion: yup.string().required('Dirección es requerida'),
      zona_id: yup.string().required('Zona es requerida'),
      operador_id: yup.string().required('Operador es requerido')
    });

    return {
      nuevoPaciente,
      zonas,
      operadores,
      guardarAlta,
      schema
    };
  },
};
</script>

<style scoped>
.main-container {
  padding-top: 80px; /* Reducir el padding superior */
}
.container {
  padding: 20px 20px 20px; /* Reducir el padding superior */
  max-width: 800px;
  margin: 0 auto;
}

h2 {
  color: #5bc0de; /* Cambiar el color a un azul más claro */
  margin-bottom: 20px;
}

.form-container {
  background-color: #ffffff;
  padding: 1rem; /* Reducir el padding */
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}

.form-group {
  margin-bottom: 10px; /* Reducir el margen inferior */
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #2bb6e0; /* Cambiar el color a un azul más claro */
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

.form-group input,
.form-group select,
.form-group textarea {
  padding-top: 4px; /* Reducir el padding superior */
  padding-bottom: 4px; /* Reducir el padding inferior */
}

.error-message {
  color: red;
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
  background-color: #5bc0de; /* Cambiar el color a un azul más claro */
  color: white;
}

.btn-primary:hover {
  background-color: #2bb6e0; /* Cambiar el color a un azul más claro */
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}
</style>
