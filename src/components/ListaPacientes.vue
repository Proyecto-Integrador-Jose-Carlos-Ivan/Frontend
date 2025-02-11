<template>
    <div class="container">
        <div class="pacientes">
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
                    <!-- Mostrar los pacientes desde el store -->
                    <tr v-for="paciente in pacientes" :key="paciente.id">
                        <td>{{ paciente.nombre }}</td>
                        <td>{{ paciente.apellidos }}</td>
                        <td>{{ paciente.fecha }}</td>
                        <td>{{ paciente.hora }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="calendario">
            <Calendar :date="date" :events="events" @moveToday="moveToday" />
        </div>
    </div>
</template>

<script>
// Importa el store de Pinia
import { useApiStore } from '@/stores/api';


export default {
    data() {
        return {
            date: new Date(),  // Fecha actual
            events: []         // Eventos para el calendario, si los necesitas
        };
    },
    computed: {
        // Usamos el store de Pinia para obtener los pacientes
        pacientes() {
            const store = useApiStore();
            return store.pacientes;
        }
    },
    mounted() {
        // Llamamos a la acción fetchPacientes cuando el componente se monte
        const store = useApiStore();
        store.fetchPacientes();
    },
    methods: {
        moveToday() {
            // Lógica para mover el calendario a la fecha actual
        }
    }
};
</script>

<style>
    .container {
        display: grid;
        grid-template-columns: 1fr 500px; /* Adjusted size */
        gap: 10px;
    }

    .pacientes {
        width: 85%;
    }
    .calendario {
        width: 500px; /* Fixed size */
        margin-top: 80px;
        transform: translate(-80px);
    }

    .styled-table {
        width: 100%;
        border-collapse: collapse;
        margin: 15px 0;
        font-size: 18px;
        text-align: left;
    }

    .styled-table thead tr {
        background-color: #c62041;
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

    .styled-table tbody tr.active-row {
        font-weight: bold;
        color: #009879;
    }
</style>
