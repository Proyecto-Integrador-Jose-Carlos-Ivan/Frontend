<template>
  <div class="main-container">
    <div class="container">
      <h2>Dar de Alta a un Paciente</h2>
      <form @submit.prevent="guardarAlta" class="form-container">
        <!-- Primera fila: Información básica -->
        <div class="form-group">
          <label for="nombre">Nombre:</label>
          <input id="nombre" v-model="nuevoPaciente.nombre" required>
        </div>
        <div class="form-group">
          <label for="fecha_nacimiento">Fecha de Nacimiento:</label>
          <input id="fecha_nacimiento" type="date" v-model="nuevoPaciente.fecha_nacimiento" required>
        </div>
        <div class="form-group">
          <label for="dni">DNI:</label>
          <input id="dni" v-model="nuevoPaciente.dni" required>
        </div>
        <div class="form-group">
          <label for="sip">SIP:</label>
          <input id="sip" v-model="nuevoPaciente.sip" required>
        </div>

        <!-- Segunda fila: Contacto -->
        <div class="form-group">
          <label for="telefono">Teléfono:</label>
          <input id="telefono" v-model="nuevoPaciente.telefono" required>
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input id="email" type="email" v-model="nuevoPaciente.email" required>
        </div>
        <div class="form-group">
          <label for="direccion">Dirección:</label>
          <input id="direccion" v-model="nuevoPaciente.direccion" required>
        </div>
        <div class="form-group">
          <label for="contacto">Contacto:</label>
          <input id="contacto" v-model="nuevoPaciente.contacto">
        </div>
        <div class="form-group">
          <label for="zona_id">Zona:</label>
          <select id="zona_id" v-model="nuevoPaciente.zona_id" required>
            <option v-for="zona in zonas" :key="zona.id" :value="zona.id">
              {{ zona.nombre }}
            </option>
          </select>
        </div>

        <!-- Tercera fila: Situación personal y sanitaria -->
        <div class="form-group">
          <label for="situacion_personal">Situación Personal:</label>
          <textarea id="situacion_personal" v-model="nuevoPaciente.situacion_personal"></textarea>
        </div>
        <div class="form-group">
          <label for="situacion_sanitaria">Situación Sanitaria:</label>
          <textarea id="situacion_sanitaria" v-model="nuevoPaciente.situacion_sanitaria"></textarea>
        </div>

        <!-- Cuarta fila: Situación de hábitat y autonomía -->
        <div class="form-group">
          <label for="situacion_habitage">Situación de Hábitat:</label>
          <textarea id="situacion_habitage" v-model="nuevoPaciente.situacion_habitage"></textarea>
        </div>
        <div class="form-group">
          <label for="autonomia">Autonomía:</label>
          <textarea id="autonomia" v-model="nuevoPaciente.autonomia"></textarea>
        </div>

        <!-- Quinta fila: Situación económica -->
        <div class="form-group">
          <label for="situacion_economica">Situación Económica:</label>
          <textarea id="situacion_economica" v-model="nuevoPaciente.situacion_economica"></textarea>
        </div>

        <!-- Botones -->
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Guardar</button>
          <router-link to="/home" class="btn btn-secondary">Cancelar</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { useApiStore } from '@/stores/api';
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const apiStore = useApiStore();
    const router = useRouter();
    const zonas = ref([]);

    const nuevoPaciente = ref({
      nombre: '',
      fecha_nacimiento: '',
      direccion: '',
      dni: '',
      sip: '',
      telefono: '',
      email: '',
      contacto: '', // Nuevo campo de contacto
      zona_id: '', // Campo de zona
      situacion_personal: '',
      situacion_sanitaria: '',
      situacion_habitage: '',
      autonomia: '',
      situacion_economica: ''
    });

    onMounted(async () => {
      await apiStore.fetchZonas();
      zonas.value = apiStore.zonas;
    });

    const guardarAlta = async () => {
      try {
        await apiStore.addPaciente(nuevoPaciente.value);
        router.push('/home');
      } catch (error) {
        console.error('Error al agregar el paciente:', error);
      }
    };

    return {
      nuevoPaciente,
      zonas,
      guardarAlta,
    };
  },
};
</script>

<style scoped>
.main-container {
  padding-top: 80px; /* Asegura que el contenido no se solape con el header secundario */
}
.container {
  padding: 80px 20px 20px;
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

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}
</style>
