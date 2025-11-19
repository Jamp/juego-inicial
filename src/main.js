import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { registerSW } from 'virtual:pwa-register'

// Registrar service worker para PWA
const updateSW = registerSW({
  onNeedRefresh() {
    console.log('Nueva versión disponible')
  },
  onOfflineReady() {
    console.log('App lista para funcionar offline')
  },
})

createApp(App).mount('#app')
