<template>
    <div class="container">
        <div class="pacientes">
            <h2>Pacientes para el día {{ formattedDate }}</h2>
            <table class="styled-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellidos</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="paciente in filteredPacientes" :key="paciente.nombre">
                        <td>{{ paciente.nombre }}</td>
                        <td>{{ paciente.apellidos }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="calendario">
            <VDatePicker v-model="date" mode="date" ref="date" expanded >
                <template #footer>
                    <button @click="moveToday" class="custom-button">Hoy</button>
                </template>
            </VDatePicker>
        </div>
        </div>
    </template>

    <style scoped>
    .container {
        display: flex;
        justify-content: space-between;
    }

    .pacientes {
        flex: 1;
        margin-right: 20px;
    }

    .calendario {
        flex: 0 0 500px; /* Increased size */
    }

    .styled-table {
        width: 100%;
        border-collapse: collapse;
        margin: 25px 0;
        font-size: 18px;
        text-align: left;
    }

    .styled-table thead tr {
        background-color: #009879;
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
        border-bottom: 2px solid #009879;
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
        { nombre: 'Juan', apellidos: 'Pérez', fecha: '01/02/2025' },
        { nombre: 'María', apellidos: 'Gómez', fecha: '02/02/2025' },
        { nombre: 'Carlos', apellidos: 'López', fecha: '03/02/2025' },
        { nombre: 'Ana', apellidos: 'Martínez', fecha: '04/02/2025' },
        { nombre: 'Luis', apellidos: 'Hernández', fecha: '05/02/2025' },
        { nombre: 'Laura', apellidos: 'García', fecha: '06/02/2025' },
        { nombre: 'Pedro', apellidos: 'Rodríguez', fecha: '07/02/2025' },
        { nombre: 'Sofía', apellidos: 'Fernández', fecha: '08/02/2025' },
        { nombre: 'Miguel', apellidos: 'Sánchez', fecha: '09/02/2025' },
        { nombre: 'Lucía', apellidos: 'Ramírez', fecha: '10/02/2025' },
        { nombre: 'Javier', apellidos: 'Torres', fecha: '11/02/2025' },
        { nombre: 'Elena', apellidos: 'Flores', fecha: '12/02/2025' },
        { nombre: 'Raúl', apellidos: 'Ruiz', fecha: '13/02/2025' },
        { nombre: 'Carmen', apellidos: 'Díaz', fecha: '14/02/2025' },
        { nombre: 'Alberto', apellidos: 'Jiménez', fecha: '15/02/2025' },
        { nombre: 'Isabel', apellidos: 'Moreno', fecha: '16/02/2025' },
        { nombre: 'Pablo', apellidos: 'Álvarez', fecha: '17/02/2025' },
        { nombre: 'Teresa', apellidos: 'Castro', fecha: '18/02/2025' },
        { nombre: 'Andrés', apellidos: 'Ortiz', fecha: '19/02/2025' },
        { nombre: 'Rosa', apellidos: 'Rubio', fecha: '20/02/2025' },
        { nombre: 'Mario', apellidos: 'Vargas', fecha: '01/02/2025' },
        { nombre: 'Lucía', apellidos: 'Méndez', fecha: '02/02/2025' },
        { nombre: 'Clara', apellidos: 'Núñez', fecha: '03/02/2025' },
        { nombre: 'Diego', apellidos: 'Paredes', fecha: '04/02/2025' },
        { nombre: 'Eva', apellidos: 'Santos', fecha: '05/02/2025' },
        { nombre: 'Hugo', apellidos: 'Ramos', fecha: '06/02/2025' },
        { nombre: 'Marta', apellidos: 'Vega', fecha: '07/02/2025' },
        { nombre: 'Sergio', apellidos: 'Cruz', fecha: '08/02/2025' },
        { nombre: 'Paula', apellidos: 'Ortega', fecha: '09/02/2025' },
        { nombre: 'David', apellidos: 'Navarro', fecha: '10/02/2025' }
    ];

    const filteredPacientes = computed(() => {
        return pacientes.filter(paciente => paciente.fecha === formattedDate.value);
    });

    function  moveToday() {
        date.value = new Date();
    }
</script>
