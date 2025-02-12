<template>
    <nav class="app-menu">
        <h1>Sistema de TeleAsistencia</h1>
        <ul>
            <!-- Usamos 'router-link' en lugar de 'a' para usar Vue Router -->
            <li><router-link to="/" class="nav-link">Pacientes</router-link></li>
            <li><router-link to="/calendario" class="nav-link">Calendario</router-link></li>
            <li><router-link to="/informes" class="nav-link">Informes</router-link></li>
        </ul>
    </nav>
</template>

<style scoped>
.app-menu {
  background-color: #2c3e50;
  color: #ecf0f1;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
</style>

