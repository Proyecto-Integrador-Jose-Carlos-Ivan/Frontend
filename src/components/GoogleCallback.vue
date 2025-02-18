<template>
    <div>
      <p>Procesando autenticación con Google...</p>
    </div>
  </template>
  
  <script>
  import { onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useApiStore } from '@/stores/api';
  
  export default {
    setup() {
      const router = useRouter();
      const apiStore = useApiStore();
  
      onMounted(async () => {
        // Obtener el token de la URL (si el backend lo envía como parámetro)
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
  
        if (token) {
          // Guardar el token en el store y en localStorage
          localStorage.setItem('token', token);
          apiStore.token = token;
  
          // Redirigir al usuario a la página de inicio
          router.push({ name: 'home' });
        } else {
          // Si no hay token, mostrar un error o redirigir al login
          console.error('No se recibió el token de Google');
          router.push({ name: 'login' });
        }
      });
  
      return {};
    },
  };
  </script>