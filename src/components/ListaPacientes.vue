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
        <div class="calendario">
            <!-- Usa 'v-calendar' en minúsculas -->
            <VDatePicker 
                :select-attribute="selectedAttribute" 
                :attributes="attributes" 
                v-model="date" 
                mode="date" 
                ref="date" 
                expanded 
                :date="date" 
                :events="events" 
                @moveToday="moveToday">
                <template #footer>
                    <button @click="moveToday" class="custom-button">Hoy</button>
                </template>
            </VDatePicker>
        </div>
    </div>
</template>

<script>
import { useApiStore } from '@/stores/api';  // Asumiendo que tienes un store para obtener los pacientes

export default {
    data() {
        return {
            date: new Date(),  // Fecha actual seleccionada en el calendario
            pacientes: [],      // Lista de pacientes
            attributes: [],     // Atributos de las fechas en el calendario (marcadores de eventos)
            events: [],         // Eventos del calendario (pacientes con citas en esa fecha)
            selectedAttribute: { dot: true }, // Atributos para marcar fechas en el calendario
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
        // Cuando se cambia la fecha en el calendario
        onDateChange(newDate) {
            this.date = newDate;
        },

        // Recuperar pacientes desde el store
        async fetchPacientes() {
            const store = useApiStore();
            this.pacientes = store.pacientes; // Aquí asumimos que tienes un store que devuelve los pacientes
            this.updateCalendarAttributes();
        },

        // Actualizar los atributos de las fechas en el calendario
        updateCalendarAttributes() {
            this.attributes = this.pacientes.map(paciente => ({
                key: paciente.fecha,
                dates: [new Date(paciente.fecha.split('/').reverse().join('-'))],
                dot: true, // Puedes agregar un marcador de punto para las fechas
                bar: 'red' // Puedes personalizar el estilo de los atributos
            }));

            this.events = this.pacientes.map(paciente => ({
                start: new Date(paciente.fecha.split('/').reverse().join('-') + ' ' + paciente.hora),
                title: `${paciente.nombre} ${paciente.apellidos}`,
                color: 'red', // Puedes personalizar el color del evento
            }));
        },

        // Mover la fecha al día actual
        moveToday() {
            this.date = new Date();
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
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.pacientes {
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
  padding: 0.75rem 1rem;
  text-align: left;
}

.styled-table th {
  font-weight: 600;
}

.styled-table tbody tr:nth-child(even) {
  background-color: #f8f9fa;
}

.styled-table tbody tr:hover {
  background-color: #e9ecef;
}

.calendario {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.custom-button {
  background-color: #3498db;
  color: white;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.custom-button:hover {
  background-color: #2980b9;
}
</style>