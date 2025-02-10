<template>
    <nav class="app-menu">
        <h1>Sistema de Teleoperadores</h1>
        <ul>
            <li><a href="http://localhost:5173/">Pacientes</a></li>
            <li><a href="http://localhost:5173/calendario">Calendario</a></li>
            <li><a href="http://localhost:5173/calendario">Informes</a></li>
        </ul>
    </nav>
</template>

<style scoped>
    .app-menu {
        background-color: #a50000;
        color: #ececec;
        padding: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    h1 {
        font-size: 2em;
    }
    ul {
        list-style: none;
        padding: 0;
        display: flex;
        gap: 15px;
        font-size: 1.2em;
    }
    li {
        cursor: pointer;
        a {
            color: #ececec;
            text-decoration: none;
        }
    }
</style>