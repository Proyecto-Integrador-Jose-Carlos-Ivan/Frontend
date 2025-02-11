<template>
    <div class="container">
        <div class="pacientes">
            <h2>Fecha actual: {{ formattedDate }}</h2>
            <table class="styled-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellidos</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="paciente in filteredPacientes" :key="paciente.id">
                        <td>{{ paciente.nombre }}</td>
                        <td>{{ paciente.apellidos }}</td>
                        <td>{{ paciente.fecha }}</td>
                        <td>{{ paciente.hora }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import { useApiStore } from '@/stores/api';  // Asumiendo que tienes un store para obtener los pacientes

export default {
    data() {
        return {
            date: new Date(),  // Fecha actual seleccionada en el calendario (ya no se usa, pero la mantenemos por compatibilidad)
            pacientes: [],      // Lista de pacientes
            attributes: [],     // Atributos de las fechas en el calendario (ya no se usa)
            events: [],         // Eventos del calendario (ya no se usa)
            selectedAttribute: { dot: true }, // Atributos para marcar fechas en el calendario (ya no se usa)
        };
    },
    computed: {
        // Formatear la fecha para coincidir con el formato de los pacientes
        formattedDate() {
            const day = String(this.date.getDate()).padStart(2, '0');
            const month = String(this.date.getMonth() + 1).padStart(2, '0');
            const year = this.date.getFullYear();
            return `${day}/${month}/${year}`;
        },

        // Filtrar pacientes según la fecha seleccionada
        filteredPacientes() {
            return this.pacientes
                .filter(paciente => paciente.fecha === this.formattedDate)
                .sort((a, b) => a.hora.localeCompare(b.hora));
        }
    },
    methods: {
        // Recuperar pacientes desde el store
        async fetchPacientes() {
            const store = useApiStore();
            this.pacientes = store.pacientes; // Aquí asumimos que tienes un store que devuelve los pacientes
        }
    },
    mounted() {
        // Llamamos a la función para obtener los pacientes al montar el componente
        this.fetchPacientes();
    }
};
</script>



<style scoped>
.container {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.pacientes {
  width: 100%;
  max-width: 1200px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

h2 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.styled-table {
  width: 100%;
  border-collapse: collapse;
  margin: 15px 0;
  font-size: 18px;
  text-align: left;
}

.styled-table thead tr {
  background-color: #3498db;
  color: #ffffff;
  text-align: left;
}

.styled-table th,
.styled-table td {
  padding: 12px 15px;
}

.styled-table tbody tr {
  border-bottom: 1px solid #dddddd;
}

.styled-table tbody tr:nth-child(odd) {
  background-color: #ffe7e7;
}

.styled-table tbody tr:nth-child(even) {
  background-color: #fff2f2;
}

.styled-table tbody tr:hover {
  background-color: #bb879181;
}

.styled-table tbody tr:last-of-type {
  border-bottom: 2px solid #c62041;
}

@media (max-width: 768px) {
  .container {
    padding: 10px;
  }

  .pacientes {
    padding: 1rem;
  }

  .styled-table {
    font-size: 16px;
  }

  .styled-table th,
  .styled-table td {
    padding: 8px 10px;
  }
}
</style>