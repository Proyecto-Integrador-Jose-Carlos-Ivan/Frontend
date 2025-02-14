<template>
  <div id="app">
    <AppMenu />
    <div class="content">
      <router-view></router-view>
    </div>
    <AppFooter />
  </div>
</template>

<script>
import AppMenu from './components/AppMenu.vue'
import AppFooter from './components/AppFooter.vue'


export default {
  name: 'App',
  components: {
    AppMenu,
    AppFooter
  },
  
}
</script>

<style>
body {
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f4f4f4;
  margin: 0;
  padding: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  flex: 1 0 auto;
}

.logout-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: inherit;
  padding: 0;
}
</style>