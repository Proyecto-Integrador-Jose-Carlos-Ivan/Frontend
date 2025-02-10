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
                    <tr v-for="paciente in pacientes" :key="paciente.nombre">
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
export default {
    data() {
        return {
            pacientes: [
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
            ]
        };
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