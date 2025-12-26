import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import i18n from './i18n'
import App from './App.vue'

// Import main styles (Tailwind CSS v4)
import './assets/styles/main.css'

// Create Vue app
const app = createApp(App)

// Initialize Pinia (must be before router for auth store)
const pinia = createPinia()
app.use(pinia)

// Initialize router
app.use(router)

// Initialize i18n
app.use(i18n)

// Mount app
app.mount('#app')
