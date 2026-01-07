import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router' // <--- Importar
import i18n from '@core/i18n' // <--- Importar

const app = createApp(App)

app.use(router) // <--- Usar
app.use(i18n) // <--- Inyectar
app.mount('#app')