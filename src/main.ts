import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import { useUserStore } from '@stores/user.store'
import './assets/styles/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

const userStore = useUserStore()
userStore.rehydrateUser()

// Force re-login if we have a token but no user data (e.g. after this update)
if (localStorage.getItem('auth_token') && !userStore.currentUser) {
  userStore.logout()
}

app.use(router)

app.mount('#app')
