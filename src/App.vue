<template>
  <div id="app">
    <AppMenu />

    <router-view /> <!-- Aquí se mostrarán las vistas según las rutas -->
    
  </div>
</template>

<script>
import AppMenu from './components/AppMenu.vue';

export default {
  components: {
    AppMenu,
  },
};
</script>

