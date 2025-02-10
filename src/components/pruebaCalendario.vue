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
                    <tr v-for="paciente in filteredPacientes" :key="paciente.nombre">
                        <td>{{ paciente.nombre }}</td>
                        <td>{{ paciente.apellidos }}</td>
                        <td>{{ paciente.fecha }}</td>
                        <td>{{ paciente.hora }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="calendario">
            <VDatePicker :select-attribute="selectedAttribute" :attributes="attributes" v-model="date" mode="date" ref="date" expanded >
                <template #footer>
                    <button @click="moveToday" class="custom-button">Hoy</button>
                </template>
            </VDatePicker>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const date = ref(new Date());

const formattedDate = computed(() => {
    const day = String(date.value.getDate()).padStart(2, '0');
    const month = String(date.value.getMonth() + 1).padStart(2, '0');
    const year = date.value.getFullYear();
    return `${day}/${month}/${year}`;
});

const pacientes = [
    { nombre: 'Juan', apellidos: 'Pérez', fecha: '03/02/2025', hora: '08:00' },
    { nombre: 'María', apellidos: 'Gómez', fecha: '04/02/2025', hora: '09:00' },
    { nombre: 'Carlos', apellidos: 'López', fecha: '05/02/2025', hora: '10:00' },
    { nombre: 'Ana', apellidos: 'Martínez', fecha: '06/02/2025', hora: '11:00' },
    { nombre: 'Luis', apellidos: 'Hernández', fecha: '07/02/2025', hora: '12:00' },
    { nombre: 'Laura', apellidos: 'García', fecha: '10/02/2025', hora: '13:00' },
    { nombre: 'Pedro', apellidos: 'Rodríguez', fecha: '11/02/2025', hora: '14:00' },
    { nombre: 'Sofía', apellidos: 'Fernández', fecha: '12/02/2025', hora: '15:00' },
    { nombre: 'Miguel', apellidos: 'Sánchez', fecha: '13/02/2025', hora: '16:00' },
    { nombre: 'Lucía', apellidos: 'Ramírez', fecha: '14/02/2025', hora: '17:00' },
    { nombre: 'Javier', apellidos: 'Torres', fecha: '17/02/2025', hora: '18:00' },
    { nombre: 'Elena', apellidos: 'Flores', fecha: '18/02/2025', hora: '19:00' },
    { nombre: 'Raúl', apellidos: 'Ruiz', fecha: '19/02/2025', hora: '20:00' },
    { nombre: 'Carmen', apellidos: 'Díaz', fecha: '20/02/2025', hora: '21:00' },
    { nombre: 'Alberto', apellidos: 'Jiménez', fecha: '21/02/2025', hora: '08:00' },
    { nombre: 'Isabel', apellidos: 'Moreno', fecha: '24/02/2025', hora: '09:00' },
    { nombre: 'Pablo', apellidos: 'Álvarez', fecha: '25/02/2025', hora: '10:00' },
    { nombre: 'Teresa', apellidos: 'Castro', fecha: '26/02/2025', hora: '11:00' },
    { nombre: 'Andrés', apellidos: 'Ortiz', fecha: '27/02/2025', hora: '12:00' },
    { nombre: 'Rosa', apellidos: 'Rubio', fecha: '28/02/2025', hora: '13:00' },
    { nombre: 'Mario', apellidos: 'Vargas', fecha: '03/02/2025', hora: '14:00' },
    { nombre: 'Lucía', apellidos: 'Méndez', fecha: '04/02/2025', hora: '15:00' },
    { nombre: 'Clara', apellidos: 'Núñez', fecha: '05/02/2025', hora: '16:00' },
    { nombre: 'Diego', apellidos: 'Paredes', fecha: '06/02/2025', hora: '17:00' },
    { nombre: 'Eva', apellidos: 'Santos', fecha: '07/02/2025', hora: '18:00' },
    { nombre: 'Hugo', apellidos: 'Ramos', fecha: '10/02/2025', hora: '19:00' },
    { nombre: 'Marta', apellidos: 'Vega', fecha: '11/02/2025', hora: '20:00' },
    { nombre: 'Sergio', apellidos: 'Cruz', fecha: '12/02/2025', hora: '21:00' },
    { nombre: 'Paula', apellidos: 'Ortega', fecha: '13/02/2025', hora: '08:00' },
    { nombre: 'David', apellidos: 'Navarro', fecha: '14/02/2025', hora: '09:00' }
];

const filteredPacientes = computed(() => {
    return pacientes
        .filter(paciente => paciente.fecha === formattedDate.value)
        .sort((a, b) => a.hora.localeCompare(b.hora));
});

const selectedAttribute = ref({ dot: true });

const attributes = ref([
    {
        bar: 'red',
        dates: pacientes.map(paciente => {
            const [day, month, year] = paciente.fecha.split('/');
            return new Date(year, month - 1, day);
        }),
    },
]);

function moveToday() {
    date.value = new Date();
}
</script>

<style scoped>
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

    .styled-table tbody tr:last-of-type {
        border-bottom: 2px solid #c62041;
    }

    .styled-table tbody tr.active-row {
        font-weight: bold;
        color: #009879;
    }

    .custom-button {
        background-color: #e54646; /* bg-indigo-600 */
        color: white; /* text-white */
        font-weight: bold; /* font-bold */
        width: 100%; /* w-full */
        padding: 0.25rem 0.75rem; /* px-3 py-1 */
        border-radius: 0.375rem; /* rounded-md */
        transition: background-color 0.3s ease;
    }

    .custom-button:hover {
        background-color: #4338ca; /* hover:bg-indigo-700 */
    }
</style>