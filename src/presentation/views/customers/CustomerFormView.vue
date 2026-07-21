<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">{{ isEdit ? 'Editar Cliente' : 'Nuevo Cliente' }}</h1>

    <form @submit.prevent="handleSubmit" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 max-w-2xl">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium mb-1">Nombre *</label>
          <input v-model="form.name" required class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Teléfono</label>
          <input v-model="form.phone" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Email</label>
          <input v-model="form.email" type="email" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">RFC</label>
          <input v-model="form.taxId" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
        </div>
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Dirección</label>
        <textarea v-model="form.address" rows="2" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"></textarea>
      </div>
      <div class="flex gap-3">
        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Guardar</button>
        <router-link to="/customers" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Cancelar</router-link>
      </div>
      <p v-if="error" class="mt-4 text-red-500">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCustomers } from '@composables/useCustomers'

const route = useRoute()
const router = useRouter()
const { createCustomer, updateCustomer, loadCustomerById } = useCustomers()

const isEdit = computed(() => !!route.params.id)
const customerId = computed(() => route.params.id as string)
const error = ref('')

const form = ref({
  name: '',
  phone: '',
  email: '',
  address: '',
  taxId: '',
})

onMounted(async () => {
  if (isEdit.value) {
    const customer = await loadCustomerById(customerId.value)
    Object.assign(form.value, customer)
  }
})

async function handleSubmit() {
  error.value = ''
  try {
    if (isEdit.value) {
      await updateCustomer({ id: customerId.value, ...form.value })
    } else {
      await createCustomer(form.value)
    }
    router.push('/customers')
  } catch (err: any) {
    error.value = err.message || 'Error al guardar'
  }
}
</script>
