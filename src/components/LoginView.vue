<template>
  <div class="login-container">
    <h1>Iniciar Sesión</h1>
    <button @click="loginWithGoogle" class="google-login-btn">
      <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google Logo" class="google-logo" />
      Iniciar sesión con Google
    </button>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { useApiStore } from '@/stores/api';

export default {
  setup() {
    const router = useRouter();
    const apiStore = useApiStore();

    const loginWithGoogle = () => {
      window.location.href = 'http://localhost/api/login/google';
    };

    // Verificar si el usuario ya está autenticado
    if (apiStore.isAuthenticated) {
      router.push({ name: 'home' });
    }

    return {
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