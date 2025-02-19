<template>
  <div class="operador-info">
    <h1>Información del Operador</h1>
    <div class="info-container" v-if="operador">
      <div class="avatar-container">
        <img :src="operador.avatar || '@/assets/default-avatar.png'" alt="Avatar" class="avatar" />
      </div>
      <div class="details-container">
        <p><strong>Nombre:</strong> {{ operador.name }}</p>
        <p><strong>Apellidos:</strong> {{ operador.apellidos }}</p>
        <p><strong>Email:</strong> {{ operador.email }}</p>
        <p><strong>Rol:</strong> {{ operador.role }}</p>
        <p><strong>Teléfono:</strong> {{ operador.telefono }}</p>
        <p><strong>Lenguas:</strong> {{ operador.lenguas }}</p>
        <p><strong>Fecha de Contratación:</strong> {{ operador.fecha_contratacion }}</p>
        <p><strong>Fecha de Baja:</strong> {{ operador.fecha_baja }}</p>
        <p><strong>Username:</strong> {{ operador.username }}</p>
      </div>
    </div>
    <div v-else>
      <p>No hay información del operador disponible.</p>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore';
import defaultAvatar from '@/assets/default-avatar.png'; // Ensure this path is correct

export default {
  name: 'OperadorInfo',
  setup() {
    const authStore = useAuthStore();
    authStore.initializeAuth(); // Ensure the auth state is initialized
    const operador = authStore.user;

    return {
      operador,
      defaultAvatar,
    };
  },
};
</script>

<style scoped>
.operador-info {
  padding: 2rem;
  background-color: #ecf0f1;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 2rem auto;
}

.operador-info h1 {
  margin-bottom: 1.5rem;
  color: #2c3e50;
  text-align: center;
}

.info-container {
  display: flex;
  align-items: center;
}

.avatar-container {
  flex: 1;
  display: flex;
  justify-content: center;
}

.avatar {
  max-width: 150px;
  border-radius: 50%;
}

.details-container {
  flex: 2;
  padding-left: 2rem;
}

.details-container p {
  margin: 0.5rem 0;
  font-size: 1rem;
  color: #34495e;
}
</style>
