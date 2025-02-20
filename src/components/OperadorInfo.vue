<template>
  <div class="operador-info">
    <h1>Información del Operador</h1>
    <div class="info-container" v-if="operador">
      <div class="avatar-container">
        <img :src="operador.avatar || defaultAvatar" alt="Avatar" class="avatar" />
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
  padding: 1.5rem;
  background-color: #ecf0f1;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 700px;
  margin: 12rem auto;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.operador-info h1 {
  margin-bottom: 1rem;
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
  margin-right: 1.5rem;
}

.avatar {
  max-width: 120px;
  border-radius: 50%;
}

.details-container {
  flex: 2;
  padding-left: 1.5rem;
}

.details-container p {
  margin: 0.5rem 0;
  font-size: 1rem;
  color: #34495e;
}
</style>
