<template>
  <div>
    <!-- Header principal (menú) -->
    <nav v-if="!isLoginRoute" class="app-menu">
      <h1>Sistema de TeleAsistencia</h1>
      <ul>
        <li>
          <router-link to="/home" class="nav-link">
            <font-awesome-icon :icon="['fas', 'user']" class="w-6 h-6 text-white" />
          </router-link>
        </li>
        <li>
          <router-link to="/calendario" class="nav-link">
            <font-awesome-icon :icon="['fas', 'calendar']" class="w-6 h-6 text-white" />
          </router-link>
        </li>
        <li>
          <router-link to="/informes" class="nav-link">
            <font-awesome-icon :icon="['fas', 'file-alt']" class="w-6 h-6 text-white" />
          </router-link>
        </li>
        <li>
          <router-link to="/llamadasEntrantes" class="nav-link">
            <font-awesome-icon :icon="['fas', 'phone-volume']" class="w-6 h-6 text-white" />
          </router-link>
        </li>
        <li>
          <router-link to="/llamadasSalientes" class="nav-link">
            <font-awesome-icon :icon="['fas', 'phone-slash']" class="w-6 h-6 text-white" />
          </router-link>
        </li>
        <li>
          <router-link to="/avisos" class="nav-link">
            <font-awesome-icon :icon="['fas', 'exclamation-triangle']" class="w-6 h-6 text-white" />
          </router-link>
        </li>
        <li>
          <div class="user-dropdown">
            <button class="nav-link user-btn">
              <font-awesome-icon :icon="['fas', 'user-circle']" class="w-8 h-8 text-white" />
            </button>
            <div class="dropdown-content">
              <router-link to="/operador-info" class="dropdown-item">Detalles</router-link>
              <router-link to="/" @click="logout" class="dropdown-item">Cerrar sesión</router-link>
            </div>
          </div>
        </li>
      </ul>
    </nav>

    <!-- Header secundario (buscador y botón de alta) -->
    <header v-if="!isLoginRoute" class="secondary-header">
      <div>
        <router-link to="/alta" class="alta-btn">Dar de alta</router-link>
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
  </div>
</template>

<script>
import { useApiStore } from '@/stores/api';
import { useRouter, useRoute } from 'vue-router';
import { ref, computed, onMounted } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faUser, faCalendar, faFileAlt, faPhone, faPhoneAlt, faPhoneSlash, faPhoneVolume, faUserCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { useAuthStore } from '@/stores/authStore';


library.add(faUser, faCalendar, faFileAlt, faPhone, faPhoneAlt, faPhoneSlash, faPhoneVolume, faUserCircle, faExclamationTriangle);

export default {
  components: {
    FontAwesomeIcon,
  },

  data() {
    return {
      faUser,
      faCalendar,
      faFileAlt,
      faPhone,
      faPhoneAlt,
    };
  },

  name: 'AppMenu',

  setup() {
    const apiStore = useApiStore();
    const router = useRouter();
    const route = useRoute();
    const authStore = useAuthStore();

    const modalAlta = ref(false);
    const zonas = ref([]);
    const searchQuery = ref('');

    const nuevoPaciente = ref({
      nombre: '',
      fecha_nacimiento: '',
      direccion: '',
      dni: '',
      sip: '',
      telefono: '',
      email: '',
      zona_id: '',
      situacion_personal: '',
      situacion_sanitaria: '',
      situacion_habitage: '',
      autonomia: '',
      situacion_economica: ''
    });

    const isLoginRoute = computed(() => route.name === 'login');

    onMounted(async () => {
      await apiStore.fetchZonas();
      zonas.value = apiStore.zonas;
    });

    const logout = () => {
      authStore.logout();
      router.push('/');
    };

    const mostrarFormularioAlta = () => {
      modalAlta.value = true;
      document.body.style.overflow = 'hidden';
    };

    const cerrarModal = () => {
      modalAlta.value = false;
      document.body.style.overflow = 'auto';
    };

    const guardarAlta = async () => {
      try {
        await apiStore.addPaciente(nuevoPaciente.value);
        cerrarModal();
        nuevoPaciente.value = {
          nombre: '',
          fecha_nacimiento: '',
          direccion: '',
          dni: '',
          sip: '',
          telefono: '',
          email: '',
          zona_id: '',
          situacion_personal: '',
          situacion_sanitaria: '',
          situacion_habitage: '',
          autonomia: '',
          situacion_economica: ''
        };
      } catch (error) {
        console.error('Error al agregar el paciente:', error);
      }
    };

    const buscarPacientes = () => {
      const query = searchQuery.value.toLowerCase();
      if (query) {
        apiStore.buscarPacientes(query);
      } else {
        apiStore.fetchPacientes();
      }
      router.push('/home');
    };

    return {
      modalAlta,
      nuevoPaciente,
      zonas,
      searchQuery,
      isLoginRoute,
      mostrarFormularioAlta,
      cerrarModal,
      guardarAlta,
      buscarPacientes,
      logout,
    };
  },
};
</script>

<style scoped>
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
  padding: 1.5rem;
  border-radius: 12px;
  width: 700px;
  max-width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
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

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.form-group {
  margin-bottom: 0.75rem;
}

.form-group.full-width {
  grid-column: span 2;
}

.form-group label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 500;
  color: #2c3e50;
  font-size: 0.9rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  font-size: 0.9rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #3498db;
  outline: none;
}

/* Botones */
.form-actions {
  grid-column: span 2;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
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
.user-dropdown {
  position: relative;
  display: inline-block;
}

.user-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.dropdown-content {
  display: none;
  position: absolute;
  right: 0;
  background-color: #2c3e50;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  border-radius: 4px;
  overflow: hidden;
}

.dropdown-content .dropdown-item {
  color: white;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  text-align: left;
  transition: background-color 0.3s ease;
}

.dropdown-content .dropdown-item:hover {
  background-color: #34495e;
}

.user-dropdown:hover .dropdown-content {
  display: block;
}

@media (max-width: 768px) {
  ul {
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
  }

  ul li {
    display: inline-block;
  }

  .app-menu {
    flex-direction: column;
    align-items: center;
    padding: 1rem;
  }

  h1 {
    margin-bottom: 1rem;
  }
  
  .secondary-header {
    background-color: #34495e;
    padding: 1rem 2rem;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: fixed;
    top: 100px;
    left: 0;
    right: 0;
    z-index: 999;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .alta-btn {
    width: 10px;
  }
  
  .search-container {
    flex-grow: 1;
    width: 150px;
  }

}

</style>