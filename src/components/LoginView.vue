<template>
  <div class="login-container">
    <form @submit.prevent="login" class="login-form">
      <h2>Iniciar Sesión</h2>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <div class="form-group">
        <label for="password">Contraseña:</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <button type="submit" class="btn btn-primary">Iniciar Sesión</button>
      <p v-if="error" class="error-message">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useApiStore } from '@/stores/api';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const apiStore = useApiStore();
    const router = useRouter();
    const email = ref('');
    const password = ref('');
    const error = ref('');

    const login = async () => {
      error.value = '';
      try {
        await apiStore.login(email.value, password.value);
        router.push('/pacientes'); // Redirige a la página principal después del login
      } catch (err) {
        console.error('Error de autenticación:', err);
        error.value = 'Error de inicio de sesión. Verifica tus credenciales.';
      }
    };

    return {
      email,
      password,
      error,
      login,
    };
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
}

.login-form {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.btn {
  width: 100%;
  padding: 0.75rem;
  background-color: #009879;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.btn:hover {
  background-color: #007f67;
}

.error-message {
  color: red;
  margin-top: 1rem;
  text-align: center;
}
</style>