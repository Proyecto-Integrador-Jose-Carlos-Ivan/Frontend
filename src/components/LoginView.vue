<template>
  <div class="login-wrapper">
    <div class="login-container">
      <h1>TeleAsistencia Batoi</h1> <!-- Added title -->
      <h2>Iniciar Sesión</h2> <!-- Changed to h2 -->

      <!-- Formulario de inicio de sesión -->
      <Form @submit="loginWithCredentials" :validation-schema="schema" class="login-form">
        <div class="form-group">
          <label for="email">Correo electrónico:</label>
          <Field type="email" id="email" name="email" v-model="email" />
          <ErrorMessage name="email" class="error-message" />
        </div>
        <div class="form-group">
          <label for="password">Contraseña:</label>
          <Field type="password" id="password" name="password" v-model="password" />
          <ErrorMessage name="password" class="error-message" />
        </div>
        <button type="submit" class="login-btn">Iniciar sesión</button>
        <div v-if="loginError" class="error-message">{{ loginError }}</div>
      </Form>

      <!-- Botón de inicio de sesión con Google -->
      <button @click="loginWithGoogle" class="google-login-btn">
        <img src="/google.svg" alt="Google Logo" class="google-logo" />
        Iniciar sesión con Google
      </button>
    </div>
    <div class="login-image"></div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import AuthRepository from '../repositories/auth.repository';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';

export default {
  components: {
    Form,
    Field,
    ErrorMessage
  },
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const authRepository = new AuthRepository();

    const email = ref('');
    const password = ref('');
    const loginError = ref('');

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
          loginError.value = 'El email o la contraseña no coinciden';
        }
      } catch (error) {
        loginError.value = 'El email o la contraseña no coinciden'
        console.error(loginError.value);
      }
    };

    const loginWithGoogle = async () => {
      try {
        const result = await authRepository.loginWithGoogle();
        if (result.success) {
          authStore.setToken(result.token);
          authStore.setUser(result.user);
          router.push({ name: 'home' });
        } else {
          loginError.value = 'El email o la contraseña no coinciden';
        }
      } catch (error) {
        loginError.value = 'El email o la contraseña no coinciden'
        console.error(loginError.value);
      }
    };

    const schema = yup.object({
      email: yup.string().email('Email no es válido').required('Email es requerido'),
      password: yup.string().required('Contraseña es requerida')
    });

    return {
      email,
      password,
      loginWithCredentials,
      loginWithGoogle,
      loginError,
      schema
    };
  },
};
</script>

<style scoped>
.login-wrapper {
  display: flex;
  height: 100vh;
  position: relative;
}

.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 40%;
  padding: 30px;
  background-color: rgba(255, 255, 255, 0.95); /* Slightly transparent white background */
  border-right: 1px solid #ccc;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow for a professional look */
  z-index: 1;
  margin-top: -120px; /* Move the container higher */
}

h1 {
  margin-bottom: 90px; /* Adjusted margin */
  font-size: 2.5rem; /* Increased font size */
  color: #000; /* Black color */
  font-weight: bold;
}

h2 {
  margin-bottom: 20px;
  font-size: 2rem;
  color: #333;
  font-weight: bold;
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
  padding: 10px; /* Increased padding for better usability */
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: border-color 0.3s ease; /* Smooth transition for border color */
}

.form-group input:focus {
  border-color: #007bff; /* Blue border on focus */
  outline: none; /* Remove default outline */
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

.login-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/fondo.jpg'); /* Updated path */
  background-size: cover;
  background-position: center;
  z-index: 0;
  filter: brightness(0.7); /* Darken the background image for better contrast */
}

.error-message {
  color: red;
  margin-top: 10px;
}
</style>