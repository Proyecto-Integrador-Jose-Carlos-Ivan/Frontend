<template>
  <div>
    <!-- Header principal (menú) -->
    <nav class="app-menu">
      <h1>Sistema de TeleAsistencia</h1>
      <ul>
        <li><router-link to="/" class="nav-link"><font-awesome-icon icon="user" class="w-6 h-6 text-white" /></router-link></li>
        <li><router-link to="/calendario" class="nav-link"><font-awesome-icon icon="calendar" class="w-6 h-6 text-white" /></router-link></li>
        <li><router-link to="/informes" class="nav-link"><font-awesome-icon icon="file-alt" class="w-6 h-6 text-white" /></router-link></li>
        <li><router-link to="/llamadas" class="nav-link"><font-awesome-icon icon="phone" class="w-6 h-6 text-white" /></router-link></li>
        <li><router-link to="/llamadas" class="nav-link"><font-awesome-icon icon="phone-alt" class="w-6 h-6 text-white" /></router-link></li>
        <li>
          <button @click="logout" class="nav-link logout-btn">Cerrar sesión</button>
        </li>
      </ul>
    </nav>

    <!-- Header secundario (buscador y botón de alta) -->
    <header class="secondary-header">
      <div>
        <button @click="mostrarFormularioAlta" class="alta-btn">Dar de alta</button>
      </div>
      <div class="search-container">
        <input
          type="text"
          v-model="searchQuery"
          @input="buscarPacientes"
          placeholder="Buscar paciente..."
          class="search-input"
        />
      </div>
    </header>

    <!-- Modal para dar de alta un paciente -->
    <div v-if="modalAlta" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h2>Dar de Alta a un Paciente</h2>
          <button @click="cerrarModal" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="guardarAlta" class="form-grid">
            <!-- Primera fila -->
            <div class="form-group">
              <label for="nombre">Nombre:</label>
              <input id="nombre" v-model="nuevoPaciente.nombre" required>
            </div>
            <div class="form-group">
              <label for="situacion_personal">Situación Personal:</label>
              <input id="situacion_personal" v-model="nuevoPaciente.situacion_personal">
            </div>
            <div class="form-group">
              <label for="fecha_nacimiento">Fecha de Nacimiento:</label>
              <input id="fecha_nacimiento" type="date" v-model="nuevoPaciente.fecha_nacimiento">
            </div>
            <div class="form-group">
              <label for="direccion">Dirección:</label>
              <input id="direccion" v-model="nuevoPaciente.direccion">
            </div>
            <!-- Segunda fila -->
            <div class="form-group">
              <label for="dni">DNI:</label>
              <input id="dni" v-model="nuevoPaciente.dni">
            </div>
            <div class="form-group">
              <label for="email">Email:</label>
              <input id="email" type="email" v-model="nuevoPaciente.email">
            </div>
            <div class="form-group">
              <label for="telefono">Teléfono:</label>
              <input id="telefono" v-model="nuevoPaciente.telefono">
            </div>
            <div class="form-group">
              <label for="sip">SIP:</label>
              <input id="sip" v-model="nuevoPaciente.sip">
            </div>
            <!-- Tercera fila -->
            <div class="form-group">
              <label for="situacion_economica">Situación Económica:</label>
              <input id="situacion_economica" v-model="nuevoPaciente.situacion_economica">
            </div>
            <div class="form-group">
              <label for="situacion_sanitaria">Situación Sanitaria:</label>
              <input id="situacion_sanitaria" v-model="nuevoPaciente.situacion_sanitaria">
            </div>
            <!-- Botones -->
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Guardar</button>
              <button type="button" @click="cerrarModal" class="btn btn-secondary">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useApiStore } from '@/stores/api'
import { usePacientesStore } from '@/stores/pacientesStore'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faUser, faCalendar, faFileAlt, faPhone, faPhoneAlt } from '@fortawesome/free-solid-svg-icons';


export default {
  components: {
    FontAwesomeIcon,
  },

  data(){
    return {
      faUser,
      faCalendar,
      faFileAlt,
      faPhone,
      faPhoneAlt,
    }
  },
  name: 'AppMenu',
  setup() {
    const apiStore = useApiStore()
    const pacientesStore = usePacientesStore()
    const router = useRouter()
    const searchQuery = ref('')
    const modalAlta = ref(false)
    const nuevoPaciente = ref({
      nombre: '',
      situacion_personal: '',
      fecha_nacimiento: '',
      direccion: '',
      dni: '',
      email: '',
      telefono: '',
      sip: '',
      situacion_economica: '',
      situacion_sanitaria: ''
    })

    const logout = () => {
      apiStore.logout()
      router.push('/')
    }

    const mostrarFormularioAlta = () => {
      modalAlta.value = true
      document.body.style.overflow = 'hidden'
    }

    const cerrarModal = () => {
      modalAlta.value = false
      document.body.style.overflow = 'auto'
    }

    const guardarAlta = async () => {
      try {
        await pacientesStore.addPaciente(nuevoPaciente.value)
        cerrarModal()
        nuevoPaciente.value = {
          nombre: '',
          situacion_personal: '',
          fecha_nacimiento: '',
          direccion: '',
          dni: '',
          email: '',
          telefono: '',
          sip: '',
          situacion_economica: '',
          situacion_sanitaria: ''
        }
      } catch (error) {
        console.error('Error al agregar el paciente:', error)
      }
    }

    const buscarPacientes = () => {
      pacientesStore.buscarPacientes(searchQuery.value)
    }

    return {
      apiStore,
      logout,
      searchQuery,
      modalAlta,
      nuevoPaciente,
      mostrarFormularioAlta,
      cerrarModal,
      guardarAlta,
      buscarPacientes,
      
      
    }
  }
}
</script>

<style scoped>
/* Estilos del menú principal */
.app-menu {
  background-color: #2c3e50;
  color: #ecf0f1;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

ul {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 1.5rem;
  margin: 0;
}

.nav-link {
  color: inherit;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #3498db;
}

.logout-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: inherit;
  padding: 0;
  color: inherit;
}

.logout-btn:hover {
  color: #3498db;
}

/* Estilos del header secundario */
.secondary-header {
  background-color: #34495e;
  padding: 1rem 2rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  z-index: 999;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-container {
  flex-grow: 1;
  margin-left: 1rem;
}

.search-input {
  width: 100%;
  max-width: 300px;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  color: #2c3e50;
  background-color: #ecf0f1;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  border-color: #3498db;
  outline: none;
}

.alta-btn {
  padding: 0.5rem 1rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.alta-btn:hover {
  background-color: #2980b9;
}

/* Estilos del modal */
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
  z-index: 1001;
}

.modal-container {
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  width: 800px;
  max-width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #2c3e50;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
  transition: color 0.3s ease;
}

.close-btn:hover {
  color: #343a40;
}

/* Estilos del formulario en cuadrícula */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2c3e50;
  font-size: 0.9rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  font-size: 0.9rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  border-color: #3498db;
  outline: none;
}

/* Botones */
.form-actions {
  grid-column: span 2;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover {
  background-color: #2980b9;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}
</style>