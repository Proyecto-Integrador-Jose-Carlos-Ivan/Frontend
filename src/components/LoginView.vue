<template>
  <div class="login-container">
    <h1>Iniciar Sesión</h1>
    
    <!-- Formulario de inicio de sesión -->
    <form @submit.prevent="loginWithCredentials" class="login-form">
      <div class="form-group">
        <label for="email">Correo electrónico:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="password">Contraseña:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit" class="login-btn">Iniciar sesión</button>
    </form>

    <!-- Botón de inicio de sesión con Google -->
    <button @click="loginWithGoogle" class="google-login-btn">
      <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google Logo" class="google-logo" />
      Iniciar sesión con Google
    </button>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useApiStore } from '@/stores/api';

export default {
  setup() {
    const router = useRouter();
    const apiStore = useApiStore();

    const email = ref(''); // Cambiado de username a email
    const password = ref('');

    const loginWithCredentials = async () => {
      try {
        const payload = {
          email: email.value, // Cambiado de username a email
          password: password.value,
        };
        await apiStore.login(payload);
        if (apiStore.isAuthenticated) {
          router.push({ name: 'home' });
        }
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
      }
    };

    const loginWithGoogle = () => {
      window.location.href = 'http://localhost/api/login/google';
    };

    // Verificar si el usuario ya está autenticado
    if (apiStore.isAuthenticated) {
      router.push({ name: 'home' });
    }

    return {
      email, // Cambiado de username a email
      password,
      loginWithCredentials,
      loginWithGoogle,
    };
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f4f4f4;
}

h1 {
  margin-bottom: 20px;
  font-size: 2rem;
  color: #333;
}

.login-form {
  display: flex;
  flex-direction: column;
  width: 300px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-size: 1rem;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 8px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.login-btn {
  padding: 10px 20px;
  font-size: 1rem;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.login-btn:hover {
  background-color: #0056b3;
}

.google-login-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  font-size: 1rem;
  color: #333;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.google-login-btn:hover {
  background-color: #f0f0f0;
}

.google-logo {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}
</style>