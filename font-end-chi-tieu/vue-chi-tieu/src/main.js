import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'vue-toastification/dist/index.css'
import './assets/tailwind.css'

import { createApp } from 'vue'
import BootstrapVue3 from 'bootstrap-vue-3'
import Toast from 'vue-toastification'
import App from './App.vue'
import router from '@/router/router.js'

const app = createApp(App)
app.use(Toast, {
  transition: 'Vue-Toastification__bounce',
  maxToasts: 20,
  newestOnTop: true,
})
app.use(BootstrapVue3)
app.use(router)
app.mount('#app')

// 