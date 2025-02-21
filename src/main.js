import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VCalendar from 'v-calendar';
import 'v-calendar/style.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar Bootstrap CSS
import './assets/css/main.css';

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VCalendar, {})

app.mount('#app')



