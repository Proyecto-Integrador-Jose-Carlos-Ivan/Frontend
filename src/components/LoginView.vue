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
      <img src="/google.svg" alt="Google Logo" class="google-logo" />
      Iniciar sesión con Google
    </button>
  </div>
</template>

<script>
import { ref, watch} from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import AuthRepository from '../repositories/auth.repository';

export default {
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const authRepository = new AuthRepository();

    const email = ref('');
    const password = ref('');

    const loginWithCredentials = async () => {
      try {
        const payload = {
          email: email.value,
          password: password.value,
        };
        const result = await authRepository.loginWithCredentials(payload);
        if (result.success) {
          authStore.setToken(result.data.token);
          authStore.setUser(result.data.user);
          router.push({ name: 'home' });
        } else {
          console.error('Login with credentials failed:', result.error);
        }
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
      }
    };

    const loginWithGoogle = async () => {
      try {
        const result = await authRepository.loginWithGoogle();
        if (result.success) {
          authStore.setToken(result.data.token);
          authStore.setUser(result.data.user);
          router.push({ name: 'home' });
        } else {
          console.error('Google login failed:', result.error);
        }
      } catch (error) {
        console.error('Error during Google login:', error);
      }
    };

    // Watch for changes in isAuthenticated
    watch(
      () => authStore.isLoggedIn,
      (isLoggedIn) => {
        if (isLoggedIn) {
          router.push({ name: 'home' });
        }
      },
      { immediate: true } // Add immediate: true to run the watcher on component mount
    );

    return {
      email,
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