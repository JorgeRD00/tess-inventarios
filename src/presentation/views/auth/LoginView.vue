<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
    <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
      <h1 class="text-2xl font-bold mb-6 text-center">TESS Inventario</h1>
      <p class="text-center text-gray-500 dark:text-gray-400 mb-6">Inicia sesión para continuar</p>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Usuario</label>
          <input
            v-model="form.username"
            type="text"
            required
            class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Contraseña</label>
          <input
            v-model="form.password"
            type="password"
            required
            class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <button
          type="submit"
          class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Ingresar
        </button>
      </form>

      <p v-if="error" class="mt-4 text-red-500 text-center">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@stores/user.store'

const router = useRouter()
const userStore = useUserStore()

const form = ref({ username: '', password: '' })
const error = ref('')

async function handleLogin() {
  error.value = ''
  try {
    await userStore.login(form.value)
    router.push('/dashboard')
  } catch (err: any) {
    error.value = err.message || 'Error al iniciar sesión'
  }
}
</script>
