<template>
  <div class="main-container">
    <div class="container">
      <div class="zonas">
        <div class="header">
          <h2>Lista de Zonas</h2>
          <button @click="goToHome">Ver Pacientes</button>
        </div>

        <table class="styled-table">
          <thead>
            <tr>
              <th class="text-center">Nombre</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="zona in displayedZonas" :key="zona.id" @click="showZonaDetails(zona)">
              <td>{{ zona.name }}</td>
              <td class="actions-cell">
                <button @click.stop="editZona(zona)" class="edit-btn">
                  <font-awesome-icon :icon="['fas', 'edit']" />
                </button>
                <button @click.stop="confirmDelete(zona.id)" class="delete-btn">
                  <font-awesome-icon :icon="['fas', 'trash']" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="!isSearching" class="pagination">
          <button @click="prevPage" :disabled="currentPage === 1">Anterior</button>
          <span
            v-for="page in pagesToShow"
            :key="page"
            @click="page === '...' ? toggleInput() : goToPage(page)"
            :class="{ active: currentPage === page }"
          >
            <template v-if="page === '...'">
              <input
                v-if="showInput"
                type="number"
                v-model.number="inputPage"
                @blur="goToInputPage"
                @keyup.enter="goToInputPage"
                autofocus
              />
              <span v-else>...</span>
            </template>
            <template v-else>
              {{ page }}
            </template>
          </span>
          <button @click="nextPage" :disabled="currentPage === totalPages">Siguiente</button>
        </div>
      </div>
    </div>

    <!-- Modal para mostrar detalles de la zona -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-container">
        <div class="modal-header">
          <h2>Detalles de la Zona</h2>
          <button @click="closeModal" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <div v-if="selectedZona">
            <p><strong>Nombre:</strong> {{ selectedZona.nombre }}</p>
            <p><strong>Descripción:</strong> {{ selectedZona.descripcion || "No disponible" }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para editar zona -->
    <div v-if="showEditModal" class="modal-overlay" @click.self="closeEditModal">
      <div class="modal-container">
        <div class="modal-header">
          <h2>Editar Zona</h2>
          <button @click="closeEditModal" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="updateZona">
            <div>
              <label>Nombre:</label>
              <input v-model="editZonaData.nombre" required />
            </div>
            <div>
              <label>Descripción:</label>
              <input v-model="editZonaData.descripcion" />
            </div>
            <button type="submit">Guardar</button>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal para confirmar eliminación -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="closeDeleteModal">
      <div class="modal-container">
        <div class="modal-header">
          <h2>Confirmar Eliminación</h2>
          <button @click="closeDeleteModal" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <p>¿Estás seguro de que deseas eliminar esta zona?</p>
          <button @click="deleteZona(deleteZonaId)" class="confirm-btn">Sí, eliminar</button>
          <button @click="closeDeleteModal" class="cancel-btn">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useApiStore } from '@/stores/api';
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

library.add(faEdit, faTrash);

export default {
  components: {
    FontAwesomeIcon,
  },
  setup() {
    const zonasStore = useApiStore();
    const showModal = ref(false); // Controla la visibilidad del modal
    const selectedZona = ref(null); // Almacena la zona seleccionada
    const currentPage = ref(1);
    const itemsPerPage = 10;
    const showInput = ref(false);
    const inputPage = ref(null);
    const isSearching = ref(false);
    const router = useRouter();

    // Muestra el modal con los detalles de la zona
    const showZonaDetails = (zona) => {
      selectedZona.value = zona;
      showModal.value = true;
    };

    // Cierra el modal
    const closeModal = () => {
      showModal.value = false;
      selectedZona.value = null;
    };

    const paginatedZonas = computed(() => {
      const zonas = isSearching.value ? zonasStore.filteredZonas : zonasStore.zonas;
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return zonas.slice(start, end);
    });

    const totalPages = computed(() => {
      const zonas = isSearching.value ? zonasStore.filteredZonas : zonasStore.zonas;
      return Math.ceil(zonas.length / itemsPerPage);
    });

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };

    const goToPage = (page) => {
      currentPage.value = page;
    };

    const toggleInput = () => {
      showInput.value = !showInput.value;
    };

    const goToInputPage = () => {
      if (inputPage.value >= 1 && inputPage.value <= totalPages.value) {
        currentPage.value = inputPage.value;
      }
      showInput.value = false;
    };

    const pagesToShow = computed(() => {
      const total = totalPages.value;
      const current = currentPage.value;
      const pages = [];

      // Si hay 4 o menos páginas, mostrar todas
      if (total <= 4) {
        for (let i = 1; i <= total; i++) {
          pages.push(i);
        }
        return pages;
      }
    
      // Si la página actual está cerca del inicio
      if (current <= 2) {
        pages.push(1, 2, 3, '...', total);
      }
      // Si la página actual está cerca del final
      else if (current >= total - 1) {
        pages.push(1, '...', total - 2, total - 1, total);
      }
      // Si la página actual está en el medio
      else {
        pages.push(1, '...', current - 1, current, current + 1, '...', total);
      }
    
      return pages;
    });

    const displayedZonas = computed(() => {
      return paginatedZonas.value;
    });

    const goToHome = () => {
      router.push({ name: 'home' });
    };

    onMounted(async () => {
      await zonasStore.fetchZonas();
    });

    watch(() => zonasStore.searchQuery, (newQuery) => {
      isSearching.value = newQuery.length < 0;
      currentPage.value = 1;
    });

    const showEditModal = ref(false);
    const editZonaData = ref({});

    const editZona = (zona) => {
      editZonaData.value = { ...zona };
      showEditModal.value = true;
    };

    const closeEditModal = () => {
      showEditModal.value = false;
      editZonaData.value = {};
    };

    const updateZona = async () => {
      await zonasStore.updateZona(editZonaData.value.id, editZonaData.value);
      closeEditModal();
    };

    const showDeleteModal = ref(false);
    const deleteZonaId = ref(null);

    const confirmDelete = (id) => {
      deleteZonaId.value = id;
      showDeleteModal.value = true;
    };

    const closeDeleteModal = () => {
      showDeleteModal.value = false;
      deleteZonaId.value = null;
    };

    const deleteZona = async (id) => {
      await zonasStore.deleteZona(id);
      closeDeleteModal();
    };

    return {
      zonasStore,
      showModal,
      selectedZona,
      showZonaDetails,
      closeModal,
      displayedZonas,
      currentPage,
      totalPages,
      prevPage,
      nextPage,
      goToPage,
      pagesToShow,
      showInput,
      inputPage,
      toggleInput,
      goToInputPage,
      isSearching,
      goToHome,
      showEditModal,
      editZonaData,
      editZona,
      closeEditModal,
      updateZona,
      showDeleteModal,
      deleteZonaId,
      confirmDelete,
      closeDeleteModal,
      deleteZona,
    };
  }
};
</script>

<style scoped>
.main-container {
  padding-top: 90px; /* Reducir el padding superior */
}

.container {
  display: grid;
  grid-template-columns: 1fr;
  justify-content: center;
  padding: 5px 20px 20px; /* Reducir el padding superior */
}

.zonas {
  width: auto;
  max-width: 90vw;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1rem; /* Reducir el padding */
  overflow-x: auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.header button:hover {
  background-color: #2980b9;
}

h2 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-top: 1rem;
  margin-bottom: 1rem; /* Reducir el margen inferior */
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
  padding: 0.5rem 0.75rem; /* Reducir el padding */
  text-align: center; /* Centrar el texto */
}

.styled-table thead th {
  padding-top: 0.25rem; /* Reducir el padding superior */
  padding-bottom: 0.25rem; /* Reducir el padding inferior */
}

.styled-table tbody tr:nth-child(even) {
  background-color: #f8f9fa;
}

.styled-table tbody tr:hover {
  background-color: #e9ecef;
  cursor: pointer; /* Cambia el cursor al pasar sobre una fila */
}

.styled-table tbody tr:last-of-type {
  border-bottom: 2px solid #ffffff;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
}

.pagination button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  margin: 0 0.25rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.pagination button:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.pagination span {
  margin: 0 0.25rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.pagination span.active {
  background-color: #3498db;
  color: white;
}

.pagination span:hover {
  background-color: #e9ecef;
}

.pagination input {
  width: 50px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0.25rem;
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
  max-width: 600px; /* Ajustar el ancho máximo */
  max-height: 90vh;
  overflow-y: auto;
  padding: 1.5rem; /* Ajustar el padding */
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem; /* Ajustar el padding */
  background-color: #34495e; /* Cambiar el color de fondo */
  border-bottom: 1px solid #e9ecef;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.modal-header h2 {
  margin: 0;
  color: #ffffff; /* Cambiar el color del texto */
  font-size: 1.5rem; /* Ajustar el tamaño de fuente */
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem; /* Ajustar el tamaño de fuente */
  color: #6c757d;
  cursor: pointer;
  transition: color 0.3s ease; /* Añadir transición */
}

.close-btn:hover {
  color: #343a40;
}

.modal-body {
  padding: 1rem; /* Ajustar el padding */
  flex-grow: 1;
  overflow-y: auto;
}

.modal-body p {
  margin-bottom: 1rem;
  font-size: 1rem; /* Ajustar el tamaño de fuente */
  color: #2c3e50;
}

.styled-table td button {
  margin-right: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  transition: color 0.3s ease;
}

.styled-table td .edit-btn {
  color: #3498db;
}

.styled-table td .edit-btn:hover {
  color: #2980b9;
}

.styled-table td .delete-btn {
  color: #e74c3c;
}

.styled-table td .delete-btn:hover {
  color: #c0392b;
}

.modal-body form div {
  margin-bottom: 1rem;
}

.modal-body form label {
  display: block;
  margin-bottom: 0.5rem;
}

.modal-body form input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.modal-body form button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.modal-body form button:hover {
  background-color: #2980b9;
}

.confirm-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-right: 0.5rem;
}

.confirm-btn:hover {
  background-color: #c0392b;
}

.cancel-btn {
  background-color: #bdc3c7;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.cancel-btn:hover {
  background-color: #95a5a6;
}

.actions-cell {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.styled-table td {
  text-align: center; /* Centrar el texto */
}

@media (max-width: 768px) {
  .container {
    padding: 60px 10px 10px; /* Reducir el padding para móviles */
  }

  .zonas {
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

  .modal-container {
    width: 95%;
    padding: 1rem; /* Ajustar el padding para móviles */
  }
}
</style>
